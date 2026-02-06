import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllEmployees, deleteEmployee } from '../services/employeeService';
import { getOrganizationStructure } from '../services/organizationService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [denseRows, setDenseRows] = useState(false);

  const formatNumberFR = value => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return new Intl.NumberFormat('fr-FR').format(value);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setShowSnackbar(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getAllEmployees();
          setEmployees(data);
          const structure = await getOrganizationStructure();
          const allDivisions = structure.flatMap(direction =>
            (direction.serviceUnits || []).flatMap(service => service.divisions || [])
          );
          setDivisions(allDivisions);
        } catch (error) {
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [isLoggedIn]);

  const handleDelete = async id => {
    setDeletingEmployeeId(id);
    try {
      await deleteEmployee(id);
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
    } catch (error) {
    }
    setDeletingEmployeeId(null);
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page to 0 whenever search term changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const handleResetFilters = () => {
    setDivisionFilter('all');
    setAgeFilter('all');
    setSortBy('name');
  };

  const handleExportCsv = () => {
    const header = ['Prénom', 'Nom', 'Email', 'Âge', 'Organisme'];
    const rows = employees.map(emp => [
      emp.firstName || '',
      emp.lastName || '',
      emp.email || '',
      emp.age || '',
      emp.divisionName || 'Non attribué',
    ]);

    const escapeCell = cell => `"${cell.toString().replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map(row => row.map(escapeCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
  };

  const filteredEmployees = employees
    .filter(employee => {
      const firstName = employee.firstName || '';
      const lastName = employee.lastName || '';
      const email = employee.email || '';
      const matchesSearch =
        firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDivision = divisionFilter === 'all' || String(employee.divisionId) === divisionFilter;
      const matchesAge =
        ageFilter === 'all' ||
        (ageFilter === 'under30' && employee.age < 30) ||
        (ageFilter === '30to45' && employee.age >= 30 && employee.age <= 45) ||
        (ageFilter === '45plus' && employee.age > 45);
      return matchesSearch && matchesDivision && matchesAge;
    })
    .sort((a, b) => {
      if (sortBy === 'age') {
        return (a.age || 0) - (b.age || 0);
      }
      if (sortBy === 'direction') {
        return (a.divisionName || 'Non attribué').localeCompare(b.divisionName || 'Non attribué');
      }
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return nameA.localeCompare(nameB);
    });
  const paginatedEmployees = filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalEmployees = employees.length;
  const averageAge = employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + (emp.age || 0), 0) / employees.length) : 0;
  const visibleCount = filteredEmployees.length;

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    navigate('/login', { replace: true });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Box>
      <Snackbar open={showSnackbar} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 9 }}>
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          Vous devez être connecté pour accéder à la liste des employés.{' '}
          <span
            onClick={handleLoginRedirect}
            style={{
              color: '#3f51b5',
              textDecoration: 'underline',
              cursor: 'pointer',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => (e.target.style.color = '#f57c00')}
            onMouseLeave={e => (e.target.style.color = '#3f51b5')}
          >
            Se connecter
          </span>
        </Alert>
      </Snackbar>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Employés
          </Typography>
          <Typography color="text.secondary">Recherchez, filtrez et exportez votre annuaire sans quitter la page.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={handleExportCsv}
            sx={{
              borderColor: '#1E3C72',
              color: '#1E3C72',
              '&:hover': { backgroundColor: '#1E3C72', color: '#fff', borderColor: '#1E3C72' },
            }}
          >
            Exporter en CSV
          </Button>
          <Button variant="contained" component={Link} to="/add-employee">
            Ajouter un employé
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7ff 100%)',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Nombre total d'employés
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {formatNumberFR(totalEmployees)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tous organismes confondus
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fdf2e9 0%, #ffe7d4 100%)',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Visibles actuellement
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {formatNumberFR(visibleCount)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Après application des filtres
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ecfdf3 0%, #dcfce7 100%)',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Organismes
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {formatNumberFR(divisions.length)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Disponibles pour l'affectation
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e9defa 0%, #fbfcdb 100%)',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Âge moyen
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {averageAge ? formatNumberFR(averageAge) : '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sur la liste actuelle
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <TextField label="Rechercher par nom ou email..." variant="outlined" value={searchTerm} onChange={handleSearchChange} fullWidth />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="division-filter-label">Organisme</InputLabel>
              <Select
                labelId="division-filter-label"
                value={divisionFilter}
                label="Organisme"
                onChange={e => {
                  setDivisionFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">Tous les organismes</MenuItem>
                {divisions.map(div => (
                  <MenuItem key={div.id} value={String(div.id)}>
                    {div.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="age-filter-label">Âge</InputLabel>
              <Select
                labelId="age-filter-label"
                value={ageFilter}
                label="Âge"
                onChange={e => {
                  setAgeFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">Toutes les tranches</MenuItem>
                <MenuItem value="under30">Moins de 30 ans</MenuItem>
                <MenuItem value="30to45">30 à 45 ans</MenuItem>
                <MenuItem value="45plus">45+</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="sort-filter-label">Trier par</InputLabel>
              <Select
                labelId="sort-filter-label"
                value={sortBy}
                label="Trier par"
                onChange={e => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="name">Nom</MenuItem>
                <MenuItem value="direction">Organisme</MenuItem>
                <MenuItem value="age">Âge</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              Filtres actifs :
            </Typography>
            {divisionFilter !== 'all' && (
              <Chip
                label={`Organisme: ${divisions.find(d => String(d.id) === divisionFilter)?.name || 'N/A'}`}
                onDelete={() => setDivisionFilter('all')}
                color="primary"
                variant="outlined"
              />
            )}
            {ageFilter !== 'all' && (
              <Chip
                label={`Âge : ${
                  ageFilter === 'under30' ? 'Moins de 30 ans' : ageFilter === '30to45' ? '30-45 ans' : '45+'
                }`}
                onDelete={() => setAgeFilter('all')}
                color="primary"
                variant="outlined"
              />
            )}
            {sortBy !== 'name' && <Chip label={`Trié par ${sortBy}`} onDelete={() => setSortBy('name')} color="secondary" variant="outlined" />}
            <Button onClick={handleResetFilters} size="small">
              Réinitialiser
            </Button>
            <FormControlLabel
              control={<Switch checked={denseRows} onChange={e => setDenseRows(e.target.checked)} color="primary" />}
              label="Lignes compactes"
            />
          </Stack>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, width: '100%', overflowX: 'auto' }}>
        <Table size={denseRows ? 'small' : 'medium'} sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f7fb' }}>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2, minWidth: 200 }}>Employé</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2, minWidth: 150 }}>Poste</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2, minWidth: 200, display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2, minWidth: 150 }}>Organisme</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2, minWidth: 80 }}>Âge</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2, minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Contact</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, letterSpacing: 0.2, minWidth: 250 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.length ? (
              paginatedEmployees.map((employee, idx) => (
                <TableRow
                  key={employee.id}
                  hover
                  sx={{
                    height: denseRows ? 56 : 72,
                    backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fbff',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      backgroundColor: '#f0f4ff', // Improved hover color
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', // Softer shadow
                      zIndex: 1, // Ensure row stays above others when transformed
                      position: 'relative' // Needed for z-index
                    },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: '#1E3C72',
                          color: '#fff',
                          width: denseRows ? 30 : 40,
                          height: denseRows ? 30 : 40,
                          fontSize: denseRows ? '0.8rem' : '1rem',
                        }}
                      >
                        {getInitials(employee.firstName, employee.lastName)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>
                          {employee.firstName} {employee.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.divisionName || 'Non attribué'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {employee.jobTemplateTitle || employee.jobTitle || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                          <EmailIcon fontSize="small" sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.primary">{employee.email}</Typography>
                      </Stack>
                  </TableCell>
                  <TableCell>{employee.divisionName || 'Non attribué'}</TableCell>
                  <TableCell>{employee.age ? `${employee.age} ans` : '—'}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Copier l'email">
                        <span>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleCopyEmail(employee.email)}
                            sx={{ minWidth: 36, borderColor: '#1E3C72', color: '#1E3C72', '&:hover': { backgroundColor: '#1E3C72', color: '#fff' } }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </Button>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1} flexWrap="nowrap"> {/* Changed wrap to nowrap */}
                      <Button variant="outlined" size="small" component={Link} to={`/view-employee/${employee.id}`} sx={{ minWidth: 'auto', px: 1 }}>
                        Voir
                      </Button>
                      <Button variant="outlined" size="small" component={Link} to={`/edit-employee/${employee.id}`} sx={{ minWidth: 'auto', px: 1 }}>
                        Modifier
                      </Button>
                      <Tooltip title="Supprimer définitivement l'employé">
                        <span>
                          <Button
                            variant="contained"
                            color="error" // Changed to error for better visual cue
                            size="small"
                            onClick={() => handleDelete(employee.id)}
                            disabled={deletingEmployeeId === employee.id}
                            startIcon={deletingEmployeeId === employee.id ? <CircularProgress size={16} /> : null}
                            sx={{ minWidth: 'auto', px: 1 }}
                          >
                            {deletingEmployeeId === employee.id ? '...' : 'Supprimer'}
                          </Button>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box sx={{ textAlign: 'center', padding: '1.5rem' }}>
                    <Typography variant="subtitle1">Aucun employé ne correspond à vos filtres.</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Essayez d'élargir vos filtres ou ajoutez un nouvel employé pour commencer.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default EmployeeList;
