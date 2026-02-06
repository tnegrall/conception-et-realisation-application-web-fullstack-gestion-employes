import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import jsPDF from 'jspdf'; // Removed as we use backend generation
import { getEmployeeById, getProfilePhoto, uploadProfilePhoto, getEmployeeActions, downloadEmployeePdf } from '../services/employeeService';
import { getContractsByEmployeeId } from '../services/contractService';
import ContractsTab from './tabs/ContractsTab';
import PositionTab from './tabs/PositionTab';
import ReviewsTab from './tabs/ReviewsTab';
import DocumentsTab from './tabs/DocumentsTab';
import TrainingsTab from './tabs/TrainingsTab';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Skeleton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Cake as CakeIcon,
  Work as WorkIcon
} from '@mui/icons-material';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [contracts, setContracts] = useState([]);
  const [actions, setActions] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, photoData, contractData, actionData] = await Promise.all([
        getEmployeeById(id),
        getProfilePhoto(id),
        getContractsByEmployeeId(id),
        getEmployeeActions(id)
      ]);
      setEmployee(empData);
      setContracts(contractData || []);
      setActions(actionData || []);
      if (photoData && photoData.base64Image) {
        setPhoto(`data:${photoData.contentType};base64,${photoData.base64Image}`);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données de l'employé.");
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        setUploadError("La taille du fichier ne doit pas dépasser 2MB.");
        return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(null);
      
      await uploadProfilePhoto(id, file);
      
      // Refresh photo
      const photoData = await getProfilePhoto(id);
      if (photoData && photoData.base64Image) {
        setPhoto(`data:${photoData.contentType};base64,${photoData.base64Image}`);
      }
      setUploadSuccess("Photo mise à jour avec succès !");
    } catch (err) {
      console.error(err);
      setUploadError("Erreur lors de l'upload de la photo.");
    } finally {
      setUploading(false);
    }
  };

  const generatePDF = async () => {
    if (!employee) return;

    try {
      setUploadError(null);
      setPdfLoading(true);
      const pdfBlob = await downloadEmployeePdf(employee.id);
      
      // Create object URL from the blob
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fiche_employe_${employee.matricule || employee.lastName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF", error);
      // Only show error if it's a real error, not a successful download that was misinterpreted
      if (error?.response?.status !== 200) {
          setUploadError("Erreur lors de la génération du PDF.");
      }
    } finally {
      setPdfLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatActionDate = value => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeContract = contracts.find(c => c.status === 'ACTIF') || contracts[0] || null;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={300} />
            </Grid>
            <Grid item xs={12} md={8}>
                <Skeleton variant="text" height={60} />
                <Skeleton variant="rectangular" height={200} />
            </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!employee) return <Alert severity="info" sx={{ mt: 4 }}>Employé introuvable</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      {/* Header Actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
          variant="outlined"
        >
          Retour
        </Button>
        <Box>
            <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EditIcon />}
                onClick={() => navigate(`/edit-employee/${id}`)}
                sx={{ mr: 1 }}
            >
                Modifier
            </Button>
            <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={pdfLoading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                onClick={generatePDF}
                disabled={pdfLoading}
            >
                {pdfLoading ? "Génération..." : "PDF"}
            </Button>
        </Box>
      </Box>

      {uploadSuccess && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setUploadSuccess(null)}>{uploadSuccess}</Alert>}
      {uploadError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>{uploadError}</Alert>}

      <Grid container spacing={3}>
        {/* Left Column: Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={photo || "/static/images/avatar/default.jpg"}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  sx={{ width: 150, height: 150, margin: '0 auto', border: '4px solid #fff', boxShadow: 3 }}
                />
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="icon-button-file"
                    type="file"
                    onChange={handlePhotoUpload}
                />
                <label htmlFor="icon-button-file">
                    <IconButton color="primary" aria-label="upload picture" component="span" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper' }}>
                        {uploading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
                    </IconButton>
                </label>
            </Box>
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {employee.jobTitle}
            </Typography>
            <Chip 
                label={employee.directionName || "Aucune direction"} 
                color="primary" 
                variant="outlined" 
                sx={{ mb: 2 }} 
            />
            {employee.serviceUnitName && (
                <Chip 
                    label={employee.serviceUnitName} 
                    color="secondary" 
                    variant="outlined" 
                    sx={{ mb: 2, ml: 1 }} 
                />
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'left' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <WorkIcon color="action" fontSize="small" />
                    <Typography variant="body2">Matricule: {employee.matricule || 'N/A'}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <CakeIcon color="action" fontSize="small" />
                    <Typography variant="body2">Né(e) le: {employee.dateOfBirth || 'N/A'}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <BadgeIcon color="action" fontSize="small" />
                    <Typography variant="body2">Age: {employee.age} ans</Typography>
                </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Details & Tabs */}
        <Grid item xs={12} md={8}>
            <Card elevation={2} sx={{ mb: 3 }}>
                <CardHeader title="Informations Personnelles" titleTypographyProps={{ variant: 'h6' }} />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Prénom</Typography>
                            <Typography variant="body1">{employee.firstName || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Nom</Typography>
                            <Typography variant="body1">{employee.lastName || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Date de naissance</Typography>
                            <Typography variant="body1">{employee.dateOfBirth || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Âge</Typography>
                            <Typography variant="body1">{employee.age ? `${employee.age} ans` : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Genre</Typography>
                            <Typography variant="body1">{employee.gender || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Numéro sécurité sociale</Typography>
                            <Typography variant="body1">{employee.ssn || 'XXX-XX-XXXX'}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card elevation={2} sx={{ mb: 3 }}>
                <CardHeader title="Informations Professionnelles" titleTypographyProps={{ variant: 'h6' }} />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Organisme</Typography>
                            <Typography variant="body1">{employee.divisionName || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Service</Typography>
                            <Typography variant="body1">{employee.serviceUnitName || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Direction</Typography>
                            <Typography variant="body1">{employee.directionName || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Poste</Typography>
                            <Typography variant="body1">{employee.positionTitle || employee.jobTitle || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Grade</Typography>
                            <Typography variant="body1">{activeContract?.grade || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Contrat</Typography>
                            <Typography variant="body1">{activeContract?.type || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Date d'embauche</Typography>
                            <Typography variant="body1">{employee.hireDate || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card elevation={2} sx={{ mb: 3 }}>
                <CardHeader title="Coordonnées" titleTypographyProps={{ variant: 'h6' }} />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography 
                                    variant="body1" 
                                    sx={{ color: 'text.primary' }}
                                >
                                    {employee.email || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">Mobile: {employee.mobilePhone || 'N/A'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">Fixe: {employee.homePhone || 'N/A'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    {employee.street || ''} {employee.zipCode || ''} {employee.city || ''} {employee.country || ''}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card elevation={2} sx={{ mb: 3 }}>
                <CardHeader title="Historique RH" titleTypographyProps={{ variant: 'h6' }} />
                <Divider />
                <CardContent>
                    {actions.length ? (
                        <Stack spacing={1}>
                            {actions.map(action => (
                                <Paper key={action.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                {action.actionType?.replaceAll('_', ' ') || 'Action RH'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {action.details || 'Mise à jour du dossier'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                            <Typography variant="body2">{action.actor || 'RH'}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatActionDate(action.actionAt)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Aucune action RH enregistrée pour le moment.
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Tabs for RH Features */}
            <Paper elevation={2}>
                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                <Tab label="Contrats" />
                <Tab label="Poste & Missions" />
                <Tab label="Évaluations" />
                <Tab label="Documents" />
                <Tab label="Formations" />
            </Tabs>
            <Box sx={{ p: 3 }}>
                {tabValue === 0 && <ContractsTab employeeId={id} />}
                {tabValue === 1 && <PositionTab employeeId={id} employeeName={`${employee.firstName} ${employee.lastName}`} />}
                {tabValue === 2 && <ReviewsTab employeeId={id} />}
                {tabValue === 3 && <DocumentsTab employeeId={id} />}
                {tabValue === 4 && <TrainingsTab employeeId={id} />}
            </Box>
            </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeProfile;
