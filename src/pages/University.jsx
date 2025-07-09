import { useState, useEffect, useContext } from "react";
import { DataContext } from "../context/DataContext";
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import WorkIcon from '@mui/icons-material/Work';
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
  Stack,
  alpha
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Rating from '@mui/material/Rating';
import useDebounce from '../useDebounce';
import PageTitle from '../components/PageTitle';
import { motion } from 'framer-motion';
import Pagination from '@mui/material/Pagination';

function University() {
  const navigate = useNavigate();
  const { institutions, courses, loading } = useContext(DataContext);

  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedFormation, setSelectedFormation] = useState("");
  const [selectedCost, setSelectedCost] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Debounced values
  const debouncedSearch = useDebounce(search, 400);
  const debouncedRegion = useDebounce(selectedRegion, 400);
  const debouncedFormation = useDebounce(selectedFormation, 400);
  const debouncedCost = useDebounce(selectedCost, 400);

  // Debug logs
  console.log("Institutions:", institutions);
  console.log("Courses:", courses);

  const regions = [
    "Antananarivo",
    "Toamasina",
    "Mahajanga",
    "Fianarantsoa",
    "Antsiranana",
    "Toliara"
  ];

  // Générer dynamiquement la liste des formations à partir de courses, en évitant les doublons et en regroupant les formations similaires
  const getRoot = (name) => {
    if (!name) return '';
    return name;
  };
  const formationRoots = Array.from(
    new Set(
      (courses || [])
        .map((c) => getRoot(c.title))
        .filter(Boolean)
    )
  );
  // Regrouper les intitulés originaux par racine pour affichage dans le MenuItem
  const formationGroups = {};
  (courses || []).forEach((c) => {
    const original = c.title;
    const root = getRoot(original);
    if (!formationGroups[root]) formationGroups[root] = new Set();
    formationGroups[root].add(original);
  });
  const formations = formationRoots.map((root) => ({
    root: root.charAt(0).toUpperCase() + root.slice(1),
    originals: Array.from(formationGroups[root] || [])
  }));

  const handleViewDetails = (id) => {
    navigate(`/home/university/${id}`);
  };

  const universities = Array.isArray(institutions.member) ? institutions.member : (Array.isArray(institutions) ? institutions : []);

  // DEBUG : Afficher pour chaque université la liste des formations trouvées
  universities.forEach(u => {
    const universityCourses = courses.filter(course => {
      if (!course.institutions) return false;
      const institutionId = course.institutions.split('/').pop();
      return String(institutionId) === String(u.id);
    });
    console.log(`Université: ${u.institution_name} (id: ${u.id}) - Formations:`, universityCourses.map(c => c.title));
  });

  const filtered = universities
    .filter((u) =>
      (u.institution_name || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (u.location || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (u.region || "").toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .filter((u) => !debouncedRegion || (u.region || '').toLowerCase() === debouncedRegion.toLowerCase())
    .filter((u) => {
      if (!debouncedFormation) return true;
      const universityCourses = courses.filter(course => {
        if (!course.institutions) return false;
        const institutionId = course.institutions.split('/').pop();
        return String(institutionId) === String(u.id);
      });
      const hasFormation = universityCourses.some(course =>
        course.title && course.title.trim().toLowerCase() === debouncedFormation.trim().toLowerCase()
      );
      if (hasFormation) {
        console.log(`Université ${u.institution_name} a la formation ${debouncedFormation}`);
      }
      return hasFormation;
    })
    .filter((u) => {
      if (!debouncedCost) return true;
      const universityCourses = courses.filter(course => {
        if (!course.institutions) return false;
        const institutionId = course.institutions.split('/').pop();
        return String(institutionId) === String(u.id);
      });
      const hasMatchingCost = universityCourses.some(course => {
        if (!course.fees) return false;
        const feesClean = course.fees.replace(/[^0-9\-]/g, '').replace(/--+/g, '-');
        const feesRange = feesClean.split('-');
        let maxFee = 0;
        if (feesRange.length === 2) {
          maxFee = parseInt(feesRange[1], 10);
        } else if (feesRange.length === 1) {
          maxFee = parseInt(feesRange[0], 10);
        }
        if (isNaN(maxFee)) return false;
        switch (debouncedCost) {
          case "free":
            return maxFee === 0;
          case "between_500k_1m":
            return maxFee >= 500000 && maxFee <= 1000000;
          case "less_than_1m":
            return maxFee < 1000000;
          case "between_1m_2m":
            return maxFee >= 1000000 && maxFee <= 2000000;
          case "more_than_2m":
            return maxFee > 2000000;
          default:
            return true;
        }
      });
      if (hasMatchingCost) {
        console.log(`Université ${u.institution_name} a un cours avec le coût sélectionné`);
      }
      return hasMatchingCost;
    });

  // Debug log
  console.log("Filtered universities:", filtered);

  // Reset page to 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedRegion, debouncedFormation, debouncedCost]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedUniversities = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <PageTitle 
          title="Les universités à Madagascar"
          subtitle="Explorez toutes les universités et établissements d'enseignement supérieur de Madagascar. Trouvez l'institution qui correspond le mieux à vos aspirations académiques et professionnelles."
          icon={WorkIcon}
          color="linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
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
                  position: 'relative',
                  borderRadius: 1,
                  backgroundColor: alpha('#000', 0.05),
                  '&:hover': {
                    backgroundColor: alpha('#000', 0.08),
                  },
                  flex: 1,
                  minWidth: { xs: '100%', sm: 280 },
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  mb: { xs: 1, sm: 0 },
                }}
              >
                <Box sx={{
                  padding: '0 12px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <SearchIcon color="action" />
                </Box>
                <InputBase
                  placeholder="Rechercher une université..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    color: 'inherit',
                    width: '100%',
                    '& .MuiInputBase-input': {
                      padding: '16.5px 14px 16.5px 40px',
                      width: '100%',
                    },
                  }}
                />
              </Box>
              <FormControl
                sx={{
                  flex: 1,
                  minWidth: 180,
                  borderRadius: 1,
                  backgroundColor: alpha('#000', 0.05),
                  '&:hover': {
                    backgroundColor: alpha('#000', 0.08),
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
                size="medium"
              >
                <InputLabel>Région</InputLabel>
                <Select
                  value={selectedRegion}
                  label="Région"
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <MenuItem value="">Toutes les régions</MenuItem>
                  {regions.map((region) => (
                    <MenuItem key={region} value={region}>{region}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                sx={{
                  flex: 1,
                  minWidth: 180,
                  borderRadius: 1,
                  backgroundColor: alpha('#000', 0.05),
                  '&:hover': {
                    backgroundColor: alpha('#000', 0.08),
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
                size="medium"
              >
                <InputLabel>Formation</InputLabel>
                <Select
                  value={selectedFormation}
                  label="Formation"
                  onChange={(e) => setSelectedFormation(e.target.value)}
                >
                  <MenuItem value="">Toutes les formations</MenuItem>
                  {formations.map((f, index) => (
                    <MenuItem key={index} value={f.originals[0]}>
                      {f.root}
                      {f.originals.length > 1 && (
                        <span style={{ color: '#888', fontSize: '0.95em', marginLeft: 6 }}>
                          ({f.originals.join(', ')})
                        </span>
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                sx={{
                  flex: 1,
                  minWidth: 180,
                  borderRadius: 1,
                  backgroundColor: alpha('#000', 0.05),
                  '&:hover': {
                    backgroundColor: alpha('#000', 0.08),
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
                size="medium"
              >
                <InputLabel>Coût</InputLabel>
                <Select
                  value={selectedCost}
                  label="Coût"
                  onChange={(e) => setSelectedCost(e.target.value)}
                >
                  <MenuItem value="">Tous les coûts</MenuItem>
                  <MenuItem value="free">Gratuit (0 Ar/an)</MenuItem>
                  <MenuItem value="between_500k_1m">Entre 500 000 Ar et 1 000 000 Ar/an</MenuItem>
                  <MenuItem value="less_than_1m">Moins de 1 000 000 Ar/an</MenuItem>
                  <MenuItem value="between_1m_2m">Entre 1 000 000 Ar et 2 000 000 Ar/an</MenuItem>
                  <MenuItem value="more_than_2m">Plus de 2 000 000 Ar/an</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </motion.div>

        {loading || universities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Grid container spacing={1} justifyContent="center">
              {[...Array(6)].map((_, idx) => (
                <Grid item xs={12} md={4} key={idx} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card sx={{ width: 275, minHeight: 380, display: 'flex', flexDirection: 'column' }}>
                    <Skeleton variant="rectangular" height={140} />
                    <CardContent>
                      <Skeleton variant="text" width="80%" height={32} />
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={24} />
                      <Skeleton variant="text" width="50%" height={24} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <>
              <Box sx={{ mb: 2 }}>
                {filtered.length === 0 ? (
                  <Typography variant="subtitle1" align="center">
                    Aucun résultat trouvé.
                  </Typography>
                ) : (
                  <Typography variant="subtitle1" align="center">
                    {filtered.length} résultat{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
                  </Typography>
                )}
              </Box>
              {filtered.length === 0 ? null : (
                <>
                  <Grid container spacing={1} justifyContent="center">
                    {paginatedUniversities.map((uni) => (
                      <Grid  key={uni.id} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
                        <Card
                          sx={{
                            width: 275,
                            minHeight: 320,
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 6
                            },
                            borderRadius:2
                          }}
                          onClick={() => handleViewDetails(uni.id)}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: '#f5f5f5',
                              p: 1,
                              m: 0,
                              width: '100%',
                            }}
                          >
                            {uni.logo ? (
                              <CardMedia
                                component="img"
                                sx={{ objectFit: 'contain', width: '100%', maxHeight: 170 }}
                                image={uni.logo}
                                alt={uni.institution_name}
                              />
                            ) : uni.photo ? (
                              <CardMedia
                                component="img"
                                sx={{ objectFit: 'contain', width: '100%', maxHeight: 150 }}
                                image={uni.photo}
                                alt={uni.institution_name}
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
                              gap: 1,
                              p: 1,
                              minHeight: 100,
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
                                display: 'block',
                              
                              }}
                              title={uni.institution_name}
                            >
                              {uni.institution_name}
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              gap: 1.5,
                              flexGrow: 1,
                              justifyContent: 'space-between',
                            }}>
                              <Box>
                                <Typography variant="subtitle2" mb={0.5} fontWeight={600}>
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
                                <Typography variant="subtitle2" mb={0.5} fontWeight={600}
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
                                <Typography variant="subtitle2" mb={0.5} fontWeight={600}
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
                              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center', minHeight: 32 }}>
                                <Rating 
                                  name={`rating-${uni.id}`}
                                  value={2.5 + (parseInt(uni.id, 10) % 25) / 10}
                                  precision={0.5} 
                                  readOnly 
                                  size="small" 
                                />
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, py: 2 }}>
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
                            color: '#4a5568',
                            fontWeight: 600
                          },
                          '& .Mui-selected': {
                            backgroundColor: '#1976d2 !important',
                            color: 'white',
                          },
                          '& .MuiPaginationItem-ellipsis': {
                            color: '#4a5568'
                          }
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}

export default University;