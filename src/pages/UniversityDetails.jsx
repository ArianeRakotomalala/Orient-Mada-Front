import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
    CircularProgress,
    TextField,
    Button,
    Rating,
    Avatar,
    Divider,
    Snackbar,
    Alert,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DataContext } from '../Context/DataContext'; // adapte le chemin si besoin
import { UserContext } from '../Context/UserContext';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Skeleton from '@mui/material/Skeleton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import DirectionsIcon from '@mui/icons-material/Directions';
import Grow from '@mui/material/Grow';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const StyledCard = styled(Card)(({ theme }) => ({
    margin: theme.spacing(2),
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
}));

const UniversityImage = styled('img')(({ theme }) => ({
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
}));

const MapWrapper = styled(Box)(({ theme }) => ({
    height: '300px',
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    marginTop: theme.spacing(2),
}));

const InfoBox = styled(Box)(({ theme }) => ({
    background: '#f9f9f9',
    borderRadius: '8px',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
}));

const ReviewForm = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    background: '#fff',
    borderRadius: '8px',
    padding: theme.spacing(2),
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
}));

const ReviewItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    gap: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: theme.spacing(2),
        gap: theme.spacing(2),
    },
}));

const HeaderLogo = styled('img')(({ theme }) => ({
    width: 180,
    height: 180,
    objectFit: 'cover',
    borderRadius: '10px',
    background: '#f5f5f5',
    border: '1px solid #eee',
    [theme.breakpoints.down('sm')]: {
        width: 130,
        height: 130,
    },
}));

const HeaderInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
}));

const UniversityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [university, setUniversity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { courses, events, users, eventRegistrations, refreshCourses, refreshEvents } = useContext(DataContext); 
    const [mapPosition, setMapPosition] = useState(null);
    const { user } = useContext(UserContext);
    const [registeredEvents, setRegisteredEvents] = useState([]); // ids des events où l'utilisateur est inscrit
    const [loadingRegister, setLoadingRegister] = useState({}); // loading par event
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Avis dynamiques
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ comment: '', rating: 0 });
    const [loadingReviews, setLoadingReviews] = useState(true);

    // Pagination pour les formations
    const [currentPage, setCurrentPage] = useState(1);
    const [autoPlay, setAutoPlay] = useState(true);
    const [expandedAccordion, setExpandedAccordion] = useState(null);
    const formationsPerPage = 5;

    // Calculer les formations et événements de l'université
    const universityCourses = university && Array.isArray(courses)
        ? courses.filter(course => {
            const institutionId = course.institutions.split('/').pop();
            return String(institutionId) === String(university.id);
        })
        : [];

    const universityEvents = university && Array.isArray(events)
        ? events.filter(event => {
            if (!event.institution) return false;
            return String(event.institution).split('/').pop() === String(university.id);
        })
        : [];

    useEffect(() => {
        const fetchUniversity = async () => {
            try {
                const response = await axios.get(`/api/institutions/${id}`);
                setUniversity(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des données de l\'université');
                setLoading(false);
                console.error('Erreur:', err);
            }
        };

        fetchUniversity();
    }, [id]);

    // Dynamique : géocoder si pas de coordonnées
    useEffect(() => {
        if (!university) return;
        if (Array.isArray(university.coordinates) && university.coordinates.length === 2) {
            setMapPosition(university.coordinates);
        } else {
            // Géocoder location + region
            const query = [university.location, university.region, 'Madagascar'].filter(Boolean).join(', ');
            if (!query) {
                setMapPosition([-18.8792, 47.5079]); // Antananarivo par défaut
                return;
            }
            axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: query,
                    format: 'json',
                    limit: 1
                },
                headers: {
                    'Accept-Language': 'fr',
                }
            })
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setMapPosition([
                        parseFloat(res.data[0].lat),
                        parseFloat(res.data[0].lon)
                    ]);
                } else {
                    setMapPosition([-18.8792, 47.5079]);
                }
            })
            .catch(() => setMapPosition([-18.8792, 47.5079]));
        }
    }, [university]);

    const fetchReviews = () => {
        if (!university?.id) return;
        setLoadingReviews(true);
        axios.get(`/api/avis?institutions=/api/institutions/${university.id}`)
            .then(res => {
                console.log('Avis API response:', res.data); // debug
                setReviews(res.data.member || []);
            })
            .catch(() => setReviews([]))
            .finally(() => setLoadingReviews(false));
    };

    // Charger les avis de l'université
    useEffect(() => {
        if (!university) return;
        fetchReviews();
        // eslint-disable-next-line
    }, [university]);

    // Auto-pagination pour les formations - animation plus lente et fluide
    useEffect(() => {
        if (!autoPlay || universityCourses.length <= formationsPerPage || expandedAccordion) return;

        const interval = setInterval(() => {
            setCurrentPage(prev => {
                const maxPage = Math.ceil(universityCourses.length / formationsPerPage);
                return prev >= maxPage ? 1 : prev + 1;
            });
        }, 20000); // Change toutes les 20 secondes pour une animation plus douce

        return () => clearInterval(interval);
    }, [autoPlay, universityCourses.length, expandedAccordion]);

    // Calculer les formations à afficher
    const indexOfLastFormation = currentPage * formationsPerPage;
    const indexOfFirstFormation = indexOfLastFormation - formationsPerPage;
    const currentFormations = universityCourses.slice(indexOfFirstFormation, indexOfLastFormation);
    const totalPages = Math.ceil(universityCourses.length / formationsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prev => prev >= totalPages ? 1 : prev + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => prev <= 1 ? totalPages : prev - 1);
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? panel : null);
    };

    const toggleAutoPlay = () => {
        setAutoPlay(!autoPlay);
    };

    // Initialiser les événements auxquels l'utilisateur est inscrit
    useEffect(() => {
        if (user && eventRegistrations && Array.isArray(eventRegistrations)) {
            const userRegistrations = eventRegistrations
                .filter(reg => {
                    if (!reg.user) return false;
                    const userId = typeof reg.user === 'string' ? reg.user.split('/').pop() : reg.user.id;
                    return String(userId) === String(user.id);
                })
                .map(reg => {
                    if (!reg.events) return null;
                    return typeof reg.events === 'string' ? reg.events.split('/').pop() : reg.events.id;
                })
                .filter(Boolean)
                .map(String);
            setRegisteredEvents(userRegistrations);
        }
    }, [user, eventRegistrations]);

    // Fonction pour annuler la participation
    const handleCancelParticipation = async (eventId) => {
        if (!user?.id) return;
        // Trouver l'inscription correspondante
        const registration = eventRegistrations.find(reg => {
            const regEventId = reg.events ? (typeof reg.events === 'string' ? reg.events.split('/').pop() : reg.events.id) : null;
            const regUserId = reg.user ? (typeof reg.user === 'string' ? reg.user.split('/').pop() : reg.user.id) : null;
            return String(regEventId) === String(eventId) && String(regUserId) === String(user.id);
        });
        if (!registration) {
            alert("Inscription non trouvée.");
            return;
        }
        setLoadingRegister(prev => ({ ...prev, [eventId]: true }));
        try {
            await axios.delete(`/api/event_registrations/${registration.id}`);
            setRegisteredEvents(prev => prev.filter(id => id !== String(eventId)));
            refreshEvents && refreshEvents();
        } catch (e) {
            alert("Erreur lors de l'annulation de la participation");
        } finally {
            setLoadingRegister(prev => ({ ...prev, [eventId]: false }));
        }
    };

    // Filtrer les événements à venir
    const now = new Date();
    const upcomingEvents = universityEvents.filter(event => {
        if (!event.eventDateTime) return true;
        return new Date(event.eventDateTime) > now;
    });

    if (loading || !mapPosition) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!university) {
        return (
            <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2, mb: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
                    </Grid>
                </Grid>
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mt: 4 }} />
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mt: 4 }} />
            </Box>
        );
    }

    const handleReviewChange = (e) => {
        setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
    };
    const handleRatingChange = (_, value) => {
        setReviewForm({ ...reviewForm, rating: value });
    };
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.comment || !reviewForm.rating || !user?.id) return;
        if (!university?.id) {
            alert("L'université n'est pas encore chargée. Veuillez patienter.");
            return;
        }
        try {
            await axios.post('/api/avis', {
                contenu: reviewForm.comment,
                rating: reviewForm.rating,
                user: `/api/users/${user.id}`,
                institutions: `/api/institutions/${university.id}`
            }, {
                headers: { 'Content-Type': 'application/ld+json' }
            });
            fetchReviews(); // Recharge la liste après ajout
            setReviewForm({ comment: '', rating: 0 });
        } catch (err) {
            alert("Erreur lors de l'envoi de l'avis");
        }
    };

    const handleParticipate = async (eventId) => {
        if (!user?.id) return;
        setLoadingRegister(prev => ({ ...prev, [eventId]: true }));
        try {
            await axios.post('/api/event_registrations', {
                user: `/api/users/${user.id}`,
                events: `/api/events/${eventId}`,
                status: false
            }, {
                headers: { 'Content-Type': 'application/ld+json' }
            });
            setRegisteredEvents(prev => [...prev, eventId]);
            setOpenSnackbar(true);
        } catch (e) {
            alert("Erreur lors de l'inscription à l'événement");
        } finally {
            setLoadingRegister(prev => ({ ...prev, [eventId]: false }));
        }
    };

    const handleItinerary = () => {
        if (!mapPosition) return;
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const destLat = mapPosition[0];
                const destLon = mapPosition[1];
                const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destLat},${destLon}`;
                window.open(url, '_blank');
            },
            (err) => {
                alert("Impossible de récupérer votre position actuelle. Veuillez autoriser la géolocalisation.");
            }
        );
    };

    return (
        <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            {/* Header modernisé */}
            <HeaderBox>
                <HeaderLogo
                    src={university.logo || university.photo || "https://via.placeholder.com/300x200?text=Photo+non+disponible"}
                    alt={university.institution_name}
                />
                <HeaderInfo>
                    <Typography variant="h4" fontWeight={700} gutterBottom>{university.institution_name}</Typography>
                    <Typography variant="body1" color="text.secondary">
                        {university.type ? `Type : ${university.type}` : 'Type non spécifié'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {university.region ? `Région : ${university.region}` : 'Région non spécifiée'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {university.location ? `Localisation : ${university.location}` : 'Localisation non spécifiée'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {university.contact ? `Contact : ${university.contact}` : 'Contact non spécifié'}
                    </Typography>
                </HeaderInfo>
            </HeaderBox>
            {/* Description/Historique */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Historique</Typography>
                <Typography variant="body1" color="text.secondary">
                    {university.history || "Aucune historique disponible"}
                </Typography>
            </Box>
            {/* Carte */}
            <StyledCard sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>Localisation sur la carte</Typography>
                    <MapWrapper>
                        <MapContainer 
                            center={mapPosition} 
                            zoom={15} 
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={mapPosition}>
                                <Popup>
                                    <Typography variant="subtitle2" fontWeight={600}>{university.institution_name}</Typography>
                                    <Typography variant="body2">Région : {university.region || 'Non spécifiée'}</Typography>
                                    <Typography variant="body2">Localisation : {university.location || 'Non spécifiée'}</Typography>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </MapWrapper>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleItinerary}
                            startIcon={<DirectionsIcon />}
                            sx={{
                                borderRadius: 99,
                                px: 3,
                                py: 1.2,
                                fontWeight: 600,
                                fontSize: 16,
                                boxShadow: '0 2px 8px #1976d220',
                                textTransform: 'none',
                                transition: 'background 0.2s, box-shadow 0.2s',
                                background: 'linear-gradient(90deg, #1976d2 0%, #43a047 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #43a047 0%, #1976d2 100%)',
                                    boxShadow: '0 4px 16px #1976d255',
                                },
                            }}
                        >
                            Itinéraire
                        </Button>
                    </Box>
                </CardContent>
            </StyledCard>
            {/* Formations & Evénements côte à côte */}
            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
                <Grid item xs={12} md={6} sx={{ minWidth: 320, maxWidth: 600, flex: '1 1 520px' }}>
                    <StyledCard sx={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Formations proposées ({universityCourses.length})
                                </Typography>
                                {universityCourses.length > formationsPerPage && (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        background: 'linear-gradient(45deg, #f0f8ff, #e3f2fd)',
                                        borderRadius: '20px',
                                        px: 2,
                                        py: 0.5,
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            Page {currentPage} sur {totalPages}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            {universityCourses.length > 0 ? (
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ flex: 1 }}>
                                        {currentFormations.map((course, idx) => (
                                            <Grow in timeout={800 + idx * 200} key={course.id}>
                                                <div>
                                                    <Accordion 
                                                        expanded={expandedAccordion === `panel-${course.id}`}
                                                        onChange={handleAccordionChange(`panel-${course.id}`)}
                                                        sx={{ 
                                                            mb: 1, 
                                                            boxShadow: 'none', 
                                                            border: '1px solid #f0f0f0', 
                                                            borderRadius: 2,
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                borderColor: '#1976d2',
                                                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls={`panel-content-${course.id}`}
                                                            id={`panel-header-${course.id}`}
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: '#f8f9fa'
                                                                }
                                                            }}
                                                        >
                                                            <Typography fontWeight={600}>{course.title}</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Typography variant="body2"><b>Durée :</b> {course.duration || 'Non spécifiée'}</Typography>
                                                            <Typography variant="body2"><b>Diplôme :</b> {course.degree || 'Non spécifié'}</Typography>
                                                            <Typography variant="body2"><b>Prérequis :</b> {course.prerequisites || 'Non spécifiés'}</Typography>
                                                            <Typography variant="body2"><b>Admission :</b> {course.admission_process || 'Non spécifié'}</Typography>
                                                            <Typography variant="body2"><b>Frais :</b> {course.fees+ " Ariary / an (Frais generaux exclus)"|| 'Non spécifié'}</Typography>
                                                            <Typography variant="body2"><b>Langues :</b> {course.languages || 'Non spécifiées'}</Typography>
                                                            <Typography variant="body2"><b>Débouchés :</b> {course.career_prospects || 'Non spécifiés'}</Typography>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </div>
                                            </Grow>
                                        ))}
                                    </Box>
                                    
                                    {/* Boutons Précédent/Suivant */}
                                    {universityCourses.length > formationsPerPage && (
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center',
                                            mt: 3,
                                            gap: 2
                                        }}>
                                            <IconButton 
                                                onClick={handlePrevPage}
                                                size="large"
                                                sx={{
                                                    backgroundColor: '#f5f5f5',
                                                    '&:hover': {
                                                        backgroundColor: '#e0e0e0'
                                                    }
                                                }}
                                            >
                                                <NavigateBeforeIcon />
                                            </IconButton>
                                            
                                            <IconButton 
                                                onClick={handleNextPage}
                                                size="large"
                                                sx={{
                                                    backgroundColor: '#f5f5f5',
                                                    '&:hover': {
                                                        backgroundColor: '#e0e0e0'
                                                    }
                                                }}
                                            >
                                                <NavigateNextIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Aucune formation disponible pour cette université.
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} md={6} sx={{ minWidth: 350, maxWidth: 520, flex: '1 1 520px' }}>
                    <StyledCard sx={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Événements</Typography>
                            {upcomingEvents.length > 0 ? (
                                <Box sx={{ flex: 1, overflow: 'auto' }}>
                                    {upcomingEvents.map(event => (
                                        <Card key={event.id} sx={{ mb: 2, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <EventIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="subtitle1" fontWeight={700}>
                                                        {event.eventDateTime ? new Date(event.eventDateTime).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }) : 'Date à venir'}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6" fontWeight={700} gutterBottom>{event.title || event.name}</Typography>
                                                {event.description && (
                                                    <Typography variant="body2" sx={{ mb: 1 }}>{event.description}</Typography>
                                                )}
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Lieu : {university.institution_name}, {university.location}, {university.region}
                                                </Typography>
                                                <Box sx={{ mt: 1 }}>
                                                    {registeredEvents.includes(String(event.id)) ? (
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleCancelParticipation(event.id)}
                                                            disabled={loadingRegister[event.id]}
                                                            size="small"
                                                        >
                                                            Annuler la participation
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleParticipate(event.id)}
                                                            disabled={loadingRegister[event.id]}
                                                            size="small"
                                                        >
                                                            Participer
                                                        </Button>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            ) : (
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Aucun événement pour cette université.
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
            {/* Section Avis */}
            <Box sx={{ mb: 4 }}>
                <StyledCard>
                    <CardContent>
                        <Typography variant="h5" fontWeight={700} gutterBottom>Vos avis</Typography>
                        <Box sx={{ mb: 2 }}>
                            {loadingReviews || !Array.isArray(users) || users.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">Chargement des avis...</Typography>
                            ) : reviews.length > 0 ? reviews
                                .filter((review) => {
                                    if (!review.institutions) return false;
                                    if (typeof review.institutions === 'string') {
                                        return review.institutions.split('/').pop() === String(university.id);
                                    } else if (typeof review.institutions === 'object' && review.institutions.id) {
                                        return String(review.institutions.id) === String(university.id);
                                    }
                                    return false;
                                })
                                .map((review) => {
                                    let userId = null;
                                    if (typeof review.user === 'string') {
                                        userId = review.user.split('/').pop();
                                    } else if (typeof review.user === 'object' && review.user?.id) {
                                        userId = String(review.user.id);
                                    }
                                    const userObj = Array.isArray(users) ? users.find(u => String(u.id) === String(userId)) : null;
                                    let userName = 'Utilisateur';
                                    let initial = 'U';
                                    if (userObj) {
                                        if (userObj.firstname || userObj.lastname) {
                                            userName = `${userObj.firstname || ''} ${userObj.lastname || ''}`.trim();
                                            initial = (userObj.firstname || userObj.lastname || 'U').charAt(0).toUpperCase();
                                        } else if (userObj.name) {
                                            userName = userObj.name;
                                            initial = userObj.name.charAt(0).toUpperCase();
                                        } else if (userObj.email) {
                                            userName = userObj.email;
                                            initial = userObj.email.charAt(0).toUpperCase();
                                        }
                                    }
                                    return (
                                        <ReviewItem key={review.id}>
                                            <Avatar>{initial}</Avatar>
                                            <Box>
                                                <Typography fontWeight={600}>{userName}</Typography>
                                                <Rating value={review.rating} readOnly size="small" />
                                                <Typography variant="body2" color="text.secondary">{review.contenu}</Typography>
                                            </Box>
                                        </ReviewItem>
                                    );
                                }) : (
                                <Typography variant="body2" color="text.secondary">Aucun avis pour l'instant.</Typography>
                            )}
                        </Box>
                        <ReviewForm onSubmit={handleReviewSubmit}>
                            <Typography variant="subtitle1" fontWeight={600}>Laisser un avis</Typography>
                            <Rating
                                name="rating"
                                value={reviewForm.rating}
                                onChange={handleRatingChange}
                                size="large"
                            />
                            <TextField
                                label="Commentaire"
                                name="comment"
                                value={reviewForm.comment}
                                onChange={handleReviewChange}
                                required
                                multiline
                                minRows={2}
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button type="submit" variant="contained" color="primary" disabled={!university?.id}>
                                    Envoyer
                                </Button>
                                <Button variant="outlined" color="primary" onClick={() => navigate('/home/message')}>
                                    Contacter
                                </Button>
                            </Box>
                        </ReviewForm>
                    </CardContent>
                </StyledCard>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2500}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    icon={<CheckCircleIcon fontSize="inherit" sx={{ color: 'white' }} />}
                >
                    Vous avez participé
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UniversityDetails;
