import React, { useState, useMemo, useEffect } from 'react';
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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useParams } from 'react-router-dom';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { useContext } from 'react';
import { DataContext } from '../Context/DataContext';
import { UserContext } from '../Context/UserContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


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
    const { institutions, events, eventRegistrations } = useContext(DataContext);
    const { favorisUtilisateur } = useContext(UserContext);
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const [notifPreviewAnchor, setNotifPreviewAnchor] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
    const handleNotifClose = () => setNotifAnchorEl(null);
    const handleNotifPreviewOpen = (event) => setNotifPreviewAnchor(event.currentTarget);
    const handleNotifPreviewClose = () => setNotifPreviewAnchor(null);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user_info');
        navigate('/login');
    };
    const [openLogout, setOpenLogout] = useState(false);

    const initial = user?.email?.charAt(0).toUpperCase() || '?';

    // Génération des notifications dynamiques
    const notifications = useMemo(() => {
        const notifs = [];
        if (!user) return notifs;
        // 1. Nouveaux événements dans les universités favorites (créés dans les 3 derniers jours)
        const now = dayjs();
        const troisJours = now.subtract(3, 'day');
        if (favorisUtilisateur && Array.isArray(favorisUtilisateur) && events && Array.isArray(events)) {
            favorisUtilisateur.forEach(fav => {
                const institutionId = fav.institution ? String(fav.institution).split('/').pop() : null;
                if (!institutionId) return;
                const nouveauxEvents = events.filter(ev => {
                    const evInstitutionId = ev.institution ? String(ev.institution).split('/').pop() : null;
                    // Vérifie si l'événement appartient à l'institution favorite et est récent
                    const createdAt = ev.created_at ? dayjs(ev.created_at) : null;
                    return evInstitutionId === institutionId && createdAt && createdAt.isAfter(troisJours);
                });
                nouveauxEvents.forEach(ev => {
                    notifs.push({
                        id: `new-event-${ev.id}`,
                        message: `Nouvel événement "${ev.title || 'Sans nom'}" ajouté à votre université favorite.`,
                        date: ev.created_at ? dayjs(ev.created_at) : null
                    });
                });
            });
        }
        // 2. Événements inscrits qui arrivent dans 2 jours
        if (eventRegistrations && Array.isArray(eventRegistrations) && events && Array.isArray(events)) {
            const userEventIds = eventRegistrations
                .filter(reg => {
                    const userId = reg.user?.id || String(reg.user).split('/').pop();
                    return String(userId) === String(user.id);
                })
                .map(reg => reg.events ? String(reg.events).split('/').pop() : null)
                .filter(Boolean);
            events.forEach(ev => {
                if (userEventIds.includes(String(ev.id)) && ev.event_date_time) {
                    const eventDate = dayjs(ev.event_date_time);
                    if (eventDate.diff(now, 'day') === 2) {
                        notifs.push({
                            id: `event-soon-${ev.id}`,
                            message: `L'événement "${ev.title || 'Sans nom'}" auquel vous êtes inscrit a lieu dans 2 jours.`,
                            date: ev.event_date_time ? dayjs(ev.event_date_time) : null
                        });
                    }
                }
            });
        }
        return notifs;
    }, [favorisUtilisateur, institutions, events, eventRegistrations, user]);

    // Gestion des notifications lues
    const [readNotifIds, setReadNotifIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('readNotifIds') || '[]');
        } catch {
            return [];
        }
    });
    useEffect(() => {
        const handleStorage = () => {
            try {
                setReadNotifIds(JSON.parse(localStorage.getItem('readNotifIds') || '[]'));
            } catch {}
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);
    // Notifications non lues
    const unreadNotifications = notifications.filter(n => !readNotifIds.includes(n.id));
    const unreadCount = unreadNotifications.length;
    // Redirection vers la page notifications et marquage comme lues
    const handleNotifClick = () => {
        // Marquer toutes les notifications courantes comme lues
        const allIds = notifications.map(n => n.id);
        localStorage.setItem('readNotifIds', JSON.stringify(Array.from(new Set([...readNotifIds, ...allIds]))));
        setReadNotifIds(Array.from(new Set([...readNotifIds, ...allIds])));
        navigate('/home/notifications');
    };

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
                            {user?.roles?.includes('ROLE_ADMIN') && (
                                <MenuItem onClick={() => { handleMenuClose(); navigate('/admin'); }}>
                                    <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Administration
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <nav>  
                    <NavLink to="/home/comparer" style={navLinkStyle}>
                        <CompareArrowsIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">Comparer</Typography>
                    </NavLink>
                    <NavLink to="/home/university" style={navLinkStyle}>
                        <SchoolIcon sx={{ mr: 1 }} />
                        <Typography variant="body1" >Universités</Typography>
                    </NavLink>
                    <NavLink to="/home/formation" style={navLinkStyle}>
                        <WorkIcon sx={{ mr: 1 }} />
                        <Typography variant="body1" >Formation</Typography>
                    </NavLink>
                    <NavLink to="/home/event" style={navLinkStyle}>
                        <EventIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">Événement</Typography>
                    </NavLink>
                    <NavLink to="/home/notifications" style={navLinkStyle} onClick={handleNotifClick}>
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                        <Typography variant="body1" sx={{ ml: 1 }}>Notifications</Typography>
                    </NavLink>
                </nav>

                <Menu
                    anchorEl={notifPreviewAnchor}
                    open={Boolean(notifPreviewAnchor)}
                    onClose={handleNotifPreviewClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                        sx: { minWidth: 320, maxHeight: 350, p: 1, borderRadius: 2, boxShadow: 3 }
                    }}
                >
                    <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>Notifications récentes</Typography>
                    <Divider />
                    {notifications.length === 0 && (
                        <Typography variant="body2" sx={{ px: 2, py: 2, color: 'text.secondary' }}>Aucune notification</Typography>
                    )}
                    {notifications.slice(0, 5).map((notif, idx) => (
                        <MenuItem key={notif.id} sx={{ alignItems: 'flex-start', gap: 1, background: unreadNotifications.some(u=>u.id===notif.id)?'#e3f2fd':'transparent' }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: unreadNotifications.some(u=>u.id===notif.id)?'bold':'normal' }}>{notif.message}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {notif.date ? dayjs(notif.date).fromNow() : 'À l\'instant'}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem onClick={()=>{handleNotifPreviewClose();navigate('/home/notifications');}} sx={{ justifyContent: 'center', color: '#1976d2', fontWeight: 'bold' }}>
                        Voir toutes les notifications
                    </MenuItem>
                </Menu>

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
                            background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #4F8DFD 0%, #38C6D9 100%)',
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
                            background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                            
                            '&:hover': {
                                background: 'linear-gradient(90deg, #4F8DFD 0%, #38C6D9 100%)',
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
