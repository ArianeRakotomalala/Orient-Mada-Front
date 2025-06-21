import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SimpleAdmin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_info') || 'null');

  return (
    <Box sx={{ p: 4, background: '#f8f9fa', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Admin Simple - Test
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Utilisateur :</Typography>
        <Typography>Email : {user?.email || 'Non connecté'}</Typography>
        <Typography>Rôles : {user?.roles ? JSON.stringify(user.roles) : 'Aucun'}</Typography>
        <Typography>Est admin : {user?.roles?.includes('ROLE_ADMIN') ? 'Oui' : 'Non'}</Typography>
      </Box>

      <Button 
        variant="contained" 
        onClick={() => navigate('/home')}
        sx={{ mr: 2 }}
      >
        Retour au site
      </Button>
      
      <Button 
        variant="outlined" 
        onClick={() => console.log('User:', user)}
      >
        Log User (Console)
      </Button>
    </Box>
  );
};

export default SimpleAdmin; 