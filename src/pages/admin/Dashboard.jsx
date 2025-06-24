import React, { useContext } from 'react';
import { DataContext } from '../../Context/DataContext';
import { UserContext } from '../../Context/UserContext';
import { ListUserContext } from '../../context/ListUserContext';
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
  const { courses, institutions, domaines, loading: dataLoading } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const { users, loading: usersLoading } = useContext(ListUserContext);
  const navigate = useNavigate();

  // Logs de débogage
  console.log('Dashboard - Data Loading:', dataLoading);
  console.log('Dashboard - Courses:', courses);
  console.log('Dashboard - Institutions:', institutions);
  console.log('Dashboard - Domaines:', domaines);
  console.log('Dashboard - Users:', users);

  // Vérification et sécurisation des données
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeInstitutions = Array.isArray(institutions) ? institutions : [];
  const safeDomaines = Array.isArray(domaines) ? domaines : [];
  const safeUsers = Array.isArray(users) ? users : [];

  // Statistiques
  const stats = [
    {
      title: 'Formations',
      value: safeCourses.length,
      icon: <SchoolIcon />,
      color: '#667eea',
      path: '/admin/formations'
    },
    {
      title: 'Universités',
      value: safeInstitutions.length,
      icon: <BusinessIcon />,
      color: '#764ba2',
      path: '/admin/universities'
    },
    {
      title: 'Domaines',
      value: safeDomaines.length,
      icon: <TrendingUpIcon />,
      color: '#f093fb',
      path: '/admin/domains'
    },
    {
      title: 'Utilisateurs',
      value: usersLoading ? '...' : safeUsers.length,
      icon: <PeopleIcon />,
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
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
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
            Bienvenue Admin, {user?.email}
          </Typography>
        </Box>
      </motion.div>

      {/* Test de chargement */}
      {false && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Test de chargement
          </Typography>
          <Typography>Loading: {dataLoading ? 'Oui' : 'Non'}</Typography>
          <Typography>Formations: {safeCourses.length}</Typography>
          <Typography>Universités: {safeInstitutions.length}</Typography>
          <Typography>Domaines: {safeDomaines.length}</Typography>
        </Box>
      )}

      {/* Statistiques simplifiées */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid xs={12} sm={6} md={6} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                    borderRadius: 3,
                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.2)}`,
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    color: 'white',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 32px ${alpha(stat.color, 0.3)}`,
                    }
                  }}
                  onClick={() => navigate(stat.path)}
                >
                  <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h3" fontWeight={700}>
                        {stat.value}
                        </Typography>
                        <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9 }}>
                        {stat.title}
                        </Typography>
                    </Box>
                    <Box sx={{
                        backgroundColor: alpha('#fff', 0.2),
                        borderRadius: '50%',
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                      {React.cloneElement(stat.icon, { sx: { fontSize: 40, color: 'white' } })}
                    </Box>
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
            <Grid xs={12} md={4} key={action.title}>
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
                    boxShadow: 'none',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      borderColor: alpha(action.color, 0.5)
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
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {React.cloneElement(action.icon, { sx: { color: action.color, fontSize: 24 } })}
                      </Box>
                      <Typography variant="h6" fontWeight={600} color="#2d3748">
                        {action.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="#718096">
                      {action.description}
                    </Typography>
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