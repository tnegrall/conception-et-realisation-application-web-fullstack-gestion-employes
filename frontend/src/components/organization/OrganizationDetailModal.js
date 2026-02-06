import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  TextField,
  IconButton,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Description,
  Assignment,
  TrackChanges,
  Group,
  Work,
  Add,
  Delete
} from '@mui/icons-material';
import DivisionEmployeesModal from './DivisionEmployeesModal';
import { getDirectionEmployeeCount, getServiceEmployeeCount, getDivisionEmployeeCount } from '../../services/organizationService';
import { 
  getJobTemplatesByDirection, 
  getJobTemplatesByService, 
  getJobTemplatesByDivision,
  createJobTemplate,
  deleteJobTemplate
} from '../../services/jobTemplateService';
import notificationService from '../../utils/notificationService';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const OrganizationDetailModal = ({ open, onClose, entity, type }) => {
  const [tabValue, setTabValue] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(null);
  const [jobTemplates, setJobTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddJob, setOpenAddJob] = useState(false);
  const [employeesModalOpen, setEmployeesModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '' });

  const fetchDetails = useCallback(async () => {
      if (!entity) return;
      setLoading(true);
      try {
        // Fetch Employee Count
        let count = 0;
        let templates = [];
        if (type === 'DIRECTION') {
          count = await getDirectionEmployeeCount(entity.id);
          templates = await getJobTemplatesByDirection(entity.id);
        } else if (type === 'SERVICE') {
          count = await getServiceEmployeeCount(entity.id);
          templates = await getJobTemplatesByService(entity.id);
        } else if (type === 'DIVISION') {
          count = await getDivisionEmployeeCount(entity.id);
          templates = await getJobTemplatesByDivision(entity.id);
        }
        setEmployeeCount(count);
        setJobTemplates(templates);
      } catch (error) {
        console.error("Error fetching details", error);
        notificationService.error("Erreur lors du chargement des détails.");
      } finally {
        setLoading(false);
      }
  }, [entity, type]);

  useEffect(() => {
    if (open && entity) {
      fetchDetails();
    }
  }, [open, entity, fetchDetails]);

  const handleAddJobOpen = () => {
    setNewJob({ title: '', description: '' });
    setOpenAddJob(true);
  };

  const handleAddJobClose = () => {
    setOpenAddJob(false);
  };

  const handleCreateJob = async () => {
    if (!newJob.title) return;
    try {
      const jobData = {
        title: newJob.title,
        description: newJob.description,
        directionId: type === 'DIRECTION' ? entity.id : null,
        serviceUnitId: type === 'SERVICE' ? entity.id : null,
        divisionId: type === 'DIVISION' ? entity.id : null,
      };
      await createJobTemplate(jobData);
      notificationService.success("Poste type ajouté avec succès.");
      handleAddJobClose();
      fetchDetails();
    } catch (error) {
      console.error("Error creating job template", error);
      notificationService.error("Erreur lors de la création du poste type.");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce poste type ?")) return;
    try {
      await deleteJobTemplate(id);
      notificationService.success("Poste type supprimé.");
      fetchDetails();
    } catch (error) {
      console.error("Error deleting job template", error);
      // Backend throws 500 or 409 usually for constraint violation.
      // We'll rely on the notificationService wrapper or just show generic error if not handled.
      // Since I didn't change the Axios interceptor, I should handle it here or let the service handle it.
      // Assuming deleteJobTemplate might throw.
       if (error.response && error.response.data && error.response.data.message) {
           notificationService.error(error.response.data.message);
       } else {
           notificationService.error("Impossible de supprimer ce poste type (peut-être assigné ?).");
       }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!entity) return null;

  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {type}: {entity.name}
          </Typography>
          {loading ? <CircularProgress size={24} /> : (
            <Chip 
              icon={<Group />} 
              label={`${employeeCount} Employés`} 
              color="primary" 
              variant="outlined" 
              onClick={type === 'DIVISION' ? () => setEmployeesModalOpen(true) : undefined}
              sx={type === 'DIVISION' ? { cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } } : {}}
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="organization details tabs">
            <Tab icon={<Description />} label="Description" />
            <Tab icon={<Assignment />} label="Missions" />
            <Tab icon={<TrackChanges />} label="Objectifs" />
            <Tab icon={<Work />} label="Postes Types" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1">{entity.description || "Aucune description disponible."}</Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1">{entity.missions || "Aucune mission définie."}</Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1">{entity.objectives || "Aucun objectif défini."}</Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={handleAddJobOpen}
              size="small"
            >
              Ajouter un poste
            </Button>
          </Box>
          {jobTemplates.length > 0 ? (
            <List>
              {jobTemplates.map((job) => (
                <React.Fragment key={job.id}>
                  <ListItem>
                    <ListItemText
                      primary={job.title}
                      secondary={job.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteJob(job.id)} color="error">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">Aucun poste type défini pour cette entité.</Typography>
          )}
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>

      {/* Add Job Template Dialog */}
      <Dialog open={openAddJob} onClose={handleAddJobClose} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un poste type</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titre du poste"
            fullWidth
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddJobClose} color="primary">Annuler</Button>
          <Button onClick={handleCreateJob} color="primary" variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
      <DivisionEmployeesModal 
        open={employeesModalOpen} 
        onClose={() => setEmployeesModalOpen(false)} 
        division={type === 'DIVISION' ? entity : null} 
      />
    </>
  );
};

export default OrganizationDetailModal;
