import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../Context/DataContext';
import { UserContext } from '../Context/UserContext';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, Skeleton, Chip, Pagination, FormControl, InputLabel, Select, MenuItem, InputBase, alpha, Switch, FormControlLabel, Tooltip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import log from '../assets/log.png';
import PageTitle from '../components/PageTitle';
import { motion } from 'framer-motion';

const defaultImage = log;

const Formation = () => {
  const { courses, domaines, loading } = useContext(DataContext);
  const { userProfils } = useContext(UserContext);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [compatibilityFilterOn, setCompatibilityFilterOn] = useState(false);
  const itemsPerPage = 8;
  
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Grouper les formations par titre pour éviter les doublons
  const uniqueCoursesByName = (courses || []).reduce((acc, course) => {
    if (course.title) {
      const title = course.title.trim();
      if (!acc[title]) {
        acc[title] = course;
      }
    }
    return acc;
  }, {});

  const uniqueCourses = Object.values(uniqueCoursesByName);

  // Logique de compatibilité améliorée
  const isCompatible = (userSerie, prerequisites) => {
    if (!userSerie || !prerequisites) return false;
    
    const prereqLower = prerequisites.toLowerCase();
    // "Toutes séries" est compatible avec toutes les séries
    if (prereqLower.includes('toutes séries')) return true;

    const userSerieUpper = userSerie.toUpperCase();

    const scientificSeries = ['C', 'D', 'S'];
    const literarySeries = ['A1', 'A2', 'L'];
    const technicalSeries = ['OSE', 'TECH', 'TI'];

    // Vérifie si le prérequis demande une catégorie (scientifique, littéraire)
    if (prereqLower.includes('scientifique')) {
      return scientificSeries.includes(userSerieUpper);
    }
    if (prereqLower.includes('littéraire')) {
      return literarySeries.includes(userSerieUpper);
    }
    if (prereqLower.includes('technique')) {
        return technicalSeries.includes(userSerieUpper);
    }

    // Vérifie la série exacte (ex: 'a1', 'c') et la lettre de la série (ex: 'a')
    const userSerieLower = userSerie.toLowerCase();
    const userSerieLetter = userSerie.charAt(0).toLowerCase();
    
    const userMatches = [userSerieLower];
    if (userSerieLower !== userSerieLetter) {
        userMatches.push(userSerieLetter);
    }
    return userMatches.some(match => prereqLower.includes(match));
  };

  const serieNameMapping = {
    'A1': 'Littéraire', 'A2': 'Littéraire', 'L': 'Littéraire',
    'C': 'Scientifique', 'D': 'Scientifique', 'S': 'Scientifique',
    'OSE': 'Technique', 'TECH': 'Technique', 'TI': 'Technique'
  };
  const userSerieName = userProfils?.serie ? serieNameMapping[userProfils.serie.toUpperCase()] || 'Générale' : '';

  // Filtrer par recherche
  const searchedCourses = searchQuery
    ? uniqueCourses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : uniqueCourses;
  
  // Filtrer par domaine
  const domainFilteredCourses = selectedDomain
    ? searchedCourses.filter(course => {
        const domainId = course.domaine ? String(course.domaine).split('/').pop() : null;
        return String(domainId) === String(selectedDomain);
    })
    : searchedCourses;

  // Filtrer par compatibilité
  const filteredCourses = compatibilityFilterOn && userProfils?.serie
    ? domainFilteredCourses.filter(course => isCompatible(userProfils.serie, course.prerequisites))
    : domainFilteredCourses;

  // Logique de pagination
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleCompatibilityToggle = () => {
    const newCompatibilityState = !compatibilityFilterOn;
    setCompatibilityFilterOn(newCompatibilityState);
    setCurrentPage(1);
    
    // Réinitialiser les autres filtres quand le filtre de compatibilité est activé
    if (newCompatibilityState) {
      setSelectedDomain('');
      setSearchQuery('');
    }
  };

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isPageLoading) {
    return (
      <Box sx={{ width: '100%', minHeight: '100vh', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f7fafd' }}>
        <Skeleton variant="text" width={320} height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={900} height={60} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={1000} height={420} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!uniqueCourses || uniqueCourses.length === 0) {
    return <Typography align="center" sx={{ mt: 4 }}>Aucune formation disponible.</Typography>;
  }

  return (
    <Box sx={{ p: 4, background: '#f8f9fa', minHeight: '100vh' }}>
      <PageTitle 
        title="Formations à Madagascar"
        subtitle="Découvrez toutes les formations disponibles dans les universités et établissements d'enseignement supérieur de Madagascar."
        icon={WorkIcon}
        color="linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Box sx={{ 
              position: 'relative',
              borderRadius: 1,
              backgroundColor: alpha('#000', 0.05),
              '&:hover': {
                backgroundColor: alpha('#000', 0.08),
              },
              width: '100%',
              ...(compatibilityFilterOn && {
                opacity: 0.6,
                pointerEvents: 'none',
              }),
            }}>
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
                placeholder="Rechercher…"
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={compatibilityFilterOn}
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
          </Box>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <FormControl 
              fullWidth 
              variant="outlined"
              sx={{
                borderRadius: 1,
                backgroundColor: alpha('#000', 0.05),
                '&:hover': {
                  backgroundColor: alpha('#000', 0.08),
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                ...(compatibilityFilterOn && {
                  opacity: 0.6,
                  pointerEvents: 'none',
                }),
              }}
            >
              <InputLabel id="domain-filter-label">Filtrer par domaine</InputLabel>
              <Select
                labelId="domain-filter-label"
                value={selectedDomain}
                label="Filtrer par domaine"
                onChange={handleDomainChange}
                disabled={compatibilityFilterOn}
              >
                <MenuItem value="">
                  <em>Tous les domaines</em>
                </MenuItem>
                {domaines && domaines.map((domain) => (
                  <MenuItem key={domain.id} value={domain.id}>{domain.domaine}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {userProfils && (
            <Tooltip title={!userProfils.serie ? "Renseignez votre série dans votre profil pour utiliser ce filtre." : ""}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: 56, pl: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={compatibilityFilterOn}
                      onChange={handleCompatibilityToggle}
                      disabled={!userProfils.serie}
                    />
                  }
                  label="Mes formations compatibles"
                  sx={{
                    color: alpha('#000', 0.8)
                  }}
                />
              </Box>
            </Tooltip>
          )}
        </Box>
      </motion.div>

      {compatibilityFilterOn && userProfils?.serie && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Box sx={{ mb: 4, p: 2, backgroundColor: alpha('#667eea', 0.1), borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} color="#5a67d8">
              Vous êtes de la série {userProfils.serie} ({userSerieName}), voici les formations qui vous sont directement accessibles :
            </Typography>
          </Box>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Grid container spacing={1} justifyContent="center">
          {paginatedCourses.map((course) => (
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card 
                sx={{ 
                  width: 270,
                  display: 'flex', 
                  flexDirection: 'column',
                  background: 'white',
                  borderRadius: 2,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
                  {/* Titre de la formation */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <SchoolIcon sx={{ color: '#667eea', fontSize: 24, mt: 0.5, flexShrink: 0 }} />
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      sx={{ 
                        color: '#2d3748',
                        lineHeight: 1.3,
                        fontSize: '1.2rem',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}
                    >
                      {course.title}
                    </Typography>
                  </Box>

                  {/* Débouchés */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 2 }}>
                    <WorkIcon sx={{ color: '#764ba2', fontSize: 18, mt: 0.5, flexShrink: 0}} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#4a5568',
                          fontWeight: 600,
                          mb: 1,
                          fontSize: '0.9rem'
                        }}
                      >
                        Débouchés :
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#718096',
                          lineHeight: 1.5,
                          fontSize: '0.85rem',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto',
                          textAlign: 'justify'
                        }}
                      >
                        {course.career_prospects || 'Débouchés non spécifiés'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>
      
      {filteredCourses.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, py: 2 }}>
          <Pagination 
            count={Math.ceil(filteredCourses.length / itemsPerPage)}
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
                backgroundColor: '#667eea !important',
                color: 'white',
              },
              '& .MuiPaginationItem-ellipsis': {
                color: '#4a5568'
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Formation;
