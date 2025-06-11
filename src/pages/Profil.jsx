import React, { useContext, useState, useEffect } from "react";
import Skeleton from '@mui/material/Skeleton';
import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { UserContext } from "../Context/UserContext";
import { Phone, Email, LocationOn, Cake, Person, Interests } from "@mui/icons-material";

function stringAvatar(name) {
  return {
    children: name ? name[0].toUpperCase() : "?",
  };
}

export default function Profil() {
  const { user, userProfils } = useContext(UserContext);
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

  // Affichage pendant chargement ou si données non dispo
  if (!user || !userProfils) {
    return (
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f6fa",
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
    // Appel API ou mise à jour ici
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6fa",
      }}
    >
      <Stack direction="row" spacing={2} width="100%" maxWidth="1200px">
        {/* Formulaire Profil */}
        <Paper elevation={0} sx={{ p: 2, flex: 1, background: "#f5f6fa" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ position: "relative", mb: 1 }}>
              <Avatar
                {...stringAvatar(formData.email)}
                sx={{ width: 120, height: 120, background: "rgb(214, 182, 202)", fontSize: 36 }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "#fff",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "#e3e3e3" },
                }}
                size="small"
                aria-label="Changer la photo de profil"
                component="label"
              >
                <CameraAltIcon fontSize="small" />
                <input hidden accept="image/*" type="file" />
              </IconButton>
            </Box>

            <Stack spacing={1.2} width="90%">
              <TextField
                label="Nom"
                value={formData.nom}
                placeholder="Votre nom"
                onChange={handleChange("nom")}
                InputProps={{ startAdornment: <Person sx={{ mr: 1 }} /> }}
                fullWidth
              />
              <TextField
                label="Prénom"
                value={formData.prenom}
                onChange={handleChange("prenom")}
                InputProps={{ startAdornment: <Person sx={{ mr: 1 }} /> }}
                fullWidth
              />
              <TextField
                label="Email"
                value={formData.email}
                onChange={handleChange("email")}
                InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
                fullWidth
              />
              <TextField
                label="Téléphone"
                value={formData.telephone}
                onChange={handleChange("telephone")}
                InputProps={{ startAdornment: <Phone sx={{ mr: 1 }} /> }}
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
                InputProps={{ startAdornment: <Cake sx={{ mr: 1 }} /> }}
                fullWidth
              />
              <TextField
                label="Adresse"
                value={formData.adresse}
                onChange={handleChange("adresse")}
                InputProps={{ startAdornment: <LocationOn sx={{ mr: 1 }} /> }}
                fullWidth
              />
              <TextField
                label="Hobbies"
                value={formData.hobbies}
                onChange={handleChange("hobbies")}
                InputProps={{ startAdornment: <Interests sx={{ mr: 1 }} /> }}
                fullWidth
              />
              <Box textAlign="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{
                    background: "linear-gradient(90deg, #4F8DFD 0%, #38C6D9 100%)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)",
                    },
                  }}
                >
                  Enregistrer
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Colonne de droite pour autres infos (favoris, stats, etc.) */}
        <Box flex={1}>
          <Typography variant="h6" gutterBottom>
            Vos favoris et autres informations
          </Typography>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
            
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
