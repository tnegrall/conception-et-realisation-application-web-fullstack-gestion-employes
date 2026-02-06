import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, MenuItem, Grid, Alert, DialogContentText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getContractsByEmployeeId, createContract, updateContract, deleteContract } from '../../services/contractService';
import notificationService from '../../utils/notificationService';

const ContractsTab = ({ employeeId }) => {
    const [contracts, setContracts] = useState([]);
    const [expiringContracts, setExpiringContracts] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentContract, setCurrentContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [contractToDelete, setContractToDelete] = useState(null);
    const [formData, setFormData] = useState({
        type: 'CDI',
        startDate: '',
        endDate: '',
        probationEndDate: '',
        status: 'ACTIF',
        grade: '',
        salaryLevel: ''
    });

    const loadContracts = useCallback(async () => {
        try {
            const data = await getContractsByEmployeeId(employeeId);
            setContracts(data || []);
            checkExpiringContracts(data || []);
        } catch (error) {
            console.error("Error loading contracts", error);
            if (error.response && error.response.status !== 404) {
                notificationService.error("Erreur lors du chargement des contrats");
            } else {
                setContracts([]);
            }
        }
    }, [employeeId]);

    useEffect(() => {
        if (employeeId) {
            loadContracts();
        }
    }, [employeeId, loadContracts]);

    const checkExpiringContracts = (contractsData) => {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const expiring = contractsData.filter(c => {
            if (c.status !== 'ACTIF' || !c.endDate) return false;
            const endDate = new Date(c.endDate);
            return endDate <= thirtyDaysFromNow && endDate >= today;
        });
        setExpiringContracts(expiring);
    };

    const handleOpen = (contract = null) => {
        if (contract) {
            setCurrentContract(contract);
            setFormData({
                type: contract.type,
                startDate: contract.startDate,
                endDate: contract.endDate || '',
                probationEndDate: contract.probationEndDate || '',
                status: contract.status,
                grade: contract.grade || '',
                salaryLevel: contract.salaryLevel || ''
            });
        } else {
            setCurrentContract(null);
            setFormData({
                type: 'CDI',
                startDate: '',
                endDate: '',
                probationEndDate: '',
                status: 'ACTIF',
                grade: '',
                salaryLevel: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentContract(null);
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
            const contractData = { ...formData, employeeId };
            if (currentContract) {
                await updateContract(currentContract.id, contractData);
                notificationService.success("Contrat mis à jour avec succès");
            } else {
                await createContract(contractData);
                notificationService.success("Contrat créé avec succès");
            }
            loadContracts();
            handleClose();
        } catch (error) {
            console.error("Error saving contract", error);
            notificationService.error("Erreur lors de l'enregistrement du contrat");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (contract) => {
        setContractToDelete(contract);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (contractToDelete) {
            setLoading(true);
            try {
                await deleteContract(contractToDelete.id);
                notificationService.success("Contrat supprimé avec succès");
                loadContracts();
            } catch (error) {
                console.error("Error deleting contract", error);
                notificationService.error("Erreur lors de la suppression du contrat");
            } finally {
                setLoading(false);
                setDeleteConfirmOpen(false);
                setContractToDelete(null);
            }
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            {expiringContracts.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Attention : {expiringContracts.length} contrat(s) expire(nt) bientôt (moins de 30 jours).
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Historique des Contrats</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Nouveau Contrat
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Date Début</TableCell>
                            <TableCell>Date Fin</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contracts.map((contract) => (
                            <TableRow key={contract.id}>
                                <TableCell>{contract.type}</TableCell>
                                <TableCell>{contract.startDate}</TableCell>
                                <TableCell>{contract.endDate || '-'}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={contract.status} 
                                        color={contract.status === 'ACTIF' ? 'success' : contract.status === 'EXPIRÉ' ? 'error' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{contract.grade}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(contract)} color="primary"><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDeleteClick(contract)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {contracts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Aucun contrat trouvé</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentContract ? 'Modifier Contrat' : 'Nouveau Contrat'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <MenuItem value="CDI">CDI</MenuItem>
                                <MenuItem value="CDD">CDD</MenuItem>
                                <MenuItem value="STAGE">Stage</MenuItem>
                                <MenuItem value="CONTRACTUEL">Contractuel</MenuItem>
                                <MenuItem value="CONSULTANT">Consultant</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Statut"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="ACTIF">ACTIF</MenuItem>
                                <MenuItem value="EXPIRÉ">EXPIRÉ</MenuItem>
                                <MenuItem value="RÉSILIÉ">RÉSILIÉ</MenuItem>
                            </TextField>
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
                                type="date"
                                label="Date Fin"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Fin Période Essai"
                                name="probationEndDate"
                                value={formData.probationEndDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Grade"
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Niveau Salaire"
                                name="salaryLevel"
                                value={formData.salaryLevel}
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
                        Êtes-vous sûr de vouloir supprimer ce contrat ? Cette action est irréversible.
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

export default ContractsTab;
