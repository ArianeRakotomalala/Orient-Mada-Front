import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Skeleton,
  Button,
  Pagination,
  Stack
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import PageTitle from '../components/PageTitle';
import { DataContext } from '../Context/DataContext';
import { UserContext } from '../Context/UserContext';
import axios from 'axios';

const Events = () => {
  const { events, loading, institutions, eventRegistrations, refreshEvents } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loadingRegister, setLoadingRegister] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

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
    } catch (e) {
      alert("Erreur lors de l'annulation de l'inscription");
    } finally {
      setLoadingRegister(prev => ({ ...prev, [eventId]: false }));
    }
  };

  // Fonction pour participer à un événement
  const handleParticipate = async (eventId) => {
    if (!user?.id) {
      alert("Veuillez vous connecter pour participer à un événement");
      return;
    }
    
    setLoadingRegister(prev => ({ ...prev, [eventId]: true }));
    try {
      const response = await axios.post('/api/event_registrations', {
        user: `/api/users/${user.id}`,
        events: `/api/events/${eventId}`,
        status: false
      }, {
        headers: { 'Content-Type': 'application/ld+json' }
      });
      // Mettre à jour la liste des inscriptions pour inclure le nouvel ID
      refreshEvents(); // Pourrait être remplacé par une mise à jour plus ciblée
      setRegisteredEvents(prev => [...prev, String(eventId)]);
    } catch (e) {
      alert("Erreur lors de l'inscription à l'événement");
    } finally {
      setLoadingRegister(prev => ({ ...prev, [eventId]: false }));
    }
  };

  // Fonction pour formater la date
  const formatEventDate = (dateString) => {
    if (!dateString) return 'Date à venir';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date à venir';
    }
  };

  // Fonction pour déterminer le statut de l'événement
  const getEventStatus = (event) => {
    if (!event.event_date_time) return 'À venir';
    
    const eventDate = new Date(event.event_date_time);
    const now = new Date();
    
    if (eventDate < now) {
      return 'Terminé';
    } else if (eventDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return 'En cours';
    } else {
      return 'À venir';
    }
  };

  // Fonction pour déterminer le type d'événement
  const getEventType = (event) => {
    const title = event.title || event.name || '';
    const description = event.description || '';
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('salon') || text.includes('forum')) return 'Salon';
    if (text.includes('porte') || text.includes('ouverte')) return 'Portes Ouvertes';
    if (text.includes('conférence') || text.includes('conférence')) return 'Conférence';
    if (text.includes('workshop') || text.includes('atelier')) return 'Workshop';
    if (text.includes('formation')) return 'Formation';
    return 'Événement';
  };

  // Fonction pour trier les événements
  const sortEvents = (eventsList) => {
    if (!eventsList || !Array.isArray(eventsList)) return [];
    
    return [...eventsList].sort((a, b) => {
      const statusA = getEventStatus(a);
      const statusB = getEventStatus(b);
      
      // Ordre de priorité : À venir > En cours > Terminé
      const statusOrder = { 'À venir': 0, 'En cours': 1, 'Terminé': 2 };
      
      // Si les statuts sont différents, trier par statut
      if (statusOrder[statusA] !== statusOrder[statusB]) {
        return statusOrder[statusA] - statusOrder[statusB];
      }
      
      // Si les statuts sont identiques, trier par date (plus proche en premier)
      const dateA = a.event_date_time ? new Date(a.event_date_time) : new Date(0);
      const dateB = b.event_date_time ? new Date(b.event_date_time) : new Date(0);
      
      return dateA - dateB;
    });
  };

  // Fonction pour obtenir le nom de l'institution
  const getInstitutionName = (event) => {
    if (!event.institution || !institutions || !Array.isArray(institutions)) return null;
    
    let institutionId;
    
    // Vérifier si c'est une URL API Platform ou directement un ID
    if (typeof event.institution === 'string' && event.institution.includes('/')) {
      // C'est une URL API Platform, extraire l'ID
      institutionId = event.institution.split('/').pop();
    } else {
      // C'est directement un ID
      institutionId = event.institution;
    }
    
    // Chercher l'institution dans la liste
    const institution = institutions.find(inst => String(inst.id) === String(institutionId));
    
    return institution ? institution.institution_name : null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'À venir':
        return 'primary';
      case 'En cours':
        return 'success';
      case 'Terminé':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Salon':
        return 'error';
      case 'Portes Ouvertes':
        return 'info';
      case 'Conférence':
        return 'warning';
      case 'Workshop':
        return 'success';
      case 'Formation':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Calcul de la pagination
  const sortedEvents = sortEvents(events);
  const totalPages = Math.ceil((sortedEvents?.length || 0) / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = sortedEvents?.slice(startIndex, endIndex) || [];

  // Ajout d'un log pour diagnostiquer la structure d'un événement
  if (events && events.length > 0) {
    console.log("Exemple d'événement :", events[0]);
  }

  // Gestion du changement de page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        py: 6, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        background: '#f5f5f5'
      }}>
        <Skeleton variant="text" width={320} height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={900} height={60} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={1000} height={420} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'white',
      py: 4,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f5f5f5',
        pointerEvents: 'none'
      }} />
      
      <Box maxWidth="lg" mx="auto" position="relative">
        <PageTitle 
          title="Événements à Madagascar"
          subtitle="Retrouvez tous les événements académiques, conférences et rencontres universitaires à Madagascar."
          icon={EventIcon}
          color="linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)"
        />

        {/* Information sur les événements */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {`${sortedEvents?.length || 0} événement(s) trouvé(s) - Page ${currentPage} sur ${totalPages}`}
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {currentEvents && currentEvents.length > 0 ? currentEvents.map((event, index) => {
            const eventStatus = getEventStatus(event);
            const eventType = getEventType(event);
            const isRegistered = registeredEvents.includes(String(event.id));
            
            return (
              <Grid item xs={12} md={6} key={event.id}>
                <Card
                  sx={{
                    height: 500,
                    maxWidth: 500,
                    mx: 'auto',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header avec titre et badges */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography 
                      variant="h5" 
                      fontWeight={700} 
                      sx={{ 
                        color: '#333333',
                        lineHeight: 1.3,
                        flex: 1,
                        mr: 2
                      }}
                    >
                        {event.title || event.name || 'Événement sans titre'}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip 
                          label={eventType} 
                          color={getTypeColor(eventType)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip 
                          label={eventStatus} 
                          color={getStatusColor(eventStatus)}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                    {event.description && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666666',
                      lineHeight: 1.6,
                      mb: 3,
                      textAlign: 'justify'
                    }}
                  >
                    {event.description}
                  </Typography>
                    )}

                  {/* Informations détaillées */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#666666', fontWeight: 500 }}>
                          {formatEventDate(event.event_date_time)}
                      </Typography>
                    </Box>
                    
                      {event.lieu && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#666666', fontWeight: 500 }}>
                            Lieu : {event.lieu}
                          </Typography>
                        </Box>
                      )}
                      
                      {event.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#666666', fontWeight: 500 }}>
                        {event.location}
                      </Typography>
                    </Box>
                      )}
                    
                      {getInstitutionName(event) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#666666', fontWeight: 500 }}>
                            Organisé par : {getInstitutionName(event)}
                      </Typography>
                        </Box>
                      )}
                  </Box>

                    {/* Bouton d'action - toujours en bas */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
                      {isRegistered ? (
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => handleCancelParticipation(event.id)}
                          disabled={loadingRegister[event.id]}
                          sx={{ 
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            '&:hover': {
                              transform: 'scale(1.05)',
                              transition: 'transform 0.2s ease'
                            }
                          }}
                        >
                          {loadingRegister[event.id] ? 'Annulation...' : 'Annuler l\'inscription'}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                      color="primary"
                          onClick={() => handleParticipate(event.id)}
                          disabled={loadingRegister[event.id] || eventStatus === 'Terminé'}
                      sx={{ 
                        fontWeight: 600,
                            px: 3,
                            py: 1,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          transition: 'transform 0.2s ease'
                        }
                      }}
                        >
                          {loadingRegister[event.id] ? 'Inscription...' : 'Participer'}
                        </Button>
                      )}
                  </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          }) : null}
          </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Stack spacing={2}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton 
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 600,
                    fontSize: '1rem',
                    minWidth: 40,
                    height: 40,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #e55a2b, #e8851a)',
                      }
                    }
                  }
                }}
              />
            </Stack>
          </Box>
        )}

        {(!events || events.length === 0) && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <EventIcon sx={{ fontSize: 80, color: 'rgba(255, 107, 53, 0.3)', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              Aucun événement disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Revenez bientôt pour découvrir les prochains événements éducatifs.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Events;
