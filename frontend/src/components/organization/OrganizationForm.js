import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    getOrganizationStructure,
    addDirection, updateDirection,
    addService, updateService,
    addDivision, updateDivision
} from '../../services/organizationService';
import notificationService from '../../utils/notificationService';
import {
    Container, Paper, Typography, TextField, Button, MenuItem,
    Box, CircularProgress, Grid
} from '@mui/material';

const OrganizationForm = () => {
    const navigate = useNavigate();
    const { type: paramType, id: paramId } = useParams();
    const isEditMode = !!paramId;
    
    const [structure, setStructure] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Determine initial type from URL or default to 'direction'
    const initialType = paramType || 'direction';

    useEffect(() => {
        const fetchStructure = async () => {
            try {
                const data = await getOrganizationStructure();
                setStructure(data);
                
                // Populate form if in edit mode
                if (isEditMode && paramId && data.length > 0) {
                    let foundItem = null;
                    let foundDir = null;
                    let foundSrv = null;

                    if (paramType === 'direction') {
                        foundItem = data.find(d => d.id === parseInt(paramId));
                    } else if (paramType === 'service') {
                        for (const dir of data) {
                            const srv = dir.serviceUnits?.find(s => s.id === parseInt(paramId));
                            if (srv) {
                                foundItem = srv;
                                foundDir = dir;
                                break;
                            }
                        }
                    } else if (paramType === 'division') {
                        for (const dir of data) {
                            for (const srv of dir.serviceUnits || []) {
                                const div = srv.divisions?.find(d => d.id === parseInt(paramId));
                                if (div) {
                                    foundItem = div;
                                    foundDir = dir;
                                    foundSrv = srv;
                                    break;
                                }
                            }
                            if (foundItem) break;
                        }
                    }

                    if (foundItem) {
                        formik.setValues({
                            type: paramType,
                            name: foundItem.name,
                            description: foundItem.description || '',
                            missions: foundItem.missions || '',
                            objectives: foundItem.objectives || '',
                            address: foundItem.address || '',
                            managerName: foundItem.managerName || '',
                            directionId: foundDir ? foundDir.id : (paramType === 'direction' ? '' : ''),
                            serviceId: foundSrv ? foundSrv.id : ''
                        });
                    } else {
                        notificationService.error("Élément introuvable");
                        navigate('/organization');
                    }
                }
            } catch (error) {
                console.error(error);
                notificationService.error("Erreur lors du chargement de la structure");
            }
        };
        fetchStructure();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, paramType, paramId]);

    const validationSchema = Yup.object({
        type: Yup.string().required('Type est requis'),
        name: Yup.string().required('Nom est requis'),
        description: Yup.string(),
        address: Yup.string().required('Adresse est requise'),
        managerName: Yup.string().required('Responsable est requis'),
        directionId: Yup.string().when('type', {
            is: (val) => val === 'service' || val === 'division',
            then: Yup.string().required('Direction est requise')
        }),
        serviceId: Yup.string().when('type', {
            is: 'division',
            then: Yup.string().required('Service est requis')
        })
    });

    const formik = useFormik({
        initialValues: {
            type: initialType,
            name: '',
            description: '',
            missions: '',
            objectives: '',
            address: '',
            managerName: '',
            directionId: '',
            serviceId: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (values.type === 'direction') {
                    const directionData = { 
                        name: values.name, 
                        description: values.description,
                        missions: values.missions,
                        objectives: values.objectives,
                        address: values.address,
                        managerName: values.managerName
                    };
                    if (isEditMode) await updateDirection(paramId, directionData);
                    else await addDirection(directionData);
                } else if (values.type === 'service') {
                    const serviceData = { 
                        name: values.name, 
                        description: values.description,
                        missions: values.missions,
                        objectives: values.objectives,
                        address: values.address,
                        managerName: values.managerName,
                        direction: { id: values.directionId }
                    };
                    if (isEditMode) await updateService(paramId, serviceData);
                    else await addService(values.directionId, { 
                        name: values.name, 
                        description: values.description,
                        missions: values.missions,
                        objectives: values.objectives,
                        address: values.address,
                        managerName: values.managerName
                    });
                } else if (values.type === 'division') {
                    const divisionData = {
                        name: values.name,
                        description: values.description,
                        missions: values.missions,
                        objectives: values.objectives,
                        address: values.address,
                        managerName: values.managerName,
                        serviceUnit: { id: values.serviceId }
                    };
                    if (isEditMode) await updateDivision(paramId, divisionData);
                    else await addDivision(values.serviceId, { 
                        name: values.name, 
                        description: values.description,
                        missions: values.missions,
                        objectives: values.objectives,
                        address: values.address,
                        managerName: values.managerName
                    });
                }
                notificationService.success(`${isEditMode ? 'Modification' : 'Ajout'} réussi`);
                navigate('/organization');
            } catch (error) {
                notificationService.error(`Erreur lors de ${isEditMode ? 'la modification' : "l'ajout"}`);
            } finally {
                setLoading(false);
            }
        }
    });

    // Helper to get services based on selected direction
    const getServices = (directionId) => {
        const dir = structure.find(d => d.id === parseInt(directionId));
        return dir ? dir.serviceUnits : [];
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {isEditMode ? 'Modifier' : 'Ajouter'} un élément d'organisation
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                name="type"
                                label="Type d'élément"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                disabled={isEditMode} 
                                error={formik.touched.type && Boolean(formik.errors.type)}
                                helperText={formik.touched.type && formik.errors.type}
                            >
                                <MenuItem value="direction">Direction</MenuItem>
                                <MenuItem value="service">Service</MenuItem>
                                <MenuItem value="division">Division</MenuItem>
                            </TextField>
                        </Grid>

                        {(formik.values.type === 'service' || formik.values.type === 'division') && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    name="directionId"
                                    label="Direction de rattachement"
                                    value={formik.values.directionId}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldValue('serviceId', ''); 
                                    }}
                                    error={formik.touched.directionId && Boolean(formik.errors.directionId)}
                                    helperText={formik.touched.directionId && formik.errors.directionId}
                                >
                                    {structure.map((dir) => (
                                        <MenuItem key={dir.id} value={dir.id}>{dir.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}

                        {formik.values.type === 'division' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    name="serviceId"
                                    label="Service de rattachement"
                                    value={formik.values.serviceId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}
                                    helperText={formik.touched.serviceId && formik.errors.serviceId}
                                    disabled={!formik.values.directionId}
                                >
                                    {getServices(formik.values.directionId)?.map((srv) => (
                                        <MenuItem key={srv.id} value={srv.id}>{srv.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="name"
                                label="Nom"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="address"
                                name="address"
                                label="Adresse"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="managerName"
                                name="managerName"
                                label="Responsable"
                                value={formik.values.managerName}
                                onChange={formik.handleChange}
                                error={formik.touched.managerName && Boolean(formik.errors.managerName)}
                                helperText={formik.touched.managerName && formik.errors.managerName}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                name="description"
                                label="Description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                name="missions"
                                label="Missions"
                                value={formik.values.missions}
                                onChange={formik.handleChange}
                                placeholder="Liste des missions..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                name="objectives"
                                label="Objectifs"
                                value={formik.values.objectives}
                                onChange={formik.handleChange}
                                placeholder="Liste des objectifs..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button onClick={() => navigate('/organization')}>Annuler</Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Enregistrer'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default OrganizationForm;
