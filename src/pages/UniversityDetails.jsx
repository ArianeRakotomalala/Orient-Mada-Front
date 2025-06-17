import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DataContext } from '../Context/DataContext'; // adapte le chemin si besoin

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

const UniversityDetails = () => {
    const { id } = useParams();
    const [university, setUniversity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { courses } = useContext(DataContext); // adapte le nom si besoin

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

    if (loading) {
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
            <Box sx={{ p: 2 }}>
                <Typography>Université non trouvée</Typography>
            </Box>
        );
    }

    // Coordonnées par défaut pour Antananarivo
    const defaultPosition = [-18.8792, 47.5079];
    const position = university.coordinates || defaultPosition;

    const universityCourses = Array.isArray(courses)
        ? courses.filter(course => {
            const institutionId = course.institutions.split('/').pop();
            return String(institutionId) === String(university.id);
        })
        : [];

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {university.institution_name}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {university.history || "Aucune description disponible"}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Informations supplémentaires
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Localisation: {university.location || "Non spécifiée"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Type: {university.type || "Non spécifié"}
                            </Typography>
                            
                            {/* Carte Leaflet */}
                            <MapWrapper>
                                <MapContainer 
                                    center={position} 
                                    zoom={15} 
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={position}>
                                        <Popup>
                                            {university.institution_name}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </MapWrapper>
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent>
                            <UniversityImage
                                src={university.photo || "https://via.placeholder.com/300x200?text=Photo+non+disponible"}
                                alt={university.institution_name}
                            />
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Contact
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Email: {university.contact || "Non spécifié"}
                                </Typography>
                                
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Formations proposées
                </Typography>
                {universityCourses.length > 0 ? (
                    <ul>
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
            </Box>
        </Box>
    );
};

export default UniversityDetails;
