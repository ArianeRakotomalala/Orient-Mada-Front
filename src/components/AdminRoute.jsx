import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Box, Typography, CircularProgress } from '@mui/material';

const AdminRoute = ({ children }) => {
  const { user, userProfils } = useContext(UserContext);
  const token = localStorage.getItem('jwtToken');

  // Logs de débogage
  console.log('AdminRoute - User:', user);
  console.log('AdminRoute - UserProfils:', userProfils);
  console.log('AdminRoute - User roles:', user?.roles);

  // Si pas d'utilisateur connecté, rediriger vers login
  if (!user || !token) {
    console.log("AdminRoute - Pas d'utilisateur ou pas de token, redirection vers login");
    return <Navigate to="/login" replace />;
  }

  // Vérifier si l'utilisateur a le rôle admin (on peut le faire sans le profil)
  const isAdmin = user.roles && user.roles.includes('ROLE_ADMIN');
  console.log('AdminRoute - Est admin:', isAdmin);

  if (!isAdmin) {
    console.log('AdminRoute - Pas admin, affichage message d\'erreur');
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        p: 4
      }}>
        <Typography variant="h4" color="error" gutterBottom>
          Accès refusé
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Rôles actuels : {user.roles ? JSON.stringify(user.roles) : 'Aucun'}
        </Typography>
      </Box>
    );
  }

  // Si on est admin, on peut afficher le contenu même si le profil n'est pas encore chargé
  // Le profil n'est pas nécessaire pour l'administration
  console.log('AdminRoute - Accès autorisé, affichage du contenu');
  return children;
};

export default AdminRoute; 