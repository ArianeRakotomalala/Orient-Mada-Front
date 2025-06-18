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
    Alert
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

const UniversityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [university, setUniversity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { courses, events } = useContext(DataContext); // adapte le nom si besoin
    const [mapPosition, setMapPosition] = useState(null);
    const { user } = useContext(UserContext);
    const [registeredEvents, setRegisteredEvents] = useState([]); // ids des events où l'utilisateur est inscrit
    const [loadingRegister, setLoadingRegister] = useState({}); // loading par event
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Avis mockés (à remplacer par API plus tard)
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: 'Jean',
            rating: 4,
            comment: 'Très bonne université, professeurs compétents.',
        },
        {
            id: 2,
            name: 'Sofia',
            rating: 5,
            comment: 'Super expérience, campus agréable.',
        },
    ]);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 0, comment: '' });

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

    const universityCourses = Array.isArray(courses)
        ? courses.filter(course => {
            const institutionId = course.institutions.split('/').pop();
            return String(institutionId) === String(university.id);
        })
        : [];

    const universityEvents = Array.isArray(events)
        ? events.filter(event => {
            if (!event.institution) return false;
            return String(event.institution).split('/').pop() === String(university.id);
        })
        : [];

    const handleReviewChange = (e) => {
        setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
    };
    const handleRatingChange = (_, value) => {
        setReviewForm({ ...reviewForm, rating: value });
    };
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (reviewForm.name && reviewForm.rating && reviewForm.comment) {
            setReviews([
                ...reviews,
                { ...reviewForm, id: Date.now() },
            ]);
            setReviewForm({ name: '', rating: 0, comment: '' });
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

    return (
        <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <StyledCard sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                                {university.institution_name}
                            </Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                {university.history || "Aucune description disponible"}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <InfoBox>
                                <Typography variant="subtitle1" fontWeight={600}>Informations</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Région : {university.region || 'Non spécifiée'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Localisation : {university.location || 'Non spécifiée'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Type : {university.type || 'Non spécifié'}
                                </Typography>
                            </InfoBox>
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
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} md={5}>
                    <StyledCard>
                        <UniversityImage
                            src={university.src_img || university.photo || "https://via.placeholder.com/300x200?text=Photo+non+disponible"}
                            alt={university.institution_name}
                        />
                        <CardContent>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    Contact
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Email : {university.contact || "Non spécifié"}
                                </Typography>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
                <StyledCard>
                    <CardContent>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Formations proposées
                        </Typography>
                        {universityCourses.length > 0 ? (
                            <ul style={{ paddingLeft: 20 }}>
                                {universityCourses.map(course => (
                                    <li key={course.id}>
                                        <Typography variant="body1">{course.title}</Typography>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Aucune formation disponible pour cette université.
                            </Typography>
                        )}
                    </CardContent>
                </StyledCard>
            </Box>
            {/* Section Events (juste au-dessus des avis) */}
            <Box sx={{ mt: 4 }}>
                {universityEvents.length > 0 ? (
                    <Grid container spacing={2}>
                        {universityEvents.map(event => (
                            <Grid item xs={12} md={6} key={event.id}>
                                <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', p: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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
                                            Cet événement se tiendra à {university.institution_name}, {university.location}, {university.region}.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ ml: { sm: 2 }, mt: { xs: 2, sm: 0 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {registeredEvents.includes(event.id) ? (
                                            <CheckCircleIcon sx={{ color: 'green', fontSize: 36 }} />
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleParticipate(event.id)}
                                                disabled={loadingRegister[event.id]}
                                            >
                                                Participer
                                            </Button>
                                        )}
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Aucun événement pour cette université.
                    </Typography>
                )}
            </Box>
            {/* Section Avis */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Vos avis</Typography>
                <Box sx={{ mb: 2 }}>
                    {reviews.length > 0 ? reviews.map((review) => (
                        <ReviewItem key={review.id}>
                            <Avatar>{review.name[0]}</Avatar>
                            <Box>
                                <Typography fontWeight={600}>{review.name}</Typography>
                                <Rating value={review.rating} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                            </Box>
                        </ReviewItem>
                    )) : (
                        <Typography variant="body2" color="text.secondary">Aucun avis pour l'instant.</Typography>
                    )}
                </Box>
                <ReviewForm onSubmit={handleReviewSubmit}>
                    <Typography variant="subtitle1" fontWeight={600}>Laisser un avis</Typography>
                    <TextField
                        label="Nom"
                        name="name"
                        value={reviewForm.name}
                        onChange={handleReviewChange}
                        required
                        size="small"
                    />
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
                        <Button type="submit" variant="contained" color="primary">
                            Envoyer
                        </Button>
                        <Button variant="outlined" color="primary" onClick={() => navigate('/home/message')}>
                            Contacter
                        </Button>
                    </Box>
                </ReviewForm>
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
