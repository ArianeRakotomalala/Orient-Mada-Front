import AuthRegisterLayout from '../components/AuthRegisterLayout';
import Formulaire from '../components/Formulaire';
import Bouton from '../components/Bouton';
import register from '../assets/register1.jpg';
import { Typography , styled} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
function Register() {
    const [email, setEmail] = useState('');
    const [phone, setPhone]= useState('');
    const [plainPassword, setPlainPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const handleSignup = async (e) => {
        e.preventDefault();
            if (plainPassword !== confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas.");
            return;
            }
           
            try { const response = await axios.post(
                '/api/users',
                    {
                        email: email,
                        plainPassword: plainPassword,
                        telephone: phone,
                        roles: ["ROLE_USER"]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/ld+json'
                        }
                    },
               
            );
            setMessage("Inscription réussie !");
            window.location.href = '/login'
            } catch (error) {
                setMessage("Erreur : " + (error.response?.data?.detail || "Échec de l'inscription"));
            }
    };



    const StyledLink = styled('a')({
        textDecoration: 'underline',
        color: 'black',
        transition: 'color 0.5s',
        '&:hover': {
        color: '#1976d2', 
        textDecoration: 'underline',
    },
        });

    return (
        <AuthRegisterLayout image={register}>
            <Typography component="h1" variant="h4" sx={{ mb: 2, mt:4, fontWeight: 'bolder', color: 'black' }}>
                Inscription
            </Typography>
            <Typography variant="body1" sx={{ mb: 2,  color:'black', opacity: 0.7 }}>
                Veuillez entrer vos informations pour vous inscrire.
            </Typography>
            {message && (
                <Typography color={message.includes('réussie') ? 'green' : 'red'} sx={{ mt: 2 }}>
                {message}
                </Typography>
            )}
            <form  onSubmit={handleSignup} >
                    <Formulaire
                        id="email"
                        label="Adresse email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Formulaire
                        id="phone"
                        label="Numéro de téléphone"
                        name="phone"
                        autoComplete="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <Formulaire
                        id="password1"
                        label="Mot de passe"
                        name="password"
                        autoComplete="current-password"
                        type="password"
                        value={plainPassword}
                       onChange={(e) => setPlainPassword(e.target.value)}
                    />
                    <Formulaire
                        id="password2"
                        label="Mot de passe"
                        name="password1"
                        autoComplete="current-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
