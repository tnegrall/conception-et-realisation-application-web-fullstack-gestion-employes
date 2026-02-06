import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Box, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getAllJobTemplates, createJobTemplate, updateJobTemplate, deleteJobTemplate } from '../../services/jobTemplateService';
import { getOrganizationStructure } from '../../services/organizationService';
import notificationService from '../../utils/notificationService';

const JobTemplateManager = () => {
  const [jobTemplates, setJobTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  
  // Organization Structure for dropdowns
  const [organization, setOrganization] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableDivisions, setAvailableDivisions] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    directionId: '',
    serviceUnitId: '',
    divisionId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [templatesData, orgData] = await Promise.all([
        getAllJobTemplates(),
        getOrganizationStructure()
      ]);
      setJobTemplates(templatesData);
      setOrganization(orgData);
    } catch (error) {
      console.error("Error fetching data:", error);
      notificationService.error("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  // Hierarchy Handlers
  const handleDirectionChange = (e) => {
    const dirId = e.target.value;
    setFormData({
      ...formData,
      directionId: dirId,
      serviceUnitId: '',
      divisionId: ''
    });
    
    if (dirId) {
      const selectedDir = organization.find(d => d.id === dirId);
      setAvailableServices(selectedDir ? selectedDir.serviceUnits : []);
      setAvailableDivisions([]);
    } else {
      setAvailableServices([]);
      setAvailableDivisions([]);
    }
  };

  const handleServiceChange = (e) => {
    const srvId = e.target.value;
    setFormData({
      ...formData,
      serviceUnitId: srvId,
      divisionId: ''
    });

    if (srvId) {
      const selectedSrv = availableServices.find(s => s.id === srvId);
      setAvailableDivisions(selectedSrv ? selectedSrv.divisions : []);
    } else {
      setAvailableDivisions([]);
    }
  };

  const handleOpenDialog = (template = null) => {
    if (template) {
      setCurrentTemplate(template);
      
      // Pre-fill form logic (needs to handle hierarchy properly)
      // This is a bit tricky if we only have IDs, but let's assume the backend sends full objects or we have IDs
      // The JobTemplate entity has Direction, ServiceUnit, Division objects usually.
      
      const dirId = template.direction ? template.direction.id : '';
      const srvId = template.serviceUnit ? template.serviceUnit.id : '';
      const divId = template.division ? template.division.id : '';

      // Set available lists based on current selection
      if (dirId) {
        const selectedDir = organization.find(d => d.id === dirId);
        setAvailableServices(selectedDir ? selectedDir.serviceUnits : []);
        if (srvId && selectedDir) {
           const selectedSrv = selectedDir.serviceUnits.find(s => s.id === srvId);
           setAvailableDivisions(selectedSrv ? selectedSrv.divisions : []);
        } else {
            setAvailableDivisions([]);
        }
      } else {
          setAvailableServices([]);
          setAvailableDivisions([]);
      }

      setFormData({
        title: template.title,
        description: template.description,
        directionId: dirId,
        serviceUnitId: srvId,
        divisionId: divId
      });
    } else {
      setCurrentTemplate(null);
      setFormData({
        title: '',
        description: '',
        directionId: '',
        serviceUnitId: '',
        divisionId: ''
      });
      setAvailableServices([]);
      setAvailableDivisions([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTemplate(null);
  };

  const handleSave = async () => {
    if (!formData.title) {
        notificationService.warning("Le titre du poste est obligatoire.");
        return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      direction: formData.directionId ? { id: formData.directionId } : null,
      serviceUnit: formData.serviceUnitId ? { id: formData.serviceUnitId } : null,
      division: formData.divisionId ? { id: formData.divisionId } : null
    };

    try {
      if (currentTemplate) {
        await updateJobTemplate(currentTemplate.id, payload);
        notificationService.success("Poste type mis à jour avec succès.");
      } else {
        await createJobTemplate(payload);
        notificationService.success("Poste type créé avec succès.");
      }
      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving job template:", error);
      notificationService.error("Erreur lors de l'enregistrement.");
    }
  };

  const handleDeleteClick = (template) => {
      setCurrentTemplate(template);
      setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
      try {
          await deleteJobTemplate(currentTemplate.id);
          notificationService.success("Poste type supprimé.");
          fetchData();
      } catch (error) {
          console.error("Error deleting:", error);
          notificationService.error("Impossible de supprimer ce poste type.");
      } finally {
          setConfirmDeleteOpen(false);
          setCurrentTemplate(null);
      }
  };

  // Helper to get structure name
  const getStructureName = (template) => {
      if (template.division) return `Division: ${template.division.name}`;
      if (template.serviceUnit) return `Service: ${template.serviceUnit.name}`;
      if (template.direction) return `Direction: ${template.direction.name}`;
      return "Non assigné";
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestion des Postes Types
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouveau Poste Type
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Structure de rattachement</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.title}</TableCell>
                  <TableCell>{template.description}</TableCell>
                  <TableCell>{getStructureName(template)}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenDialog(template)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(template)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {jobTemplates.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={4} align="center">Aucun poste type défini.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentTemplate ? "Modifier le Poste Type" : "Nouveau Poste Type"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre du poste"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description / Missions"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>Rattachement Hiérarchique (Optionnel)</Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Direction"
                value={formData.directionId}
                onChange={handleDirectionChange}
              >
                <MenuItem value=""><em>Aucune</em></MenuItem>
                {organization.map((dir) => (
                  <MenuItem key={dir.id} value={dir.id}>{dir.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Service"
                value={formData.serviceUnitId}
                onChange={handleServiceChange}
                disabled={!formData.directionId}
              >
                <MenuItem value=""><em>Aucun</em></MenuItem>
                {availableServices.map((srv) => (
                  <MenuItem key={srv.id} value={srv.id}>{srv.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Division"
                value={formData.divisionId}
                onChange={(e) => setFormData({...formData, divisionId: e.target.value})}
                disabled={!formData.serviceUnitId}
              >
                <MenuItem value=""><em>Aucune</em></MenuItem>
                {availableDivisions.map((div) => (
                  <MenuItem key={div.id} value={div.id}>{div.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
            <Typography>Êtes-vous sûr de vouloir supprimer ce poste type ?</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(false)}>Annuler</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default JobTemplateManager;
