import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
    Avatar,
    Button,
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import ExploreIcon from '@mui/icons-material/Explore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useParams } from 'react-router-dom';


const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#1976d2' : '#222',
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 500,
    padding: '12px 18px',
    borderRadius: '8px',
    background: isActive ? '#e3f2fd' : 'transparent',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.08rem',
    transition: 'background 0.2s, color 0.2s',
    gap: '12px',
    marginBottom: '4px',
    letterSpacing: '0.02em',
    boxShadow: isActive ? '0 2px 8px #e3f2fd55' : 'none',
    cursor: 'pointer',
    '&:hover': {
        background: '#f5faff',
        color: '#1976d2'
    }
});

function Slidebar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user_info'));
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user_info');
        navigate('/login');
    };
    const [openLogout, setOpenLogout] = useState(false);

    const initial = user?.email?.charAt(0).toUpperCase() || '?';

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                px: 3,
                py: 4,
                borderRadius: 3,
                boxShadow: '0 2px 12px #e3f2fd33',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Box>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{ mb: 4, mt: 2, fontWeight: 'bold' }}
                >
                    <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SchoolIcon fontSize="large" sx={{ mr: 1 }} />
                            Orient MADA
                        </Box>
                    </Link>
                </Typography>

                {user && (
                    <Box mb={3}>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Avatar sx={{ width: 48, height: 48 }}>{initial}</Avatar>
                            <Box display="flex" flexDirection="column" justifyContent="center" sx={{ minWidth: 0 }}>
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    fontSize={14}
                                    sx={{
                                        maxWidth: 140,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        wordBreak: 'break-all',
                                        '@media (max-width:600px)': {
                                            maxWidth: 80,
                                            fontSize: 12,
                                        }
                                    }}
                                    title={user.email}
                                >
                                    {user.email}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        maxWidth: 140,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        wordBreak: 'break-all',
                                        '@media (max-width:600px)': {
                                            maxWidth: 80,
                                            fontSize: 11,
                                        }
                                    }}
                                    title={user.telephone}
                                >
                                    {user.telephone}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleMenuOpen} sx={{ ml: 'auto' }}>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={() => { handleMenuClose(); navigate('/home/profil'); }}>Modifier le profil</MenuItem>
                            <MenuItem onClick={() => { handleMenuClose(); navigate('/messages'); }}>Messages</MenuItem>
                        </Menu>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <nav>  
                     <NavLink to="/home/explore" style={navLinkStyle}>
                        <ExploreIcon sx={{ mr: 1 }} />
                        <Typography variant="body1" >Explorer</Typography>
                    </NavLink>
                    <NavLink to="/home/university" style={navLinkStyle}>
                        <SchoolIcon sx={{ mr: 1 }} />
                        <Typography variant="body1" >Universités</Typography>
                    </NavLink>
                    <NavLink to="/home/formation" style={navLinkStyle}>
                        <WorkIcon sx={{ mr: 1 }} />
                        <Typography variant="body1" >Formation</Typography>
                    </NavLink>
                    <NavLink to="home/ event" style={navLinkStyle}>
                        <EventIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">Événement</Typography>
                    </NavLink>
                </nav>

                <Divider sx={{ my: 9}} />
            </Box>

            <Box>
                {user ? (
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenLogout(true)}
                        sx={{
                            width:'100%',
                            p:1,
                            fontWeight:'bold',
                            background: 'linear-gradient(90deg, #4F8DFD 0%, #38C6D9 100%)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                            },
                        }}
                    >
                        Se déconnecter
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate('/login')}
                        sx={{
                            width:'100%',
                            p:1,
                            fontWeight:'bold',
                            background: 'linear-gradient(90deg, #4F8DFD 0%, #38C6D9 100%)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                            },
                        }}
                    >
                        Se connecter / S'inscrire
                    </Button>
                )}
            </Box>
            <Dialog open={openLogout} onClose={() => setOpenLogout(false)} >
                <DialogTitle>Voulez-vous vraiment vous déconnecter ?</DialogTitle>
                <DialogActions>
                <Box sx={{display:'flex' , justifyContent:'center',width: '100%', gap: 2}}>
                    <Button onClick={() => setOpenLogout(false)} color="primary" >
                        Non
                    </Button>
                    <Button
                        onClick={() => {
                            setOpenLogout(false);
                            handleLogout();
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Oui
                    </Button>
                 </Box>
                </DialogActions>
            </Dialog>
        </Box>
        
    );
}

export default Slidebar;
