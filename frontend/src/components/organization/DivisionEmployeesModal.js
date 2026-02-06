import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  Avatar,
  Box,
  Typography,
  TablePagination,
  CircularProgress
} from '@mui/material';
import {
  Search,
  Visibility,
  Delete,
  PersonAdd,
  Edit
} from '@mui/icons-material';
import { getDivisionEmployees, removeEmployeeFromDivision } from '../../services/organizationService';
import notificationService from '../../utils/notificationService';
import AssignEmployeeModal from './AssignEmployeeModal';
import ChangeDivisionModal from './ChangeDivisionModal';

const DivisionEmployeesModal = ({ open, onClose, division }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [changeDivisionModalOpen, setChangeDivisionModalOpen] = useState(false);
  const [selectedEmployeeForChange, setSelectedEmployeeForChange] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    if (!division) return;
    setLoading(true);
    try {
      const data = await getDivisionEmployees(division.id);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching division employees", error);
      notificationService.error("Erreur lors du chargement des employés.");
    } finally {
      setLoading(false);
    }
  }, [division]);

  useEffect(() => {
    if (open && division) {
      fetchEmployees();
    }
  }, [open, division, fetchEmployees]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRemoveEmployee = async (employee) => {
    if (!window.confirm(`Voulez-vous vraiment retirer ${employee.firstName} ${employee.lastName} de la division ${division.name} ?`)) {
      return;
    }

    try {
      await removeEmployeeFromDivision(division.id, employee.id);
      notificationService.success("Employé retiré de la division.");
      fetchEmployees();
    } catch (error) {
      console.error("Error removing employee", error);
      notificationService.error("Erreur lors du retrait de l'employé.");
    }
  };

  const handleViewEmployee = (id) => {
    navigate(`/view-employee/${id}`);
  };

  const handleChangeDivision = (employee) => {
    setSelectedEmployeeForChange(employee);
    setChangeDivisionModalOpen(true);
  };

  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    return (
      (employee.firstName && employee.firstName.toLowerCase().includes(query)) ||
      (employee.lastName && employee.lastName.toLowerCase().includes(query)) ||
      (employee.matricule && employee.matricule.toLowerCase().includes(query)) ||
      (employee.jobTitle && employee.jobTitle.toLowerCase().includes(query))
    );
  });

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Employés de la Division : {division?.name}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAdd />}
              onClick={() => setAssignModalOpen(true)}
            >
              Affecter un employé
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <TextField
              placeholder="Rechercher par nom, matricule ou poste..."
              fullWidth
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Photo</TableCell>
                    <TableCell>Matricule</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Poste</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => (
                      <TableRow key={employee.id} hover>
                        <TableCell>
                          <Avatar 
                            src={employee.photoUrl} 
                            alt={employee.lastName}
                          >
                            {employee.firstName ? employee.firstName.charAt(0) : ''}
                          </Avatar>
                        </TableCell>
                        <TableCell>{employee.matricule}</TableCell>
                        <TableCell>{employee.lastName}</TableCell>
                        <TableCell>{employee.firstName}</TableCell>
                        <TableCell>{employee.jobTitle}</TableCell>
                        <TableCell>{employee.serviceUnitName || '-'}</TableCell>
                        <TableCell>
                           {/* Using administrativeStatus or simple status */}
                           <Box 
                             component="span" 
                             sx={{ 
                               color: employee.administrativeStatus === 'ACTIF' ? 'success.main' : 'text.secondary',
                               fontWeight: 'bold'
                             }}
                           >
                             {employee.administrativeStatus || 'N/A'}
                           </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Voir la fiche">
                            <IconButton onClick={() => handleViewEmployee(employee.id)} color="primary" aria-label="voir">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Changer de division">
                            <IconButton onClick={() => handleChangeDivision(employee)} color="info" aria-label="changer-division">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Retirer de la division">
                            <IconButton onClick={() => handleRemoveEmployee(employee)} color="error" aria-label="retirer">
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Aucun employé trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEmployees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <AssignEmployeeModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        division={division}
        onAssignSuccess={fetchEmployees}
      />

      <ChangeDivisionModal
        open={changeDivisionModalOpen}
        onClose={() => setChangeDivisionModalOpen(false)}
        employee={selectedEmployeeForChange}
        onSuccess={fetchEmployees}
      />
    </>
  );
};

export default DivisionEmployeesModal;
