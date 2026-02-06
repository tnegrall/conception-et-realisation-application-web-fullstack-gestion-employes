import React, { useEffect, useState } from 'react';
import { getOrganizationStructure } from '../services/organizationService';
import notificationService from '../utils/notificationService';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Collapse,
  Container,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { ExpandLess, ExpandMore, AccountBalance, Business, FolderShared } from '@mui/icons-material';

const OrganizationChart = () => {
  const [structure, setStructure] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const data = await getOrganizationStructure();
        setStructure(data);
      } catch (error) {
        console.error("Error fetching organization structure", error);
        notificationService.error("Erreur lors du chargement de la structure organisationnelle");
      } finally {
        setLoading(false);
      }
    };
    fetchStructure();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        Structure Organisationnelle de la DGI
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 4, color: 'text.secondary' }}>
        Vue hiérarchique des Directions, Services et Divisions
      </Typography>

      <Grid container spacing={3}>
        {structure.map((direction) => (
          <Grid item xs={12} key={direction.id}>
            <DirectionCard direction={direction} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const DirectionCard = ({ direction }) => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box 
            onClick={handleClick}
            sx={{ 
                p: 2, 
                bgcolor: '#e3f2fd', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalance color="primary" sx={{ mr: 2 }} />
                <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {direction.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {direction.description}
                    </Typography>
                </Box>
            </Box>
            {open ? <ExpandLess /> : <ExpandMore />}
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
                {direction.serviceUnits && direction.serviceUnits.length > 0 ? (
                    <Grid container spacing={2}>
                        {direction.serviceUnits.map(service => (
                            <Grid item xs={12} md={6} key={service.id}>
                                <ServiceCard service={service} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        Aucun service rattaché.
                    </Typography>
                )}
            </Box>
        </Collapse>
    </Paper>
  );
};

const ServiceCard = ({ service }) => {
    return (
        <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Business color="secondary" sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {service.name}
                    </Typography>
                </Box>
                {service.divisions && service.divisions.length > 0 ? (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {service.divisions.map(division => (
                            <Chip 
                                key={division.id} 
                                icon={<FolderShared sx={{ fontSize: 16 }} />} 
                                label={division.name} 
                                size="small" 
                                variant="outlined" 
                                color="default"
                            />
                        ))}
                    </Box>
                ) : (
                    <Typography variant="caption" color="text.secondary">
                        Pas de division
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default OrganizationChart;
