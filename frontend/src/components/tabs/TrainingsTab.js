import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, Grid, DialogContentText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getTrainingsByEmployeeId, createTraining, updateTraining, deleteTraining } from '../../services/trainingService';
import notificationService from '../../utils/notificationService';

const TrainingsTab = ({ employeeId }) => {
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentTraining, setCurrentTraining] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [trainingToDelete, setTrainingToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        duration: '',
        institution: ''
    });

    const loadTrainings = useCallback(async () => {
        try {
            const data = await getTrainingsByEmployeeId(employeeId);
            setTrainings(data || []);
        } catch (error) {
            console.error("Error loading trainings", error);
            if (error.response && error.response.status !== 404) {
                notificationService.error("Erreur lors du chargement des formations");
            } else {
                setTrainings([]);
            }
        }
    }, [employeeId]);

    useEffect(() => {
        if (employeeId) {
            loadTrainings();
        }
    }, [employeeId, loadTrainings]);

    const handleOpen = (training = null) => {
        if (training) {
            setCurrentTraining(training);
            setFormData({
                name: training.name,
                startDate: training.startDate,
                duration: training.duration,
                institution: training.institution
            });
        } else {
            setCurrentTraining(null);
            setFormData({
                name: '',
                startDate: '',
                duration: '',
                institution: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentTraining(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!employeeId) {
             notificationService.error("Erreur: ID de l'employé manquant");
             return;
        }
        setLoading(true);
        try {
            if (currentTraining) {
                await updateTraining(currentTraining.id, formData);
                notificationService.success("Formation mise à jour avec succès");
            } else {
                await createTraining(employeeId, formData);
                notificationService.success("Formation ajoutée avec succès");
            }
            loadTrainings();
            handleClose();
        } catch (error) {
            console.error("Error saving training", error);
            notificationService.error("Erreur lors de l'enregistrement de la formation");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (training) => {
        setTrainingToDelete(training);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (trainingToDelete) {
            setLoading(true);
            try {
                await deleteTraining(trainingToDelete.id);
                notificationService.success("Formation supprimée avec succès");
                loadTrainings();
            } catch (error) {
                console.error("Error deleting training", error);
                notificationService.error("Erreur lors de la suppression de la formation");
            } finally {
                setLoading(false);
                setDeleteConfirmOpen(false);
                setTrainingToDelete(null);
            }
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Historique des Formations</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Nouvelle Formation
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Intitulé</TableCell>
                            <TableCell>Date Début</TableCell>
                            <TableCell>Durée</TableCell>
                            <TableCell>Institution</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainings.map((training) => (
                            <TableRow key={training.id}>
                                <TableCell>{training.name}</TableCell>
                                <TableCell>{training.startDate}</TableCell>
                                <TableCell>{training.duration}</TableCell>
                                <TableCell>{training.institution}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(training)} color="primary"><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDeleteClick(training)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {trainings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Aucune formation trouvée</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentTraining ? 'Modifier Formation' : 'Nouvelle Formation'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Intitulé de la formation"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date Début"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Durée"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="ex: 3 jours"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Institution / Organisme"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Annuler</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} disabled={loading}>Annuler</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus disabled={loading}>
                        {loading ? 'Suppression...' : 'Supprimer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TrainingsTab;