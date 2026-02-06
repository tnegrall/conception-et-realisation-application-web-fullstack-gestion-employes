import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    getOrganizationStructure, 
    deleteDirection, 
    deleteService, 
    deleteDivision 
} from '../../services/organizationService';
import notificationService from '../../utils/notificationService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Chip,
  Typography,
  IconButton,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem
} from '@mui/material';
import { 
    KeyboardArrowDown, 
    KeyboardArrowRight, 
    Edit, 
    Delete, 
    Business, 
    AccountBalance, 
    FolderShared,
    AccountTree,
    Info
} from '@mui/icons-material';
import OrganizationDetailModal from './OrganizationDetailModal';

const OrganizationList = () => {
  const [structure, setStructure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const [stats, setStats] = useState({ directions: 0, services: 0, divisions: 0 });

  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, id: null });
  const [filterType, setFilterType] = useState('ALL');
  const [detailModal, setDetailModal] = useState({ open: false, entity: null, type: null });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOrganizationStructure();
      setStructure(data);
      calculateStats(data);
    } catch (error) {
      notificationService.error('Erreur lors du chargement de l\'organisation');
    }
    setLoading(false);
  };

  const calculateStats = (data) => {
    let directions = data.length;
    let services = 0;
    let divisions = 0;

    data.forEach(dir => {
        if (dir.serviceUnits) {
            services += dir.serviceUnits.length;
            dir.serviceUnits.forEach(srv => {
                if (srv.divisions) {
                    divisions += srv.divisions.length;
                }
            });
        }
    });

    setStats({ directions, services, divisions });
  };

  const handleDelete = (type, id) => {
    setDeleteDialog({ open: true, type, id });
  };

  const handleViewDetails = (entity, type) => {
    setDetailModal({ open: true, entity, type });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteDialog;
    if (!type || !id) return;

    try {
        if (type === 'direction') await deleteDirection(id);
        if (type === 'service') await deleteService(id);
        if (type === 'division') await deleteDivision(id);
        
        notificationService.success('Élément supprimé avec succès');
        fetchData();
    } catch (error) {
        notificationService.error('Erreur lors de la suppression');
    } finally {
        setDeleteDialog({ open: false, type: null, id: null });
    }
  };

  // Filter logic
  const filteredStructure = structure.filter(dir => 
    dir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dir.serviceUnits?.some(srv => 
        srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.divisions?.some(div => div.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
            Structure Organisationnelle
          </Typography>
          <Typography color="text.secondary">
            Visualisez et gérez l'organigramme multi-niveaux des Directions, Services, Divisions.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
             {/* Exports can be added here similar to DepartmentList */}
          <Button variant="outlined" startIcon={<AccountTree />} component={Link} to="/organization-tree">
            Voir l'organigramme
          </Button>
        </Stack>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1565c0' }}>{stats.directions}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Directions</Typography>
            </Box>
            <AccountBalance sx={{ fontSize: 40, color: '#90caf9' }} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#ef6c00' }}>{stats.services}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Services</Typography>
            </Box>
            <Business sx={{ fontSize: 40, color: '#ffcc80' }} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e7d32' }}>{stats.divisions}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Divisions</Typography>
            </Box>
            <FolderShared sx={{ fontSize: 40, color: '#a5d6a7' }} />
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2}>
            <TextField 
                label="Rechercher..." 
                variant="outlined" 
                fullWidth 
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TextField
                select
                label="Filtrer par type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                size="small"
                sx={{ minWidth: 200 }}
            >
                <MenuItem value="ALL">Tout</MenuItem>
                <MenuItem value="DIRECTION">Direction</MenuItem>
                <MenuItem value="SERVICE">Service</MenuItem>
                <MenuItem value="DIVISION">Division</MenuItem>
            </TextField>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f7fb' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Hiérarchie</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredStructure.map((direction) => (
                        <DirectionRow 
                            key={direction.id} 
                            direction={direction} 
                            onDelete={handleDelete} 
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                    {filteredStructure.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">Aucune donnée trouvée</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
      )}
      
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Êtes-vous sûr de vouloir supprimer cet élément ? 
                Cette action supprimera également tous les sous-éléments associés.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>Annuler</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>

      <OrganizationDetailModal 
        open={detailModal.open}
        onClose={() => setDetailModal({ ...detailModal, open: false })}
        entity={detailModal.entity}
        type={detailModal.type}
      />
    </Box>
  );
};

const DirectionRow = ({ direction, onDelete, onViewDetails }) => {
    const [open, setOpen] = useState(true);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: '#f0f4ff' }}>
                <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => onViewDetails(direction, 'DIRECTION')}>
                        <IconButton aria-label="expand row" size="small" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
                            {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                        </IconButton>
                        <AccountBalance color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, textDecoration: 'underline' }}>{direction.name}</Typography>
                    </Box>
                </TableCell>
                <TableCell><Chip label="Direction" color="primary" size="small" /></TableCell>
                <TableCell align="right">
                    <IconButton size="small" onClick={() => onViewDetails(direction, 'DIRECTION')} color="info"><Info fontSize="small" /></IconButton>
                    <IconButton size="small" component={Link} to={`/edit-organization/direction/${direction.id}`} color="primary"><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => onDelete('direction', direction.id)} color="error"><Delete fontSize="small" /></IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, ml: 4 }}>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    {direction.serviceUnits && direction.serviceUnits.map((service) => (
                                        <ServiceRow key={service.id} service={service} onDelete={onDelete} onViewDetails={onViewDetails} />
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const ServiceRow = ({ service, onDelete, onViewDetails }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => onViewDetails(service, 'SERVICE')}>
                        <IconButton aria-label="expand row" size="small" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
                            {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                        </IconButton>
                        <Business color="secondary" sx={{ mr: 1 }} />
                        <Typography variant="body1" sx={{ textDecoration: 'underline' }}>{service.name}</Typography>
                    </Box>
                </TableCell>
                <TableCell><Chip label="Service" color="warning" size="small" variant="outlined" /></TableCell>
                <TableCell align="right">
                    <IconButton size="small" onClick={() => onViewDetails(service, 'SERVICE')} color="info"><Info fontSize="small" /></IconButton>
                    <IconButton size="small" component={Link} to={`/edit-organization/service/${service.id}`} color="primary"><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => onDelete('service', service.id)} color="error"><Delete fontSize="small" /></IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, ml: 4 }}>
                            <Table size="small" aria-label="divisions">
                                <TableBody>
                                    {service.divisions && service.divisions.map((division) => (
                                        <TableRow key={division.id}>
                                            <TableCell component="th" scope="row">
                                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => onViewDetails(division, 'DIVISION')}>
                                                    <FolderShared color="action" sx={{ mr: 1 }} />
                                                    <Typography variant="body2" sx={{ textDecoration: 'underline' }}>{division.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell><Chip label="Division" size="small" variant="outlined" /></TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => onViewDetails(division, 'DIVISION')} color="info"><Info fontSize="small" /></IconButton>
                                                <IconButton size="small" component={Link} to={`/edit-organization/division/${division.id}`} color="primary"><Edit fontSize="small" /></IconButton>
                                                <IconButton size="small" onClick={() => onDelete('division', division.id)} color="error"><Delete fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default OrganizationList;