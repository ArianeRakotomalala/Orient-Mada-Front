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
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { UserContext } from "../Context/UserContext";
import { DataContext } from "../Context/DataContext";
import { Phone, Email, LocationOn, Cake, Person, Interests, Favorite } from "@mui/icons-material";
import axios from 'axios';

function stringAvatar(name) {
  return {
    children: name ? name[0].toUpperCase() : "?",
  };
}

export default function Profil() {
  const { user, userProfils, favorisUtilisateur, loadingFavoris, setUser } = useContext(UserContext);
  const { institutions } = useContext(DataContext);

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

  const [loading, setLoading] = useState(true);

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
      };

      // 1. Création ou modification du profil
      const method = userProfils?.id ? 'patch' : 'post';
      const url = userProfils?.id
        ? `/api/users_profils/${userProfils.id}`
        : '/api/users_profils';
      const response = await axios({
        method,
        url,
        data: profilPayload,
        headers: {
          'Content-Type': 'application/ld+json'
        }
      });
      console.log(response.data.member);
      // 2. Récupérer l'id du profil (selon la structure de ta réponse API)
      let profilId = response.data.id || response.data._id;
      if (!profilId && response.data['@id']) {
        // Extraire l'id de l'IRI
        const iriParts = response.data['@id'].split('/');
        profilId = iriParts[iriParts.length - 1];
      }
      if (!profilId) throw new Error("Impossible de récupérer l'id du profil créé/modifié");

      // 3. Mettre à jour le user avec le nouvel id de profil (en IRI)
      const userUpdateRes = await axios.patch(`/api/users/${user.id}`, {
        user_profils_id_id: `/api/users_profils/${profilId}`,
      }, {
        headers: {
          'Content-Type': 'application/ld+json'
        }
      });

      // 4. Mettre à jour le contexte utilisateur et le localStorage
      const updatedUser = { ...user, user_profils_id_id: `/api/users_profils/${profilId}` };
      setUser(updatedUser);
      localStorage.setItem("user_info", JSON.stringify(updatedUser));

      alert('Profil et utilisateur sauvegardés avec succès !');
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde');
    }
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
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box sx={{ maxWidth: "600px", mx: "auto" }}>
          <Box sx={{ position: "relative", width: 140, height: 140, mx: "auto", mb: 4 }}>
            <Avatar
              {...stringAvatar(formData.email || formData.nom)}
              sx={{
                width: 140,
                height: 140,
                bgcolor: "#1976d2",
                fontSize: 56,
              }}
            />
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
            {formData.nom
              ? formData.nom.charAt(0).toUpperCase() + formData.nom.slice(1).toLowerCase()
              : formData.email.charAt(0).toUpperCase() + formData.email.slice(1).toLowerCase()}
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

      {/* Partie droite : favoris */}
      <Box
        sx={{
          width: "300px",
          overflowY: "auto",
          borderLeft: "1px solid #eee",
          pl: 4,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
          "&::-webkit-scrollbar-thumb": { background: "#ddd", borderRadius: "3px" },
        }}
      >
        <Typography variant="h6" fontWeight={500} mb={3} color="text.primary">
          Vos favoris
        </Typography>

        {loadingFavoris ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          (() => {
            const userFavorites = favorisUtilisateur || [];

            if (userFavorites.length === 0) {
              return (
                <Box sx={{ p: 3, borderRadius: 1, bgcolor: "#fafafa", color: "text.secondary", fontStyle: "italic" }}>
                  Aucun favori pour le moment.
                </Box>
              );
            }

            // Grouper par collection_name
            const grouped = {};
            userFavorites.forEach((fav) => {
              if (!grouped[fav.collection_name]) grouped[fav.collection_name] = [];
              grouped[fav.collection_name].push(fav);
            });
           
            return Object.entries(grouped).map(([collection, favs], idx) => (
              
              <Card key={idx} sx={{ bgcolor: "#fafafa", mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Favorite sx={{ color: "#ff4081", mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight={700}>{collection}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  
                  <Stack spacing={1}>
                    {favs.map((fav, i) => {
                      const idInstitution = fav.institution?.split("/").pop();
                      const institution = institutions?.member?.find(inst => String(inst.id) === idInstitution);
                      const nomInstitution = institution?.institution_name || idInstitution;

                      return (
                        <Typography key={i} variant="body2" color="text.secondary">
                          <li style={{listStyleType: "square"}}>
                            {nomInstitution}
                          </li>
                        </Typography>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            ));
          })()
        )}
      </Box>
    </Box>
  );
}
