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
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { UserContext } from "../Context/UserContext";
import { DataContext } from "../Context/DataContext";
import { Phone, Email, LocationOn, Cake, Person, Interests, Favorite } from "@mui/icons-material";
import axios from "axios";

function stringAvatar(name) {
  return {
    children: name ? name[0].toUpperCase() : "?",
  };
}

export default function Profil() {
  const { user, userProfils, favoris } = useContext(UserContext);
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

  const getInstitutionName = (institutionUrl) => {
    if (!institutionUrl || !institutions?.member) return "Institution non trouvée";
    const institution = institutions.member.find(inst => inst['@id'] === institutionUrl);
    return institution?.name || "Institution non trouvée";
  };

  useEffect(() => {
    if (favoris?.member) {
      setLoading(false);
    }
  }, [favoris]);

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

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = () => {
    console.log("Données sauvegardées :", formData);
  };

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
      {/* Section Profil */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box sx={{ maxWidth: "600px", mx: "auto" }}>
          <Box sx={{ position: "relative", mb: 4, display: "flex", justifyContent: "center" }}>
            <Avatar
              {...stringAvatar(formData.email)}
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
                bottom: 0,
                right: "calc(50% - 110px)",
                bgcolor: "#fff",
                boxShadow: 1,
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
              size="small"
              component="label"
            >
              <CameraAltIcon fontSize="small" />
              <input hidden accept="image/*" type="file" />
            </IconButton>
          </Box>

          <Typography variant="h5" fontWeight={500} mb={4} color="text.primary" textAlign="center">
            Mon Profil
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Nom"
              value={formData.nom}
              onChange={handleChange("nom")}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Prénom"
              value={formData.prenom}
              onChange={handleChange("prenom")}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={handleChange("email")}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Téléphone"
              value={formData.telephone}
              onChange={handleChange("telephone")}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="serie-label">Série</InputLabel>
              <Select
                labelId="serie-label"
                label="Série"
                value={["A1", "A2", "C", "D"].includes(formData.serie) ? formData.serie : ""}
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
              InputProps={{
                startAdornment: <Cake sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Adresse"
              value={formData.adresse}
              onChange={handleChange("adresse")}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Hobbies"
              value={formData.hobbies}
              onChange={handleChange("hobbies")}
              InputProps={{
                startAdornment: <Interests sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
              fullWidth
            />
            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                size="large"
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 1,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Enregistrer
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Section Favoris */}
      <Box
        sx={{
          width: "300px",
          overflowY: "auto",
          borderLeft: "1px solid #eee",
          pl: 4,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            
            background: "#ddd",
            borderRadius: "3px",
          },
        }}
      >
        <Typography variant="h6" fontWeight={500} mb={3} color="text.primary">
          Vos favoris
        </Typography>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} />
          </Box>
        ) : favoris?.member?.length > 0 ? (
          (() => {
            // Grouper les favoris par collection_name
            const grouped = {};
            favoris.member.forEach(fav => {
              if (!grouped[fav.collection_name]) grouped[fav.collection_name] = [];
              grouped[fav.collection_name].push(fav);
            });
            // Afficher chaque groupe
            return Object.entries(grouped).map(([collection, favs], idx) => (
              <Card key={idx} sx={{ bgcolor: '#fafafa', mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Favorite sx={{ color: '#ff4081', mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {collection}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={1}>
                    {favs.map((fav, i) => (
                      <Typography key={i} variant="body2" color="text.secondary">
                        {getInstitutionName(fav.institution)}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ));
          })()
        ) : (
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              bgcolor: "#fafafa",
              color: "text.secondary",
              fontStyle: "italic",
            }}
          >
            Aucun favori pour le moment.
          </Box>
        )}
      </Box>
    </Box>
  );
}