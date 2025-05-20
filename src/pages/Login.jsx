import { Box, Button, Typography, Paper, Grid } from '@mui/material';
import React from 'react';
import Formulaire from '../components/Formulaire';
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
  return (
    // CONTAINER , ilay gris ivelany
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      {/* // CONTAINER , ilay blanc be  */}
      <Grid
        container
        component={Paper}
        elevation={10}
        sx={{
          width: { xs: '100%', sm: '85%', md: '80%' },
          height: { xs: '90%', md: '80%' },
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          minHeight: '90vh',
        }}
      >
            {/* FORMULAIRE */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 4,
                backgroundColor: 'white',
                width: '50%',
              }}
            >
                      <Typography component="h1" variant="h4" sx={{ mb: 2, mt:4, fontWeight: 'bolder', color: 'black' }}>
                        Connexion
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2,  color:'black', opacity: 0.7 }}>
                        Veuillez entrer vos identifiants pour vous connecter. 
                      </Typography>

                      <Formulaire
                        id="email"
                        label="Adresse email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        autoFocus
                      />
                      <Formulaire
                        id="password"
                        label="Mot de passe"
                        name="password"
                        autoComplete="current-password"
                        type="password"
                      />
                      <Typography variant="body1" sx={{ mb: 2,  color:'black', opacity: 0.7, textAlign:'right', mx: '9%' }}>
                        <a href="/forgot-password" style={{textDecoration: 'none' ,color: 'black',}}>Mot de passe oublié ?</a>
                      </Typography>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          fontWeight: 'bold',
                          mt: 3,
                          mb: 2,
                          width: { xs: '100%', sm: '100%', md: '90%' },
                          backgroundColor: 'black',
                          '&:hover': { backgroundColor: '#B67878' },
                        }}
                      >
                        Se connecter
                      </Button>
                      <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        sx={{
                          color: 'black',
                          borderColor: 'black',
                          fontWeight: 'bold',
                          mb: 2,
                          width: { xs: '100%', sm: '100%', md: '90%' },
                          '&:hover': { backgroundColor: '#B67878' , color: 'white', borderColor: '#B67878'},
                        }}
                      >
                        <GoogleIcon sx={{ mr: 1 }} />
                        Se connecter avec Google
                      </Button>


                      <Typography variant="body2">
                        Vous n'avez pas de compte ? <a href="/register" >Inscrivez-vous</a>
                      </Typography>
          
            </Grid>

            {/* IMAGE */}
            <Grid
              item
              xs={0}      
              md={6} 
              sx={{
                position: 'relative',
                display: { xs: 'none', md: 'flex' }, // cache sur mobile
                backgroundImage: `url(https://images.unsplash.com/photo-1619745445633-a3b241b38dc3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                height: '100%' ,
                width:'50%',
              }}
              >

              </Grid>
              
            </Grid>
            
    </Grid>
  );
}

export default Login;
