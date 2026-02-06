import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { API_URLS } from '../config/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from;
  const destinationLabel = redirectPath ? 'Continuer' : 'Aller au tableau de bord';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URLS.AUTH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('EMSusername', username);
        if (data.email) {
          localStorage.setItem('EMSemail', data.email);
        }
        localStorage.setItem('user', JSON.stringify(data));
        setSuccessOpen(true);
      } else {
        setError('Identifiants invalides. Veuillez réessayer.');
      }
    } catch (err) {
      setLoading(false);
      setError('Identifiants invalides ou le serveur n\'est pas actif. Veuillez réessayer plus tard.');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSuccessContinue = () => {
    const target = redirectPath || '/dashboard';
    setSuccessOpen(false);
    navigate(target);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #76c7c5 0%, #3aa7a4 100%)',
        padding: 2,
        borderRadius: 6,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 900,
          boxShadow: '0 25px 70px rgba(15, 23, 42, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 4,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
          backdropFilter: 'blur(6px)',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #c8ecea 0%, #9adad7 100%)',
            color: '#0f172a',
            padding: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box component="img" src="/LOGO_DGI_OK.png" alt="Direction Générale des Impôts" sx={{ height: 48, width: 'auto' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Direction Générale des Impôts
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
            Espace sécurisé
          </Typography>
          <Typography>Connectez-vous pour accéder à votre tableau de bord, gérer les employés et maintenir votre organisation.</Typography>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 600 }}>Pourquoi se connecter ?</Typography>
            <Typography variant="body2">• Accéder en toute sécurité au tableau de bord riche en informations.</Typography>
            <Typography variant="body2">• Gérer les équipes, organismes et mises à jour en un seul endroit.</Typography>
            <Typography variant="body2">• Reprendre où vous vous êtes arrêté avec votre session sauvegardée.</Typography>
          </Stack>
        </Box>
        <CardContent
          sx={{
            padding: { xs: 3, md: 4 },
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Typography variant="h5" component="h2" textAlign="center" sx={{ marginBottom: '0.5rem', fontWeight: 700 }}>
            Connexion
          </Typography>
          {redirectPath && (
            <Alert severity="info" sx={{ marginBottom: '1rem' }}>
              Veuillez vous connecter pour continuer vers <strong>{redirectPath}</strong>.
            </Alert>
          )}
          <form onSubmit={handleSubmit} aria-label="Formulaire de connexion DGI">
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Nom d'utilisateur"
                value={username}
                onChange={e => setUsername(e.target.value)}
                inputProps={{ 'aria-label': "Nom d'utilisateur", autoComplete: 'username' }}
                aria-invalid={Boolean(error)}
                InputProps={{
                  style: {
                    fontFamily: 'Poppins, sans-serif',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                inputProps={{ 'aria-label': 'Mot de passe', autoComplete: 'current-password' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleTogglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    fontFamily: 'Poppins, sans-serif',
                  },
                }}
              />
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }} aria-busy="true">
                  <CircularProgress aria-label="Chargement" />
                </Box>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{ paddingY: 1.2, backgroundColor: '#3aa7a4', '&:hover': { backgroundColor: '#2f8f8d' } }}
                >
                  Se connecter
                </Button>
              )}
              {error && (
                <Alert severity="error" variant="outlined" sx={{ mt: 1 }} role="alert" aria-live="polite">
                  {error}
                </Alert>
              )}
              <Divider />
              <Stack spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ color: '#334155' }}>
                  Mot de passe oublié ?{' '}
                  <Button component="a" href="/verify-username" size="small" sx={{ color: '#0f766e' }}>
                    Réinitialiser le mot de passe
                  </Button>
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  © Direction Générale des Impôts · Mentions légales ·{' '}
                  <Button component="a" href="/dashboard" size="small" sx={{ color: '#0f766e', textTransform: 'none', padding: 0 }}>
                    Aide
                  </Button>
                </Typography>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Dialog open={successOpen} onClose={handleSuccessContinue} aria-labelledby="login-success-title">
        <DialogTitle id="login-success-title">Connexion réussie</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Bon retour, {username || 'là'} ! Prêt à continuer ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSuccessContinue}>
            {destinationLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
