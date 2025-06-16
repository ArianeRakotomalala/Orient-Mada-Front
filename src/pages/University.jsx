import { useState, useEffect } from "react";
import axios from "axios";
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  InputBase,
  Menu,
  MenuItem,
  Container,
  Select,
  FormControl,
  InputLabel,
  Stack
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';

function University() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedFormation, setSelectedFormation] = useState("");

  const regions = [
    "Antananarivo",
    "Toamasina",
    "Mahajanga",
    "Fianarantsoa",
    "Antsiranana",
    "Toliara"
  ];

  const formations = [
    "Informatique",
    "Médecine",
    "Droit",
    "Commerce",
    "Ingénierie",
    "Agriculture"
  ];

  const handleViewDetails = (id) => {
    navigate(`/home/university/${id}`);
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("/api/institutions");
        const data = response.data.member || [];
        setUniversities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des universités :", error);
        setUniversities([]);
      }
    };
    fetchUniversities();
  }, []);

  const filtered = universities
    .filter((u) =>
      (u.institution_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.localisation || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.region || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) => !selectedRegion || u.region === selectedRegion)
    .filter((u) => !selectedFormation || u.formation === selectedFormation);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight={700}  textAlign="center" mb={4}>
          Les universités de Madagascar
        </Typography>

        <Stack spacing={3} sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                borderRadius: 2,
                px: 2,
                boxShadow: 1,
                minWidth: { xs: '100%', sm: 280 },
                flex: 1,
                height: 48,
                mb: { xs: 1, sm: 0 },
              }}
            >
              <SearchIcon color="action" />
              <InputBase
                placeholder="Rechercher une université..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ ml: 1, flex: 1, fontSize: '1rem' }}
              />
            </Box>
            <FormControl
              sx={{
                minWidth: 180,
                background: 'white',
                borderRadius: 2,
                boxShadow: 1,
                height: 48,
                justifyContent: 'center',
              }}
              size="medium"
            >
              <InputLabel>Région</InputLabel>
              <Select
                value={selectedRegion}
                label="Région"
                onChange={(e) => setSelectedRegion(e.target.value)}
                sx={{ height: 48 }}
              >
                <MenuItem value="">Toutes les régions</MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>{region}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                minWidth: 180,
                background: 'white',
                borderRadius: 2,
                boxShadow: 1,
                height: 48,
                justifyContent: 'center',
              }}
              size="medium"
            >
              <InputLabel>Formation</InputLabel>
              <Select
                value={selectedFormation}
                label="Formation"
                onChange={(e) => setSelectedFormation(e.target.value)}
                sx={{ height: 48 }}
              >
                <MenuItem value="">Toutes les formations</MenuItem>
                {formations.map((formation) => (
                  <MenuItem key={formation} value={formation}>{formation}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          {filtered.map((uni) => (
            <Grid item xs={12} md={4} key={uni.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  width: 340,
                  minHeight: 380,
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
                onClick={() => handleViewDetails(uni.id)}
              >
                <Box
                  sx={{
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f5f5',
                    textAlign: 'justify'
                  }}
                >
                  {uni.photo ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={uni.photo}
                      alt={uni.institution_name}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <SchoolIcon sx={{ fontSize: 80, color: '#1976d2' }} />
                  )}
                </Box>
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 2,
                    minHeight: 140,
                    maxHeight: 200,
                    overflow: 'hidden',
                    textAlign: 'justify',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="h2"
                    fontWeight={700}
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                      wordBreak: 'break-word',
                      width: '100%',
                      mb: 1,
                      lineHeight: 1.2,
                      textAlign: 'left',
                      minHeight: '2.4em',
                      maxHeight: '3.6em',
                      overflow: 'hidden',
                      display: 'block'
                    }}
                    title={uni.institution_name}
                  >
                    {uni.institution_name}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1.5
                  }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" mb={0.5} fontWeight={600}>
                        Type : {(() => {
                          const typeClean = (uni.type || "").trim().toLowerCase();
                          const isPublic = typeClean === "publique" || typeClean === "public";
                          return (
                            <Typography
                              component="span"
                              sx={{
                                color: isPublic ? "#2e7d32" : "#1976d2",
                                fontWeight: 600,
                                ml: 0.5
                              }}
                            >
                              {uni.type}
                            </Typography>
                          );
                        })()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" mb={0.5} fontWeight={600}
                        sx={{
                          wordBreak: 'break-word',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          textAlign: 'justify',
                        }}
                        title={uni.region}
                      >
                        <TravelExploreIcon sx={{ fontSize: 18, mr: 0.5, color: '#ed6c02' }} />
                        <span style={{ flex: 1 }}>{uni.region}</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" mb={0.5} fontWeight={600}
                        sx={{
                          wordBreak: 'break-word',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          textAlign: 'justify',
                        }}
                        title={uni.location}
                      >
                        <LocationOnIcon sx={{ fontSize: 18, mr: 0.5, color: '#1976d2' }} />
                        <span style={{ flex: 1 }}>{uni.location}</span>
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default University;