import React, { useMemo, useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config/api';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // conservé pour compat backend si nécessaire
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let token = sessionStorage.getItem('csrfToken');
    if (!token) {
      const arr = new Uint8Array(16);
      window.crypto.getRandomValues(arr);
      token = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
      sessionStorage.setItem('csrfToken', token);
    }
    setCsrfToken(token);
  }, []);

  const passwordChecks = useMemo(() => {
    const length = password.length >= 8;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const digit = /[0-9]/.test(password);
    const special = /[^A-Za-z0-9]/.test(password);
    return { length, upper, lower, digit, special };
  }, [password]);
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const formValid =
    fullName.trim().length >= 2 &&
    emailValid &&
    passwordChecks.length &&
    passwordChecks.upper &&
    passwordChecks.lower &&
    passwordChecks.digit &&
    passwordChecks.special &&
    passwordsMatch &&
    termsAccepted;

  const canAttemptRegister = () => {
    const key = 'registerAttempts';
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const maxAttempts = 5;
    const raw = localStorage.getItem(key);
    const attempts = raw ? JSON.parse(raw).filter(ts => now - ts < windowMs) : [];
    if (attempts.length >= maxAttempts) return false;
    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!canAttemptRegister()) {
      setError("Trop de tentatives d'inscription. Réessayez dans quelques minutes.");
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const enc = new TextEncoder();
      const digest = await crypto.subtle.digest('SHA-256', enc.encode(password));
      const hashArray = Array.from(new Uint8Array(digest));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const response = await fetch(API_URLS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'X-Password-Hash': hashHex,
        },
        body: JSON.stringify({
          username: username || email,
          email,
          fullName,
          password,
        }),
      });

      setLoading(false);

      if (response.ok) {
        setSuccessOpen(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Erreur lors de l’inscription. Veuillez réessayer.');
      }
    } catch (err) {
      setLoading(false);
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoToLogin = () => {
    setSuccessOpen(false);
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #76c7c5 0%, #3aa7a4 100%)',
        padding: 2,
        borderRadius: 6,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 960,
          boxShadow: '0 25px 70px rgba(15, 23, 42, 0.25)',
          borderRadius: 4,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 0.9fr' },
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
            Créez votre compte
          </Typography>
          <Typography>
            Rejoignez la plateforme de gestion des employés pour simplifier l’onboarding, gérer l'organisation et obtenir des insights rapidement.
          </Typography>
          <Stack spacing={1.2}>
            {[
              { icon: <RocketLaunchIcon />, text: 'Prête à être utilisée en quelques minutes' },
              { icon: <ShieldIcon />, text: 'Accès sécurisé avec routes protégées' },
              { icon: <CheckCircleIcon />, text: 'Données prêtes à l’export par défaut' },
            ].map(item => (
              <Stack key={item.text} direction="row" spacing={1} alignItems="center">
                {item.icon}
                <Typography variant="body2">{item.text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
        <CardContent
          sx={{
            padding: { xs: 3, md: 4 },
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography variant="h5" component="h2" textAlign="center" sx={{ marginBottom: '0.5rem', fontWeight: 700 }}>
            Inscription
          </Typography>
          {error && (
            <Alert severity="error" variant="outlined" sx={{ mb: 1 }} role="alert" aria-live="polite">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit} aria-label="Formulaire d'inscription DGI">
            <TextField
              fullWidth
              label="Nom complet"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              inputProps={{ 'aria-label': 'Nom complet', autoComplete: 'name' }}
              InputProps={{ style: { fontFamily: 'Poppins, sans-serif' } }}
            />
            <TextField
              fullWidth
              label="Adresse email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              error={Boolean(email) && !emailValid}
              helperText={Boolean(email) && !emailValid ? 'Format email invalide' : ' '}
              inputProps={{ 'aria-label': 'Adresse email', autoComplete: 'email' }}
              InputProps={{ style: { fontFamily: 'Poppins, sans-serif' } }}
            />
            <TextField
              fullWidth
              label="Nom d’utilisateur"
              value={username}
              onChange={e => setUsername(e.target.value)}
              sx={{ marginBottom: '1rem' }}
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
              sx={{ marginBottom: '1rem' }}
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
            <Stack spacing={0.5} sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#334155' }}>
                Exigences de complexité:
              </Typography>
              <Typography variant="caption" sx={{ color: passwordChecks.length ? '#16a34a' : '#ef4444' }}>
                • 8 caractères minimum
              </Typography>
              <Typography variant="caption" sx={{ color: passwordChecks.upper ? '#16a34a' : '#ef4444' }}>
                • Au moins une majuscule
              </Typography>
              <Typography variant="caption" sx={{ color: passwordChecks.lower ? '#16a34a' : '#ef4444' }}>
                • Au moins une minuscule
              </Typography>
              <Typography variant="caption" sx={{ color: passwordChecks.digit ? '#16a34a' : '#ef4444' }}>
                • Au moins un chiffre
              </Typography>
              <Typography variant="caption" sx={{ color: passwordChecks.special ? '#16a34a' : '#ef4444' }}>
                • Au moins un caractère spécial
              </Typography>
            </Stack>
            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              error={Boolean(confirmPassword) && !passwordsMatch}
              helperText={Boolean(confirmPassword) && !passwordsMatch ? 'Les mots de passe ne correspondent pas' : ' '}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle confirm password visibility" onClick={handleToggleConfirmPasswordVisibility} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  fontFamily: 'Poppins, sans-serif',
                },
              }}
            />
            <FormControlLabel
              control={<Checkbox checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />}
              label={
                <Typography variant="body2" sx={{ color: '#334155' }}>
                  J’accepte les conditions d’utilisation
                </Typography>
              }
              sx={{ mb: 1 }}
            />
            <Divider sx={{ mb: 1 }} />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={!formValid}
                sx={{ py: 1.2, backgroundColor: '#3aa7a4', '&:hover': { backgroundColor: '#2f8f8d' } }}
                aria-disabled={!formValid}
              >
                S’inscrire
              </Button>
            )}
            <Typography textAlign="center" sx={{ marginTop: '1rem' }}>
              Vous avez déjà un compte ?{' '}
              <Button color="primary" component="a" href="/login">
                Se connecter
              </Button>
            </Typography>
          </form>
        </CardContent>
      </Card>

      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)} aria-labelledby="register-success-title">
        <DialogTitle id="register-success-title">Bienvenue à bord !</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Votre compte est prêt. Si la vérification par email est requise, vous recevrez un message avec les instructions. Rendez-vous sur la page de
            connexion pour accéder au tableau de bord.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleGoToLogin}>
            Aller à la connexion
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register;
