import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
        color: 'white',
        padding: '2.5rem 0',
        marginTop: '2rem',
        boxShadow: '0 -12px 35px rgba(15, 23, 42, 0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: 220,
          height: 220,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 55%)',
          top: -60,
          right: -40,
          filter: 'blur(2px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 180,
          height: 180,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 55%)',
          bottom: -40,
          left: -30,
          filter: 'blur(2px)',
        }}
      />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              À propos
            </Typography>
            <Typography variant="body2">
              Nous proposons un système complet de gestion des employés qui vous aide à gérer vos collaborateurs et votre organisation en toute simplicité. Notre
              mission est de rendre les processus RH fluides et efficaces.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              Liens rapides
            </Typography>
            <Box>
              <Link href="/" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Accueil
              </Link>
              <Link href="/dashboard" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Tableau de bord
              </Link>
              <Link href="/employees" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Employés
              </Link>
              <Link href="/organization" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Organisation
              </Link>
              <Link href="/profile" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Profil
              </Link>
              <Link href="/login" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Connexion
              </Link>
              <Link href="/register" color="inherit" underline="none" sx={{ display: 'block', '&:hover': { color: '#f57c00' } }}>
                Inscription
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              Contact
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" sx={{ color: '#3aa7a4' }} />
                Steven Christophino
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" sx={{ color: '#3aa7a4' }} />
                <Link href="mailto:stevenchristophino@gmail.com" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: '#3aa7a4' } }}>
                  stevenchristophino@gmail.com
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" sx={{ color: '#3aa7a4' }} />
                <Link href="tel:+261325591502" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: '#3aa7a4' } }}>
                  +261 32 55 91 502
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" sx={{ color: '#3aa7a4' }} />
                Ivato, Antananarivo
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: '2rem',
            paddingTop: '1rem',
          }}
        >
          <Typography variant="body2">© {new Date().getFullYear()} Système de gestion des employés. Tous droits réservés.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
