import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../Context/DataContext';
import { UserContext } from '../../Context/UserContext';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Skeleton, 
  Chip, 
  Pagination, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  InputBase, 
  alpha, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import log from '../../assets/log.png';
import PageTitle from '../../components/PageTitle';
import { motion } from 'framer-motion';
import axios from 'axios';

const defaultImage = log;

const FormationAdmin = () => {
  const { courses, domaines, loading, refreshCourses } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const itemsPerPage = 6;

  // Vérification et sécurisation des données
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeDomaines = Array.isArray(domaines) ? domaines : [];

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    career_prospects: '',
    prerequisites: '',
    domaine: '',
    university: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Grouper les formations par titre pour éviter les doublons
  const uniqueCoursesByName = (safeCourses || []).reduce((acc, course) => {
    if (course && course.title) {
      const title = course.title.trim();
      if (!acc[title]) {
        acc[title] = course;
      }
    }
    return acc;
  }, {});

  const uniqueCourses = Object.values(uniqueCoursesByName);

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

  const paginatedCourses = domainFilteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion du formulaire
  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title || '',
        career_prospects: course.career_prospects || '',
        prerequisites: course.prerequisites || '',
        domaine: course.domaine ? String(course.domaine).split('/').pop() : '',
        university: course.university || ''
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        career_prospects: '',
        prerequisites: '',
        domaine: '',
        university: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      title: '',
      career_prospects: '',
      prerequisites: '',
      domaine: '',
      university: ''
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const courseData = {
        title: formData.title,
        career_prospects: formData.career_prospects,
        prerequisites: formData.prerequisites,
        domaine: formData.domaine ? `/api/domaines/${formData.domaine}` : null,
        university: formData.university
      };

      if (editingCourse) {
        // Mise à jour
        await axios.put(`/api/courses/${editingCourse.id}`, courseData, {
          headers: {
            'Content-Type': 'application/ld+json'
          }
        });
        setSnackbar({ open: true, message: 'Formation mise à jour avec succès', severity: 'success' });
      } else {
        // Création
        await axios.post('/api/courses', courseData, {
          headers: {
            'Content-Type': 'application/ld+json'
          }
        });
        setSnackbar({ open: true, message: 'Formation créée avec succès', severity: 'success' });
      }

      handleCloseDialog();
      refreshCourses(); // Rafraîchir les données
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la sauvegarde', severity: 'error' });
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        setSnackbar({ open: true, message: 'Formation supprimée avec succès', severity: 'success' });
        refreshCourses(); // Rafraîchir les données
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
      }
    }
  };

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

  return (
    <Box sx={{ p: 4, background: '#f8f9fa', minHeight: '100vh' }}>
      <PageTitle 
        title="Administration des Formations"
        subtitle="Gérez toutes les formations proposées par les universités malgaches. Ajoutez, modifiez ou supprimez des formations."
        icon={SchoolIcon}
        color="#667eea"
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
              }}
            >
              <InputLabel id="domain-filter-label">Filtrer par domaine</InputLabel>
              <Select
                labelId="domain-filter-label"
                value={selectedDomain}
                label="Filtrer par domaine"
                onChange={handleDomainChange}
              >
                <MenuItem value="">
                  <em>Tous les domaines</em>
                </MenuItem>
                {safeDomaines && safeDomaines.map((domain) => (
                  <MenuItem key={domain.id} value={domain.id}>{domain.domaine}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#667eea',
              '&:hover': {
                backgroundColor: '#5a67d8',
              },
              height: 56,
              px: 3
            }}
          >
            Ajouter
          </Button>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Grid container spacing={3}>
          {paginatedCourses.map((course) => (
            <Grid item key={course.id} sx={{ display: 'flex' }}>
              <Card 
                sx={{ 
                  width: 355,
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
                  {/* En-tête avec actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flex: 1 }}>
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
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Modifier">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(course)}
                          sx={{ color: '#667eea' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(course.id)}
                          sx={{ color: '#e53e3e' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Débouchés */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 2 }}>
                    <WorkIcon sx={{ color: '#764ba2', fontSize: 18, mt: 0.5, flexShrink: 0 }} />
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

                  {/* Prérequis */}
                  {course.prerequisites && (
                    <Box sx={{ mt: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#4a5568',
                          fontWeight: 600,
                          mb: 0.5,
                          fontSize: '0.85rem'
                        }}
                      >
                        Prérequis :
                      </Typography>
                      <Chip 
                        label={course.prerequisites} 
                        size="small" 
                        sx={{ 
                          backgroundColor: alpha('#667eea', 0.1),
                          color: '#667eea',
                          fontSize: '0.75rem'
                        }} 
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>
      
      {domainFilteredCourses.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, py: 2 }}>
          <Pagination 
            count={Math.ceil(domainFilteredCourses.length / itemsPerPage)}
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

      {/* Dialog pour ajouter/modifier */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Modifier la formation' : 'Ajouter une nouvelle formation'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Titre de la formation"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Débouchés"
              value={formData.career_prospects}
              onChange={(e) => handleFormChange('career_prospects', e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Prérequis"
              value={formData.prerequisites}
              onChange={(e) => handleFormChange('prerequisites', e.target.value)}
              fullWidth
              placeholder="Ex: Série C, D ou toutes séries"
            />
            <FormControl fullWidth>
              <InputLabel>Domaine</InputLabel>
              <Select
                value={formData.domaine}
                label="Domaine"
                onChange={(e) => handleFormChange('domaine', e.target.value)}
              >
                {safeDomaines && safeDomaines.map((domain) => (
                  <MenuItem key={domain.id} value={domain.id}>{domain.domaine}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Université"
              value={formData.university}
              onChange={(e) => handleFormChange('university', e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.title}>
            {editingCourse ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormationAdmin; 