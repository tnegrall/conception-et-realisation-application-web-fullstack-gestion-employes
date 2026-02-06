import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addEmployee, getEmployeeById, updateEmployee } from '../services/employeeService';
import { getOrganizationStructure } from '../services/organizationService';
import { 
  getJobTemplatesByDirection, 
  getJobTemplatesByService, 
  getJobTemplatesByDivision 
} from '../services/jobTemplateService';
import notificationService from '../utils/notificationService';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Grid,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/system';

const CenteredSpinner = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const steps = ['Informations Personnelles', 'Informations Professionnelles', 'Coordonnées'];
const draftStorageKey = 'employeeFormDraft';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [organization, setOrganization] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableJobTemplates, setAvailableJobTemplates] = useState([]);
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
    dateOfBirth: '',
    ssn: '',
    mobilePhone: '',
    homePhone: '',
    emergencyContact: '',
    street: '',
    zipCode: '',
    city: '',
    country: '',
    directionId: '',
    serviceUnitId: '',
    divisionId: '',
    jobTitle: '',
    jobTemplateId: '',
    hireDate: '',
    matricule: '',
    publicServiceEntryDate: '',
    currentPostEntryDate: '',
    previousPosition: '',
    administrativeStatus: '',
    statusCategory: '',
    highestDiploma: '',
    currentAdministrativePosition: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [orgData] = await Promise.all([
            getOrganizationStructure()
        ]);
        setOrganization(orgData);

        if (id) {
          const employeeData = await getEmployeeById(id);
          if (employeeData) {
            setInitialValues({
              firstName: employeeData.firstName || '',
              lastName: employeeData.lastName || '',
              email: employeeData.email || '',
              age: employeeData.age || '',
              gender: employeeData.gender || '',
              dateOfBirth: employeeData.dateOfBirth || '',
              ssn: employeeData.ssn || '',
              mobilePhone: employeeData.mobilePhone || '',
              homePhone: employeeData.homePhone || '',
              emergencyContact: employeeData.emergencyContact || '',
              street: employeeData.street || '',
              zipCode: employeeData.zipCode || '',
              city: employeeData.city || '',
              country: employeeData.country || '',
              directionId: employeeData.directionId || '',
              serviceUnitId: employeeData.serviceUnitId || '',
              divisionId: employeeData.divisionId || '',
              jobTitle: employeeData.jobTitle || '',
              hireDate: employeeData.hireDate || '',
              matricule: employeeData.matricule || '',
              publicServiceEntryDate: employeeData.publicServiceEntryDate || '',
              currentPostEntryDate: employeeData.currentPostEntryDate || '',
              previousPosition: employeeData.previousPosition || '',
              administrativeStatus: employeeData.administrativeStatus || '',
              statusCategory: employeeData.statusCategory || '',
              highestDiploma: employeeData.highestDiploma || '',
              currentAdministrativePosition: employeeData.currentAdministrativePosition || ''
            });
          }
        } else {
          const savedDraft = localStorage.getItem(draftStorageKey);
          if (savedDraft) {
            try {
              const parsed = JSON.parse(savedDraft);
              if (parsed?.values) {
                setInitialValues(prev => ({ ...prev, ...parsed.values }));
              }
              if (Number.isInteger(parsed?.activeStep)) {
                setActiveStep(parsed.activeStep);
              }
            } catch (error) {
              localStorage.removeItem(draftStorageKey);
            }
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);



  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Le prénom est requis'),
    lastName: Yup.string().required('Le nom est requis'),
    email: Yup.string().email('Email invalide').required('L\'email est requis'),
    gender: Yup.string().required('Le genre est requis'),
    dateOfBirth: Yup.string().required('La date de naissance est requise'),
    age: Yup.number().typeError('L\'âge doit être un nombre').positive('L\'âge doit être positif').integer('L\'âge doit être un entier').required('L\'âge est requis'),
    jobTitle: Yup.string().required('Le poste est requis'),
    directionId: Yup.string().required('La direction est requise'),
    serviceUnitId: Yup.string().required('Le service est requis'),
    divisionId: Yup.string().required('La division est requise'),
    hireDate: Yup.string().required('La date d\'embauche est requise'),
    ssn: Yup.string().nullable().notRequired().min(9, 'Le numéro de sécurité sociale est trop court'),
    mobilePhone: Yup.string().nullable().notRequired().matches(/^[0-9+() -]*$/, 'Numéro de téléphone invalide'),
    homePhone: Yup.string().nullable().notRequired().matches(/^[0-9+() -]*$/, 'Numéro de téléphone invalide'),
    emergencyContact: Yup.string().nullable().notRequired().matches(/^[0-9+() -]*$/, 'Numéro de téléphone invalide')
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        return;
      }
      setIsLoading(true);
      try {
        const payload = {
            ...values,
            directionId: values.directionId ? Number(values.directionId) : null,
            serviceUnitId: values.serviceUnitId ? Number(values.serviceUnitId) : null,
            divisionId: values.divisionId ? Number(values.divisionId) : null,
            jobTemplateId: values.jobTemplateId ? Number(values.jobTemplateId) : null
        };

        if (id) {
          await updateEmployee(id, payload);
          notificationService.success("Employé mis à jour avec succès");
        } else {
          await addEmployee(payload);
          notificationService.success("Employé créé avec succès");
          localStorage.removeItem(draftStorageKey);
        }
        setIsLoading(false);
        navigate('/employees');
      } catch (error) {
        console.error("Error saving employee", error);
        setIsLoading(false);
        const apiMessage = error?.response?.data?.message;
        const apiErrors = error?.response?.data?.errors;
        const firstFieldError = apiErrors ? Object.values(apiErrors)[0] : null;
        notificationService.error(firstFieldError || apiMessage || "Erreur lors de l'enregistrement de l'employé");
      }
    },
  });

  useEffect(() => {
    if (id) return;
    const draftPayload = { values: formik.values, activeStep };
    localStorage.setItem(draftStorageKey, JSON.stringify(draftPayload));
  }, [formik.values, activeStep, id]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        let templates = [];
        if (formik.values.divisionId) {
          templates = await getJobTemplatesByDivision(formik.values.divisionId);
        } else if (formik.values.serviceUnitId) {
          templates = await getJobTemplatesByService(formik.values.serviceUnitId);
        } else if (formik.values.directionId) {
          templates = await getJobTemplatesByDirection(formik.values.directionId);
        }
        setAvailableJobTemplates(templates);
      } catch (error) {
        console.error("Error fetching job templates", error);
        notificationService.error("Impossible de charger les postes types");
      }
    };
    
    if (formik.values.directionId) {
        fetchTemplates();
    } else {
        setAvailableJobTemplates([]);
    }
  }, [formik.values.directionId, formik.values.serviceUnitId, formik.values.divisionId]);

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return ['firstName', 'lastName', 'email', 'gender', 'dateOfBirth', 'ssn', 'age'];
      case 1:
        return ['jobTitle', 'directionId', 'serviceUnitId', 'divisionId', 'jobTemplateId', 'hireDate', 'matricule', 'administrativeStatus', 'statusCategory', 'publicServiceEntryDate', 'currentPostEntryDate', 'previousPosition', 'currentAdministrativePosition', 'highestDiploma'];
      case 2:
        return ['mobilePhone', 'homePhone', 'emergencyContact', 'street', 'zipCode', 'city', 'country'];
      default:
        return [];
    }
  };

  const handleNext = async () => {
    const fields = getStepFields(activeStep);
    const touched = {};
    let hasError = false;

    // Trigger validation
    const errors = await formik.validateForm();
    
    // Check if any field in the current step has an error
    fields.forEach(field => {
        if (errors[field]) {
            touched[field] = true;
            hasError = true;
        }
    });

    if (hasError) {
        // Mark fields as touched to show errors
        await formik.setTouched({ ...formik.touched, ...touched });
        return;
    }

    // Mark current step as completed
    setCompletedSteps(prev => ({ ...prev, [activeStep]: true }));
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const selectedDirection = organization.find(d => d.id === formik.values.directionId);
  const availableServices = selectedDirection ? selectedDirection.serviceUnits : [];
  const selectedService = availableServices.find(s => s.id === formik.values.serviceUnitId);
  const availableDivisions = selectedService ? selectedService.divisions : [];

  const handleDirectionChange = (e) => {
    formik.setFieldValue('directionId', e.target.value);
    formik.setFieldValue('serviceUnitId', '');
    formik.setFieldValue('divisionId', '');
  };

  const handleServiceChange = (e) => {
    formik.setFieldValue('serviceUnitId', e.target.value);
    formik.setFieldValue('divisionId', '');
  };

  const handleJobTemplateChange = (e) => {
    const templateId = e.target.value;
    formik.setFieldValue('jobTemplateId', templateId);
    
    // Auto-fill title and description if needed, or just keep the link
    const template = availableJobTemplates.find(t => String(t.id) === String(templateId));
    if (template) {
        formik.setFieldValue('jobTitle', template.title);
    }
  };

  const handleDateOfBirthChange = (e) => {
    formik.handleChange(e);
    const age = calculateAge(e.target.value);
    formik.setFieldValue('age', age);
  };

  if (isLoading) {
    return (
      <CenteredSpinner>
        <CircularProgress />
      </CenteredSpinner>
    );
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Prénom"
                required
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Nom"
                required
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                id="gender"
                name="gender"
                label="Genre"
                required
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
              >
                <MenuItem value=""><em>Choisir</em></MenuItem>
                <MenuItem value="F">Femme</MenuItem>
                <MenuItem value="M">Homme</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="dateOfBirth"
                name="dateOfBirth"
                label="Date de Naissance"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                value={formik.values.dateOfBirth}
                onChange={handleDateOfBirthChange}
                error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <TextField
                    fullWidth
                    id="ssn"
                    name="ssn"
                    label="Numéro de Sécurité Sociale"
                    value={formik.values.ssn}
                    onChange={formik.handleChange}
                    error={formik.touched.ssn && Boolean(formik.errors.ssn)}
                    helperText={formik.touched.ssn && formik.errors.ssn}
                  />
                  <Tooltip title="Format sécurisé et crypté">
                    <IconButton>
                        <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
            </Grid>
             <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="age"
                name="age"
                label="Âge"
                type="number"
                required
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                id="jobTemplateId"
                name="jobTemplateId"
                label="Poste Type"
                value={formik.values.jobTemplateId}
                onChange={handleJobTemplateChange}
                disabled={!formik.values.directionId}
                helperText={!formik.values.directionId ? "Sélectionnez une direction d'abord" : availableJobTemplates.length === 0 ? "Aucun poste disponible pour cette structure" : ""}
              >
                 <MenuItem value=""><em>Aucun</em></MenuItem>
                {availableJobTemplates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="jobTitle"
                name="jobTitle"
                label="Titre du poste (Affichage)"
                required
                value={formik.values.jobTitle}
                onChange={formik.handleChange}
                error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                helperText={formik.touched.jobTitle && formik.errors.jobTitle}
              />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>Affectation DGI</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                id="directionId"
                name="directionId"
                label="Direction"
                required
                value={formik.values.directionId}
                onChange={handleDirectionChange}
                error={formik.touched.directionId && Boolean(formik.errors.directionId)}
                helperText={formik.touched.directionId && formik.errors.directionId}
              >
                 <MenuItem value=""><em>Aucune</em></MenuItem>
                {organization.map((dir) => (
                  <MenuItem key={dir.id} value={dir.id}>
                    {dir.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                id="serviceUnitId"
                name="serviceUnitId"
                label="Service"
                required
                value={formik.values.serviceUnitId}
                onChange={handleServiceChange}
                disabled={!formik.values.directionId}
                error={formik.touched.serviceUnitId && Boolean(formik.errors.serviceUnitId)}
                helperText={formik.touched.serviceUnitId && formik.errors.serviceUnitId}
              >
                 <MenuItem value=""><em>Aucun</em></MenuItem>
                {availableServices.map((srv) => (
                  <MenuItem key={srv.id} value={srv.id}>
                    {srv.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                id="divisionId"
                name="divisionId"
                label="Organisme"
                required
                value={formik.values.divisionId}
                onChange={formik.handleChange}
                disabled={!formik.values.serviceUnitId}
                error={formik.touched.divisionId && Boolean(formik.errors.divisionId)}
                helperText={formik.touched.divisionId && formik.errors.divisionId}
              >
                 <MenuItem value=""><em>Aucune</em></MenuItem>
                {availableDivisions.map((div) => (
                  <MenuItem key={div.id} value={div.id}>
                    {div.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
             <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="hireDate"
                name="hireDate"
                label="Date d'embauche"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                value={formik.values.hireDate}
                onChange={formik.handleChange}
                error={formik.touched.hireDate && Boolean(formik.errors.hireDate)}
                helperText={formik.touched.hireDate && formik.errors.hireDate}
              />
            </Grid>
             <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="matricule"
            name="matricule"
            label="Matricule"
            value={formik.values.matricule}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Détails Administratifs</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="administrativeStatus"
            name="administrativeStatus"
            label="Statut Administratif"
            select
            value={formik.values.administrativeStatus}
            onChange={formik.handleChange}
          >
             <MenuItem value="Fonctionnaire">Fonctionnaire</MenuItem>
             <MenuItem value="Contractuel">Contractuel</MenuItem>
             <MenuItem value="Stagiaire">Stagiaire</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="statusCategory"
            name="statusCategory"
            label="Catégorie"
            value={formik.values.statusCategory}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="publicServiceEntryDate"
            name="publicServiceEntryDate"
            label="Date entrée Admin."
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.publicServiceEntryDate}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="currentPostEntryDate"
            name="currentPostEntryDate"
            label="Date entrée Poste Actuel"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.currentPostEntryDate}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="previousPosition"
            name="previousPosition"
            label="Poste Précédent"
            value={formik.values.previousPosition}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="currentAdministrativePosition"
            name="currentAdministrativePosition"
            label="Position Admin. Actuelle"
            value={formik.values.currentAdministrativePosition}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="highestDiploma"
            name="highestDiploma"
            label="Diplôme le plus élevé"
            value={formik.values.highestDiploma}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
    );
      case 2:
        return (
          <Grid container spacing={2}>
             <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="mobilePhone"
                name="mobilePhone"
                label="Téléphone mobile"
                value={formik.values.mobilePhone}
                onChange={formik.handleChange}
                error={formik.touched.mobilePhone && Boolean(formik.errors.mobilePhone)}
                helperText={formik.touched.mobilePhone && formik.errors.mobilePhone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="homePhone"
                name="homePhone"
                label="Téléphone fixe"
                value={formik.values.homePhone}
                onChange={formik.handleChange}
                error={formik.touched.homePhone && Boolean(formik.errors.homePhone)}
                helperText={formik.touched.homePhone && formik.errors.homePhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="emergencyContact"
                name="emergencyContact"
                label="Contact d'urgence"
                value={formik.values.emergencyContact}
                onChange={formik.handleChange}
                error={formik.touched.emergencyContact && Boolean(formik.errors.emergencyContact)}
                helperText={formik.touched.emergencyContact && formik.errors.emergencyContact}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="street"
                name="street"
                label="Rue / Adresse"
                value={formik.values.street}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="zipCode"
                name="zipCode"
                label="Code Postal"
                value={formik.values.zipCode}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="Ville"
                value={formik.values.city}
                onChange={formik.handleChange}
              />
            </Grid>
             <Grid item xs={12}>
              <TextField
                fullWidth
                id="country"
                name="country"
                label="Pays"
                value={formik.values.country}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  const isStepFailed = (step) => {
    const fields = getStepFields(step);
    return fields.some(field => formik.touched[field] && formik.errors[field]);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Modifier l\'employé' : 'Ajouter un employé'}
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepFailed(index)) {
              labelProps.error = true;
            }
            if (completedSteps[index]) {
              stepProps.completed = true;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <form>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              type="button"
            >
              Retour
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button 
                type="button" 
                onClick={formik.handleSubmit}
                variant="contained" 
                color="primary"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained" color="primary" type="button">
                Suivant
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EmployeeForm;
