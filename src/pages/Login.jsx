import {  Typography, Paper, Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import log from '../assets/log.png';
import Formulaire from '../components/Formulaire';
import Bouton from '../components/Bouton';
import login from '../services/auth';
import {useState } from 'react';
import AuthRegisterLayout from '../components/AuthRegisterLayout';

function Login() {
  const [credentials,setCredentials]=useState({email:'',password:''})
  const [authErreur, setError] = useState('');
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const {user, token }= await login(credentials);
          localStorage.setItem('jwtToken', token);
          localStorage.setItem('user_info', JSON.stringify(user));
          window.location.href = '/home'; 
        } catch (err) {
          if (err.response && err.response.status === 401) {
            setError('Identifiants incorrects');
          }
        }
  }
  return (
  <AuthRegisterLayout image={log}>
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
</AuthRegisterLayout>
  );
}
export default Login;
