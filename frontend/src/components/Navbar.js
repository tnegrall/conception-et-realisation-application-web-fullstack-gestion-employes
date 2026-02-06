import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItemText, ListItemButton } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if screen width is below 1000px
  const isMobile = useMediaQuery('(max-width:1000px)');

  const isActive = path => currentPath === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('EMSusername');
    localStorage.removeItem('EMSemail');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ width: 250, backgroundColor: '#3f51b5', height: '100%', color: 'white' }} role="presentation">
      <List>
        <ListItemButton component={Link} to="/" selected={isActive('/')} onClick={handleDrawerToggle}>
          <ListItemText primary="Accueil" sx={{ color: isActive('/') ? '#ff9800' : 'white' }} />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard" selected={isActive('/dashboard')} onClick={handleDrawerToggle}>
          <ListItemText primary="Tableau de bord" sx={{ color: isActive('/dashboard') ? '#ff9800' : 'white' }} />
        </ListItemButton>
        <ListItemButton component={Link} to="/employees" selected={isActive('/employees')} onClick={handleDrawerToggle}>
          <ListItemText primary="Employés" sx={{ color: isActive('/employees') ? '#ff9800' : 'white' }} />
        </ListItemButton>
        <ListItemButton component={Link} to="/organization" selected={isActive('/organization')} onClick={handleDrawerToggle}>
          <ListItemText primary="Organigramme" sx={{ color: isActive('/organization') ? '#ff9800' : 'white' }} />
        </ListItemButton>
        <ListItemButton component={Link} to="/profile" selected={isActive('/profile')} onClick={handleDrawerToggle}>
          <ListItemText primary="Profil" sx={{ color: isActive('/profile') ? '#ff9800' : 'white' }} />
        </ListItemButton>
        <ListItemButton component={Link} to="/login" selected={isActive('/login')} onClick={handleDrawerToggle}>
          <ListItemText
            primary={isLoggedIn ? 'Déconnexion' : 'Connexion'}
            sx={{ color: isLoggedIn ? 'red' : isActive('/login') ? '#ff9800' : 'white' }}
            onClick={isLoggedIn ? handleLogout : null}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          padding: '0.5rem 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <Box
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'white',
            }}
          >
            <Box
              component="img"
              src="/LOGO_DGI_OK.png"
              alt="Direction Générale des Impôts"
              sx={{ height: 40, width: 'auto' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Direction Générale des Impôts
            </Typography>
          </Box>

          {/* Render drawer icon for mobile view */}
          {isMobile ? (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            // Render full menu for desktop view
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button
                color={isActive('/') ? 'primary' : 'inherit'}
                component={Link}
                to="/"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/') ? '#4dd0e1' : 'inherit',
                }}
              >
                Accueil
              </Button>
              <Button
                color={isActive('/dashboard') ? 'primary' : 'inherit'}
                component={Link}
                to="/dashboard"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/dashboard') ? '#4dd0e1' : 'inherit',
                }}
              >
                Tableau de bord
              </Button>
              <Button
                color={isActive('/employees') ? 'primary' : 'inherit'}
                component={Link}
                to="/employees"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/employees') ? '#4dd0e1' : 'inherit',
                }}
              >
                Employés
              </Button>
              <Button
                color={isActive('/organization') ? 'primary' : 'inherit'}
                component={Link}
                to="/organization"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/organization') ? '#4dd0e1' : 'inherit',
                }}
              >
                Organigramme
              </Button>
              <Button
                color={isActive('/job-templates') ? 'primary' : 'inherit'}
                component={Link}
                to="/job-templates"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/job-templates') ? '#4dd0e1' : 'inherit',
                }}
              >
                Postes Types
              </Button>
              <Button
                color={isActive('/profile') ? 'primary' : 'inherit'}
                component={Link}
                to="/profile"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/profile') ? '#4dd0e1' : 'inherit',
                }}
              >
                Profil
              </Button>
              {/* Conditional Login/Logout Button */}
              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#ff5252', // Make logout button red
                  }}
                >
                  Déconnexion
                </Button>
              ) : (
                <Button
                  color={isActive('/login') ? 'primary' : 'inherit'}
                  component={Link}
                  to="/login"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: isActive('/login') ? '#4dd0e1' : 'inherit',
                  }}
                >
                  Connexion
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
