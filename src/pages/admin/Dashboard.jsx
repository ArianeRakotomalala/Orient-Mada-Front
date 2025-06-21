import React, { useContext } from 'react';
import { DataContext } from '../../Context/DataContext';
import { UserContext } from '../../Context/UserContext';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import {
  School as SchoolIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { courses, institutions, domaines, loading } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Logs de débogage
  console.log('Dashboard - Loading:', loading);
  console.log('Dashboard - Courses:', courses);
  console.log('Dashboard - Institutions:', institutions);
  console.log('Dashboard - Domaines:', domaines);

  // Vérification et sécurisation des données
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeInstitutions = Array.isArray(institutions) ? institutions : [];
  const safeDomaines = Array.isArray(domaines) ? domaines : [];

  // Statistiques
  const stats = [
    {
      title: 'Formations',
      value: safeCourses.length,
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      color: '#667eea',
      path: '/admin/formations'
    },
    {
      title: 'Universités',
      value: safeInstitutions.length,
      icon: <BusinessIcon sx={{ fontSize: 40, color: '#764ba2' }} />,
      color: '#764ba2',
      path: '/admin/universities'
    },
    {
      title: 'Domaines',
      value: safeDomaines.length,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#f093fb' }} />,
      color: '#f093fb',
      path: '/admin/domains'
    },
    {
      title: 'Utilisateurs',
      value: 'N/A', // À implémenter quand vous aurez les données utilisateurs
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#4facfe' }} />,
      color: '#4facfe',
      path: '/admin/users'
    }
  ];

  const quickActions = [
    {
      title: 'Ajouter une formation',
      description: 'Créer une nouvelle formation',
      icon: <AddIcon />,
      path: '/admin/formations',
      color: '#667eea'
    },
    {
      title: 'Gérer les universités',
      description: 'Modifier les informations des universités',
      icon: <EditIcon />,
      path: '/admin/universities',
      color: '#764ba2'
    },
    {
      title: 'Voir les statistiques',
      description: 'Consulter les rapports d\'utilisation',
      icon: <ViewIcon />,
      path: '/admin/statistics',
      color: '#f093fb'
    }
  ];

  return (
    <Box sx={{ p: 4, background: '#f8f9fa', minHeight: '100vh' }}>
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="#2d3748" gutterBottom>
            Tableau de bord
          </Typography>
          <Typography variant="body1" color="#718096">
            Bienvenue dans l'espace d'administration, {user?.email}
          </Typography>
        </Box>
      </motion.div>

      {/* Message de test */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test de chargement
        </Typography>
        <Typography>Loading: {loading ? 'Oui' : 'Non'}</Typography>
        <Typography>Formations: {safeCourses.length}</Typography>
        <Typography>Universités: {safeInstitutions.length}</Typography>
        <Typography>Domaines: {safeDomaines.length}</Typography>
      </Box>

      {/* Statistiques simplifiées */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }
                  }}
                  onClick={() => navigate(stat.path)}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" fontWeight={700} color={stat.color} gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" color="#4a5568" fontWeight={600}>
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Actions rapides simplifiées */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Typography variant="h5" fontWeight={600} color="#2d3748" sx={{ mb: 3 }}>
          Actions rapides
        </Typography>
        
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} md={4} key={action.title}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        backgroundColor: alpha(action.color, 0.1),
                        mr: 2
                      }}>
                        <Box sx={{ color: action.color }}>
                          {action.icon}
                        </Box>
                      </Box>
                      <Typography variant="h6" fontWeight={600} color="#2d3748">
                        {action.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="#718096" sx={{ mb: 2 }}>
                      {action.description}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        borderColor: action.color, 
                        color: action.color,
                        '&:hover': {
                          borderColor: action.color,
                          backgroundColor: alpha(action.color, 0.05),
                        }
                      }}
                    >
                      Accéder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Dashboard; 