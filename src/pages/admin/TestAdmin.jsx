import React, { useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { UserContext } from '../../context/UserContext';
import { DataContext } from '../../context/DataContext';

const TestAdmin = () => {
  const { user, userProfils } = useContext(UserContext);
  const { courses, domaines, loading } = useContext(DataContext);

  return (
    <Box sx={{ p: 4, background: '#f8f9fa', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Test Admin - Diagnostic
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Informations utilisateur :</Typography>
        <Typography>Connecté : {user ? 'Oui' : 'Non'}</Typography>
        <Typography>Email : {user?.email || 'Non défini'}</Typography>
        <Typography>Rôles : {user?.roles ? JSON.stringify(user.roles) : 'Non défini'}</Typography>
        <Typography>Est admin : {user?.roles?.includes('ROLE_ADMIN') ? 'Oui' : 'Non'}</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Données :</Typography>
        <Typography>Loading : {loading ? 'Oui' : 'Non'}</Typography>
        <Typography>Nombre de formations : {Array.isArray(courses) ? courses.length : 'Erreur'}</Typography>
        <Typography>Nombre de domaines : {Array.isArray(domaines) ? domaines.length : 'Erreur'}</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Profil utilisateur :</Typography>
        <Typography>Profil chargé : {userProfils ? 'Oui' : 'Non'}</Typography>
        <Typography>Série : {userProfils?.serie || 'Non définie'}</Typography>
      </Box>

      <Button 
        variant="contained" 
        onClick={() => console.log('User:', user)}
        sx={{ mr: 2 }}
      >
        Log User (Console)
      </Button>
      
      <Button 
        variant="contained" 
        onClick={() => console.log('Courses:', courses)}
        sx={{ mr: 2 }}
      >
        Log Courses (Console)
      </Button>
    </Box>
  );
};

export default TestAdmin; 