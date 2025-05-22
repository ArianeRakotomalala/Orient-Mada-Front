import AuthRegisterLayout from '../components/AuthRegisterLayout';
import Formulaire from '../components/Formulaire';
import Bouton from '../components/Bouton';
import register from '../assets/register1.jpg';
import { Typography , styled} from '@mui/material';
import { useState } from 'react';



function Register() {
    const StyledLink = styled('a')({
        textDecoration: 'underline',
        color: 'black',
        transition: 'color 0.5s',
        '&:hover': {
        color: '#1976d2', 
        textDecoration: 'underline',
    },
        });

    const [informations,setInformations]=useState({email:'', phone:'',password:'', password1:''})
    //   const [authErreur, setError] = useState('');
      const handleChange = (e) => {
        setInformations({ ...informations, [e.target.name]: e.target.value });
      };
    return (
        <AuthRegisterLayout image={register}>
            <Typography component="h1" variant="h4" sx={{ mb: 2, mt:4, fontWeight: 'bolder', color: 'black' }}>
                Inscription
            </Typography>
            <Typography variant="body1" sx={{ mb: 2,  color:'black', opacity: 0.7 }}>
                Veuillez entrer vos informations pour vous inscrire.
            </Typography>
            <form  >
                    <Formulaire
                        id="email"
                        label="Adresse email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        autoFocus
                        value={informations.email}
                        onChange={handleChange}
                    />
                    <Formulaire
                        id="phone"
                        label="Numéro de téléphone"
                        name="phone"
                        autoComplete="phone"
                        type="tel"
                        // value={credentials.password}
                        onChange={handleChange}
                    />
                    <Formulaire
                        id="password1"
                        label="Mot de passe"
                        name="password"
                        autoComplete="current-password"
                        type="password"
                        value={informations.password}
                        onChange={handleChange}
                    />
                    <Formulaire
                        id="password2"
                        label="Mot de passe"
                        name="password1"
                        autoComplete="current-password"
                        type="password"
                        value={informations.password1}
                        onChange={handleChange}
                    />
                    <Bouton
                        label="Se connecter"
                        backgroundColor='black' 
                        hoverbackground='#B67878'  
                        color='white' 
                        borderColor='#B67878'
                    />
                    <Typography
                        variant="body1"
                        sx={{ mb:{xs:0, sm:0, md:2} ,  color:'black', opacity: 0.7, textAlign:'right', mx: '9%' }}>
                        Vous avez déjà un compte ?
                        <StyledLink href="/login">Cliquez ici</StyledLink>
                    </Typography>
            </form>            
        </AuthRegisterLayout>
    );
}
export default Register;
