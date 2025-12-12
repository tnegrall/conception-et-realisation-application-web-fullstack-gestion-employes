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
        background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
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
            background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            color: '#1a1a1a',
            padding: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Bon retour
          </Typography>
          <Typography>Connectez-vous pour accéder à votre tableau de bord, gérer les employés et maintenir votre organisation.</Typography>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 600 }}>Pourquoi se connecter ?</Typography>
            <Typography variant="body2">• Accéder en toute sécurité au tableau de bord riche en informations.</Typography>
            <Typography variant="body2">• Gérer les équipes, départements et mises à jour en un seul endroit.</Typography>
            <Typography variant="body2">• Reprendre où vous vous êtes arrêté avec votre session sauvegardée.</Typography>
          </Stack>
        </Box>
        <CardContent
          sx={{
            padding: { xs: 3, md: 4 },
            background: 'rgba(255, 255, 255, 0.9)',
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
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Nom d'utilisateur"
                value={username}
                onChange={e => setUsername(e.target.value)}
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
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Button fullWidth variant="contained" color="primary" type="submit" sx={{ paddingY: 1.2 }}>
                  Se connecter
                </Button>
              )}
              {error && (
                <Typography color="error" textAlign="center" sx={{ marginTop: '-0.5rem' }}>
                  {error}
                </Typography>
              )}
              <Divider />
              <Stack spacing={1} alignItems="center">
                <Typography variant="body2">
                  Vous n'avez pas de compte ?{' '}
                  <Button color="primary" component="a" href="/register" size="small">
                    S'inscrire
                  </Button>
                </Typography>
                <Typography variant="body2">
                  Mot de passe oublié ?{' '}
                  <Button color="primary" component="a" href="/verify-username" size="small">
                    Réinitialiser le mot de passe
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
