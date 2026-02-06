import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getEmployeesLastUpdated } from '../services/employeeService';
import { getDashboardStats } from '../services/statsService';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Card, CardContent, Grid, Typography, Box, CircularProgress, Button, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupWorkIcon from '@mui/icons-material/GroupWork';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const formatNumberFR = (value, options) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return new Intl.NumberFormat('fr-FR', options).format(value);
  };

  const formatDateTimeFR = value => {
    if (!value) return 'Non disponible';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Non disponible';
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = await getDashboardStats();
        setStats(payload);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const refreshInterval = 15 * 60 * 1000;
    let cancelled = false;

    const fetchLastUpdated = async () => {
      try {
        const payload = await getEmployeesLastUpdated();
        if (!cancelled) {
          setLastUpdated(payload?.lastUpdated || null);
        }
      } catch {
        if (!cancelled) {
          setLastUpdated(null);
        }
      }
    };

    fetchLastUpdated();
    const intervalId = setInterval(fetchLastUpdated, refreshInterval);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const animationStyle = {
    animation: 'dropDown 0.8s ease forwards',
    opacity: 0,
    '@keyframes dropDown': {
      '0%': { transform: 'translateY(-20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 },
    },
  };

  const cardBase = {
    ...animationStyle,
    boxShadow: '0 20px 55px rgba(14, 30, 68, 0.12)',
    borderRadius: 3,
    height: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(15, 23, 42, 0.06)',
  };

  const gradientCards = [
    'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)', // DGI Blue
    'linear-gradient(135deg, #3aa7a4 0%, #26a69a 100%)', // DGI Teal
    'linear-gradient(135deg, #0288d1 0%, #03a9f4 100%)', // Light Blue
    'linear-gradient(135deg, #00695c 0%, #00897b 100%)', // Dark Teal
  ];

  const username = localStorage.getItem('EMSusername') || 'there';
  const employeeCount = stats?.totalEmployees || 0;
  const averageAge = stats?.averageAge || 0;
  const organizationCount = stats?.totalOrganizations || 0;
  const averageTeamSize = stats?.averageTeamSize || 0;
  const genderValues = [
    stats?.maleCount || 0,
    stats?.femaleCount || 0,
    stats?.otherCount || 0,
  ];
  const organizationEntries = Object.entries(stats?.employeesByOrganization || {});
  const orgLabels = organizationEntries.map(([name]) => name);
  const orgCounts = organizationEntries.map(([, count]) => count);
  const growthLabels = (stats?.growthByMonth || []).map(item => item.month);
  const growthCounts = (stats?.growthByMonth || []).map(item => item.count);

  const genderChartData = {
    labels: ['Hommes', 'Femmes', 'Autres'],
    datasets: [
      {
        label: 'Répartition par genre',
        data: genderValues,
        backgroundColor: ['#42A5F5', '#FF7043', '#9E9E9E'],
        borderColor: ['#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  const employeeGrowthData =
    growthLabels.length > 0
      ? {
          labels: growthLabels,
          datasets: [
            {
              label: "Évolution du nombre d'employés",
              data: growthCounts,
              backgroundColor: '#36A2EB',
              borderColor: '#36A2EB',
              borderWidth: 1,
            },
          ],
        }
      : null;

  const lineChartData =
    growthLabels.length > 0
      ? {
          labels: growthLabels,
          datasets: [
            {
              label: "Tendance de croissance des employés",
              data: growthCounts,
              fill: false,
              borderColor: '#FF6384',
              tension: 0.1,
            },
          ],
        }
      : null;

  const organizationMixData =
    orgLabels.length > 0
      ? {
          labels: orgLabels,
          datasets: [
            {
              label: 'Employés par organisme',
              data: orgCounts,
              backgroundColor: ['#1E3C72', '#2A5298', '#42A5F5', '#90CAF9', '#E3F2FD', '#B3E5FC', '#4FC3F7'],
              borderColor: ['#ffffff'],
              borderWidth: 1,
            },
          ],
        }
      : null;

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

  return (
    <Box sx={{ marginTop: '2rem' }}>
      <Box
        sx={{
          borderRadius: 3,
          padding: '2rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          color: 'white',
          boxShadow: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 1 }}>
          Bon retour, {username} 👋
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 620, opacity: 0.9 }}>
          La santé de votre organisation en un coup d’œil. Utilisez les actions rapides pour maîtriser vos effectifs, vos organismes et votre dynamique de recrutement.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ marginTop: '1rem' }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate('/add-employee')}
            sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}
          >
            Ajouter un employé
          </Button>
          <Button
            variant="outlined"
            startIcon={<GroupWorkIcon />}
            onClick={() => navigate('/organization')}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.35)', '&:hover': { borderColor: 'white' } }}
          >
            Organigramme
          </Button>
          <Button
            variant="outlined"
            startIcon={<ListAltIcon />}
            onClick={() => navigate('/employees')}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.35)', '&:hover': { borderColor: 'white' } }}
          >
            Voir l’annuaire
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ marginTop: '1rem' }} alignItems="center">
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Dernière mise à jour des données RH : {formatDateTimeFR(lastUpdated)}
          </Typography>
        </Stack>
      </Box>

      <Typography variant="h4" component="h1" sx={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
        Tableau de bord général
      </Typography>
      <Grid container spacing={3}>
        {/* Metric Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardBase,
              background: gradientCards[0],
              color: 'white',
            }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
                Nombre total d’employés
              </Typography>
              <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {formatNumberFR(employeeCount)}
              </Typography>
              <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8 }}>
                Membres actifs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardBase,
              background: gradientCards[1],
              color: '#1f2937',
            }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
                Âge moyen
              </Typography>
              <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {formatNumberFR(averageAge, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </Typography>
              <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8 }}>
                Expérience équilibrée
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...cardBase, background: gradientCards[1] }}>
            <CardContent>
              <Typography color="white" gutterBottom sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
                Organismes
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {organizationCount}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)' }}>
                <GroupWorkIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                <Typography variant="body2">Structure organisationnelle</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardBase,
              background: gradientCards[3],
              color: 'white',
            }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
                Taille moyenne des équipes
              </Typography>
              <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {formatNumberFR(averageTeamSize, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </Typography>
              <Typography variant="body2" textAlign="center" sx={{ opacity: 0.85 }}>
                Employés par organisme
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Croissance des effectifs</Typography>
              {employeeGrowthData ? <Bar data={employeeGrowthData} /> : <Typography>Aucune donnée disponible</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Tendance d’évolution</Typography>
              {lineChartData ? <Line data={lineChartData} /> : <Typography>Aucune donnée disponible</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Répartition par genre</Typography>
              <Bar data={genderChartData} options={{ scales: { y: { beginAtZero: true } } }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Employés par organisme</Typography>
              {organizationMixData ? <Pie data={organizationMixData} /> : <Typography>Aucune donnée disponible</Typography>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
