import {  Typography, Paper, Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import img from '../assets/log.png';
import Formulaire from '../components/Formulaire';
import Bouton from '../components/Bouton';
import login from '../services/auth';
import {useState } from 'react';

function Login() {
  const [credentials,setCredentials]=useState({email:'',password:''})
  const [authErreur, setError] = useState('');
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const token = await login(credentials);
          localStorage.setItem('jwtToken', token);
          window.location.href = '/'; 
        } catch (err) {
          if (err.response && err.response.status === 401) {
            setError('Identifiants incorrects');
          }
        }
  }
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
              size={{ xs: 12, md: 6 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 4,
                backgroundColor: 'white',
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '50%',
                }
              }}
            >
                      <Typography component="h1" variant="h4" sx={{ mb: 2, mt:4, fontWeight: 'bolder', color: 'black' }}>
                        Connexion
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2,  color:'black', opacity: 0.7 }}>
                        Veuillez entrer vos identifiants pour vous connecter. 
                      </Typography>
                      {authErreur && (
                        <Typography color="error" sx={{ mb: 2 }}>
                          {authErreur}
                        </Typography>
                      )}
                    <form onSubmit={handleSubmit} >
                      <Formulaire
                        id="email"
                        label="Adresse email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        autoFocus
                        value={credentials.email}
                        onChange={handleChange}
                      />
                      <Formulaire
                        id="password"
                        label="Mot de passe"
                        name="password"
                        autoComplete="current-password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                      />
                      <Typography
                        variant="body1"
                        sx={{ mb:{xs:0, sm:0, md:2} ,  color:'black', opacity: 0.7, textAlign:'right', mx: '9%' }}>
                        <a href="/forgot-password" style={{textDecoration: 'none' ,color: 'black',}}>Mot de passe oublié ?</a>
                      </Typography>
                      
                      <Bouton
                          label="Se connecter"
                          backgroundColor='black' 
                          hoverbackground='#B67878'  
                          color='white' 
                          borderColor='#B67878'
                      />
                      <Bouton
                        label="Se connecter avec Google"
                        startIcon={<GoogleIcon sx={{ mr: 1 }} />}
                        backgroundColor='white' 
                        hoverbackground='#B67878'
                        hoverColor='white'
                        color='black'
                        borderColor='#B67878'
                      />
                      </form>
                      <Typography variant="body2">
                        Vous n'avez pas de compte ? <a href="/register" >Inscrivez-vous</a>
                      </Typography>
            </Grid>

            {/* IMAGE */}
            <Grid
              size={{ xs: 0, md: 6 }}
              sx={{
                position: 'relative',
                display: { xs: 'none',  sm : 'none',md:'block'}, // cache sur mobile
                backgroundImage: `url(${img})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                height: '100%' ,
                width:'50%',
              }}
            />              
          </Grid> 
    </Grid>
  );
}
export default Login;
