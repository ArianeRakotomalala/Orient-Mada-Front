import React, { useContext, useState, useEffect } from "react";
import Skeleton from '@mui/material/Skeleton';
import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Tooltip,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { UserContext } from "../Context/UserContext";
import { DataContext } from "../Context/DataContext";
import { Phone, Email, LocationOn, Cake, Person, Interests, Favorite, Bookmark as BookmarkIcon, AccessTime, People } from "@mui/icons-material";
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay } from 'date-fns';
import fr from 'date-fns/locale/fr';

function stringAvatar(name) {
  return {
    children: name ? name[0].toUpperCase() : "?",
  };
}

export default function Profil() {
  const { user, userProfils, favorisUtilisateur, loadingFavoris, setUser, setUserProfils } = useContext(UserContext);
  const { institutions, events, eventRegistrations } = useContext(DataContext);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    serie: "",
    date_naissance: "",
    adresse: "",
    hobbies: "",
  });

  const [userEvents, setUserEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: userProfils?.name || "",
        prenom: userProfils?.firstname || "",
        email: user.email || "",
        telephone: user.telephone || "",
        serie: ["A1", "A2", "C", "D"].includes(userProfils?.serie) ? userProfils.serie : "",
        date_naissance: userProfils?.birthday || "",
        adresse: userProfils?.adress || "",
        hobbies: userProfils?.hobbies || "",
      });
    }
  }, [user, userProfils]);

  useEffect(() => {
    if (favorisUtilisateur) {
      setLoading(false);
    }
  }, [favorisUtilisateur]);

  useEffect(() => {
    if (user && eventRegistrations && events) {
      const userRegisteredEventIds = eventRegistrations
        .filter(reg => {
          const userId = reg.user?.id || String(reg.user).split('/').pop();
          return String(userId) === String(user.id);
        })
        .map(reg => reg.events ? String(reg.events).split('/').pop() : null)
        .filter(Boolean);

      const filteredEvents = events
        .filter(event => userRegisteredEventIds.includes(String(event.id)) && event.eventDateTime);
        
      setUserEvents(filteredEvents);
    }
  }, [user, eventRegistrations, events]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Mapper les champs du formulaire vers ceux attendus par l'API
      const profilPayload = {
        name: formData.nom,
        firstname: formData.prenom,
        birthday: formData.date_naissance,
        adress: formData.adresse,
        hobbies: formData.hobbies,
        serie: formData.serie,
        // Ajouter le champ user uniquement lors de la création
        ...(userProfils?.id ? {} : { user: `/api/users/${user.id}` })
      };

      // 1. Création ou modification du profil
      const method = userProfils?.id ? 'patch' : 'post';
      const url = userProfils?.id
        ? `/api/users_profils/${userProfils.id}`
        : '/api/users_profils';
      const headers = {
        'Content-Type': userProfils?.id ? 'application/merge-patch+json' : 'application/ld+json'
      };
      const response = await axios({
        method,
        url,
        data: profilPayload,
        headers
      });
      console.log('Réponse PATCH/POST profil:', response.data);
      // Mettre à jour le contexte global
      setUserProfils(response.data);
      // Mettre à jour le formulaire localement
      setFormData({
        nom: response.data.name || "",
        prenom: response.data.firstname || "",
        email: formData.email, // l'API ne retourne peut-être pas l'email
        telephone: formData.telephone, // idem
        serie: response.data.serie || "",
        date_naissance: response.data.birthday || "",
        adresse: response.data.adress || "",
        hobbies: response.data.hobbies || "",
      });
      setOpenSnackbar(true);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error, error.response);
      alert(error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleOpenEventDialog = (events) => {
    setSelectedDateEvents(events);
    setEventDialogOpen(true);
  };

  const handleCloseEventDialog = () => {
    setEventDialogOpen(false);
  };

  const getInstitutionNameById = (id) => {
    if (!id || !institutions || !Array.isArray(institutions)) return "Institution inconnue";
    const institution = institutions.find(inst => String(inst.id) === String(id));
    return institution ? institution.institution_name : "Institution non trouvée";
  };

  const renderFavoritesList = (isDialog = false) => {
    if (loadingFavoris) {
      return <CircularProgress />;
    }
    if (!favorisUtilisateur || favorisUtilisateur.length === 0) {
      return <Typography>Vous n'avez pas encore de favoris.</Typography>;
    }

    const groupedFavorites = favorisUtilisateur.reduce((acc, fav) => {
      const collection = fav.collection_name || 'Autres';
      if (!acc[collection]) acc[collection] = [];
      acc[collection].push(fav);
      return acc;
    }, {});

    const entries = Object.entries(groupedFavorites);
    const itemsToDisplay = isDialog ? entries : entries.slice(0, 1);

    return (
      <Stack spacing={2.5}>
        {itemsToDisplay.map(([collection, favs]) => (
          <Box key={collection}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BookmarkIcon sx={{ mr: 1, color: 'text.primary', fontSize: '1.2rem' }} />
              <Typography variant="subtitle1" fontWeight={600}>{collection}</Typography>
            </Box>
            <Stack spacing={1}>
              {favs.map((fav, index) => {
                const institutionId = fav.institution ? String(fav.institution).split('/').pop() : null;
                const institutionName = getInstitutionNameById(institutionId);
                return (
                  <Card key={index} variant="outlined" sx={{ ml: 3 }}>
                    <CardContent sx={{ py: '8px !important' }}>
                      <Typography variant="body2">{institutionName}</Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    );
  };

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h6">Chargement du profil...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#fff",
        display: "flex",
        gap: 4,
        p: 4,
      }}
    >
      {/* Partie gauche : formulaire profil */}
      <Box
        sx={{
          flex: 2,
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box sx={{ maxWidth: "600px", mx: "auto" }}>
          <Box sx={{ position: "relative", width: 140, height: 140, mx: "auto", mb: 4 }}>
            <Avatar
              sx={{
                width: 140,
                height: 140,
                bgcolor: "#1976d2",
                fontSize: 56,
              }}
            >
              {userProfils?.name
                ? userProfils.name.charAt(0).toUpperCase()
                : (user.email ? user.email.charAt(0).toUpperCase() : "?")}
            </Avatar>
            <IconButton
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                bgcolor: "#fff",
                boxShadow: 1,
                "&:hover": { bgcolor: "#f5f5f5" },
                zIndex: 2,
              }}
              size="small"
              component="label"
            >
              <CameraAltIcon fontSize="small" />
              <input hidden accept="image/*" type="file" />
            </IconButton>
          </Box>
          <Typography variant="h5" fontWeight={800} mb={4} color="text.primary" textAlign="center">
            {userProfils?.name
              ? `${userProfils.name.charAt(0).toUpperCase() + userProfils.name.slice(1).toLowerCase()}${userProfils.firstname ? ' ' + userProfils.firstname.charAt(0).toUpperCase() + userProfils.firstname.slice(1).toLowerCase() : ''}`
              : (user.email ? user.email.charAt(0).toUpperCase() + user.email.slice(1).toLowerCase() : "")}
          </Typography>

          <Stack spacing={2}>
            <TextField label="Nom" value={formData.nom} onChange={handleChange("nom")} variant="outlined" fullWidth />
            <TextField label="Prénom" value={formData.prenom} onChange={handleChange("prenom")} variant="outlined" fullWidth />
            <TextField
              label="Email"
              value={formData.email}
              onChange={handleChange("email")}
              InputProps={{ startAdornment: <Email sx={{ mr: 1, color: "action.active" }} /> }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Téléphone"
              value={formData.telephone}
              onChange={handleChange("telephone")}
              InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} /> }}
              variant="outlined"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="serie-label">Série</InputLabel>
              <Select
                labelId="serie-label"
                label="Série"
                value={formData.serie}
                onChange={handleChange("serie")}
              >
                <MenuItem value="">Sélectionnez votre série</MenuItem>
                <MenuItem value="A1">A1</MenuItem>
                <MenuItem value="A2">A2</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date d'anniversaire"
              type="date"
              value={formData.date_naissance}
              onChange={handleChange("date_naissance")}
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: <Cake sx={{ mr: 1, color: "action.active" }} /> }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Adresse"
              value={formData.adresse}
              onChange={handleChange("adresse")}
              InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: "action.active" }} /> }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Hobbies"
              value={formData.hobbies}
              onChange={handleChange("hobbies")}
              InputProps={{ startAdornment: <Interests sx={{ mr: 1, color: "action.active" }} /> }}
              variant="outlined"
              fullWidth
            />
            <Box textAlign="center" mt={2}>
              <Button variant="contained" onClick={handleSubmit} size="large" sx={{ px: 4, py: 1 }}>
                Enregistrer
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Partie droite : favoris et calendrier */}
      <Box sx={{
        flex: 1,
        borderLeft: '1px solid #ddd',
        pl: 4,
        overflowY: 'auto',
        '.custom-calendar': {
          border: 'none',
          width: '100%',
        },
        '.custom-calendar .react-calendar__tile--active': {
          background: '#1976d2',
          color: 'white',
        },
        '.custom-calendar .react-calendar__tile--now': {
          background: '#e6f2ff',
        },
        '.custom-calendar .react-calendar__navigation button': {
          minWidth: '30px',
          fontSize: '0.8rem',
        },
        '.custom-calendar .react-calendar__month-view__weekdays__weekday': {
          fontSize: '0.7rem',
          textTransform: 'uppercase',
        },
        '.custom-calendar .react-calendar__tile': {
          fontSize: '0.75rem',
          padding: '8px 4px',
        },
        '.event-day': {
          background: 'rgba(233, 30, 99, 0.15) !important',
          borderRadius: '8px',
        },
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            <Favorite sx={{ mr: 1, verticalAlign: "middle", color: "#e91e63" }} /> Mes Favoris
          </Typography>
          {favorisUtilisateur && favorisUtilisateur.length > 1 && (
            <Link component="button" variant="body2" onClick={handleOpenDialog}>
              Voir tout
            </Link>
          )}
        </Box>
        
        {renderFavoritesList()}

        {/* Calendrier des événements */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={1.5} color="text.primary">
            Mon Calendrier
          </Typography>
          <Card variant="outlined">
            <CardContent>
              <Calendar
                locale="fr-FR"
                onClickDay={(date) => {
                  const eventsOnDay = userEvents.filter(event => isSameDay(date, new Date(event.eventDateTime)));
                  if (eventsOnDay.length > 0) {
                    handleOpenEventDialog(eventsOnDay);
                  }
                }}
                tileClassName={({ date, view }) => {
                  if (view === 'month' && userEvents.some(event => isSameDay(date, new Date(event.eventDateTime)))) {
                    return 'event-day';
                  }
                  return null;
                }}
                className="custom-calendar"
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs" scroll="paper">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Favorite sx={{ mr: 1, color: "#e91e63" }} />
          Tous mes favoris
        </DialogTitle>
        <DialogContent dividers>
          {renderFavoritesList(true)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={eventDialogOpen} onClose={handleCloseEventDialog} fullWidth maxWidth="sm">
        <DialogTitle>
            Événements du {selectedDateEvents.length > 0 ? new Date(selectedDateEvents[0].eventDateTime).toLocaleDateString('fr-FR') : ''}
        </DialogTitle>
        <DialogContent dividers>
            <Stack spacing={2}>
                {selectedDateEvents.map(event => (
                    <Card key={event.id} variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>{event.title || event.name}</Typography>
                            {event.description && <Typography variant="body2" color="text.secondary" paragraph>{event.description}</Typography>}
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime sx={{ mr: 1, fontSize: '1.1rem', color: 'text.secondary' }} />
                                    <Typography variant="body2">{new Date(event.eventDateTime).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</Typography>
                                </Box>
                                {event.lieu &&
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationOn sx={{ mr: 1, fontSize: '1.1rem', color: 'text.secondary' }} />
                                        <Typography variant="body2">{event.lieu}</Typography>
                                    </Box>
                                }
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <People sx={{ mr: 1, fontSize: '1.1rem', color: 'text.secondary' }} />
                                    <Typography variant="body2">Organisé par : {getInstitutionNameById(event.institution?.split('/').pop() || event.institution)}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseEventDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Profil mis à jour avec succès!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}