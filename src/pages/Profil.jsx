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
  if (!user ) {
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
    ///////////////////////////////////////////////
    // Appel API ou mise à jour ici////////////////
    ///////////////////////////////////////////////
  };

  return (
    <Box
      sx={{
        
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f5f6fa 100%)",
        py: 4,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        width="100%"
        maxWidth="1100px"
        sx={{ boxShadow: 6, borderRadius: 4, background: "#fff", p: { xs: 2, md: 4 } }}
      >
        {/* Formulaire Profil */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            flex: 1,
            background: "transparent",
            boxShadow: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ position: "relative", mb: 2 }}>
            <Avatar
              {...stringAvatar(formData.email)}
              sx={{
                width: 130,
                height: 130,
                background: "linear-gradient(135deg, #b993d6 0%, #8ca6db 100%)",
                fontSize: 48,
                boxShadow: 4,
                border: "4px solid #fff",
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                bgcolor: "#fff",
                boxShadow: 2,
                border: "2px solid #e0e7ff",
                "&:hover": { bgcolor: "#e0e7ff" },
                zIndex: 1,
              }}
              size="medium"
              aria-label="Changer la photo de profil"
              component="label"
            >
              <CameraAltIcon fontSize="medium" />
              <input hidden accept="image/*" type="file" />
            </IconButton>
          </Box>

          <Typography variant="h5" fontWeight={700} mb={2} color="primary">
            Mon Profil
          </Typography>

          <Stack spacing={2} width="100%" maxWidth="400px">
            <TextField
              label="Nom"
              value={formData.nom}
              placeholder="Votre nom"
              onChange={handleChange("nom")}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: "primary.main" }} />,
              }}
              variant="outlined"
              fullWidth
              sx={{ bgcolor: "#f3f6fd", borderRadius: 2 }}
            />
            <TextField
              label="Prénom"
              value={formData.prenom}
              onChange={handleChange("prenom")}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: "primary.main" }} />,
              }}
              variant="outlined"
              fullWidth
              sx={{ bgcolor: "#f3f6fd", borderRadius: 2 }}
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={handleChange("email")}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: "primary.main" }} />,
              }}
              variant="outlined"
              fullWidth
              sx={{ bgcolor: "#f3f6fd", borderRadius: 2 }}
            />
            <TextField
              label="Téléphone"
              value={formData.telephone}
              onChange={handleChange("telephone")}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: "primary.main" }} />,
              }}
              variant="outlined"
              fullWidth
              sx={{ bgcolor: "#f3f6fd", borderRadius: 2 }}
            />
            <FormControl fullWidth sx={{ bgcolor: "#f3f6fd", borderRadius: 2 }}>
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
                startAdornment: <Cake sx={{ mr: 1, color: "primary.main" }} />,
              }}
              variant="outlined"
              fullWidth
              sx={{ bgcolor: "#f3f6fd", borderRadius: 2 }}
            />
            <TextField
              label="Adresse"
              value={formData.adresse}
              onChange={handleChange("adresse")}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: "primary.main" }} />,
              }}
              variant="outlined"
              fullWidth
              sx={{ bgcolor: "#f3f6fd", borderRadius: 2 }}
            />
            <TextField
              label="Hobbies"
              value={formData.hobbies}
              onChange={handleChange("hobbies")}
              InputProps={{
                startAdornment: <Interests sx={{ mr: 1, color: "primary.main" }} />,
              }}
              variant="outlined"
              fullWidth
              sx={{ bgcolor: "#f3f6fd", borderRadius: 2 }}
            />
            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "linear-gradient(90deg, #4F8DFD 0%, #38C6D9 100%)",
                  boxShadow: 3,
                  "&:hover": {
                    background: "linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)",
                    boxShadow: 6,
                  },
                }}
              >
                Enregistrer
              </Button>
            </Box>
          </Stack>
        </Paper>

        {/* Colonne de droite pour autres infos (favoris, stats, etc.) */}
        <Paper
          sx={{
            flex: 1,
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            bgcolor: "#f3f6fd",
            boxShadow: 3,
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom color="primary">
            Vos favoris et autres informations
          </Typography>
          {/* Ajoute ici tes composants favoris, stats, etc. */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 3,
              bgcolor: "#fff",
              boxShadow: 1,
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b0b0b0",
              fontStyle: "italic",
            }}
          >
            Aucune information à afficher pour le moment.
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}
