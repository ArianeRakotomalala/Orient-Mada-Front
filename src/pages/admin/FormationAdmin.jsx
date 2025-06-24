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
  const { courses, domaines, institutions, loading, refreshCourses } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, courseId: null });
  const itemsPerPage = 6;
  const [selectedInstitution, setSelectedInstitution] = useState('');

  // Vérification et sécurisation des données
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeDomaines = Array.isArray(domaines) ? domaines : [];
  const safeInstitutions = Array.isArray(institutions) ? institutions : [];

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    career_prospects: '',
    prerequisites: '',
    domaine: '',
    university: '',
    degree: '',
    languages: '',
    fees: '',
    duration: '',
    admission_process: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 1. Filtrer par recherche et domaine et université
  const filteredCourses = safeCourses.filter(course =>
    (!searchQuery || course.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!selectedDomain || (course.domaine ? String(course.domaine).split('/').pop() : null) === String(selectedDomain)) &&
    (!selectedInstitution || (
      (() => {
        let univId = '';
        if (typeof course.institutions === 'object' && course.institutions !== null && course.institutions.id) {
          univId = course.institutions.id;
        } else if (typeof course.institutions === 'string' && course.institutions.includes('/')) {
          univId = course.institutions.split('/').pop();
        } else if (typeof course.institutions === 'string') {
          univId = course.institutions;
        }
        return String(univId) === String(selectedInstitution);
      })()
    ))
  );

  // 2. Regrouper par titre pour l'affichage
  const coursesByTitle = filteredCourses.reduce((acc, course) => {
    if (!acc[course.title]) acc[course.title] = [];
    acc[course.title].push(course);
    return acc;
  }, {});

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

  const paginatedCourses = coursesByTitle[Object.keys(coursesByTitle)[0]] || [];

  // Pagination par groupe de titres
  const titleKeys = Object.keys(coursesByTitle);
  const totalPages = Math.ceil(titleKeys.length / itemsPerPage);
  const paginatedTitleKeys = titleKeys.slice(
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
        university: (() => {
          if (typeof course.institutions === 'object' && course.institutions !== null && course.institutions.id) {
            return course.institutions.id;
          } else if (typeof course.institutions === 'string' && course.institutions.includes('/')) {
            return course.institutions.split('/').pop();
          } else if (typeof course.institutions === 'string') {
            return course.institutions;
          }
          return '';
        })(),
        degree: course.degree || '',
        languages: course.languages || '',
        fees: course.fees || '',
        duration: course.duration || '',
        admission_process: course.admission_process || ''
      });
      setOpenDialog(true);
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        career_prospects: '',
        prerequisites: '',
        domaine: '',
        university: '',
        degree: '',
        languages: '',
        fees: '',
        duration: '',
        admission_process: ''
      });
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      title: '',
      career_prospects: '',
      prerequisites: '',
      domaine: '',
      university: '',
      degree: '',
      languages: '',
      fees: '',
      duration: '',
      admission_process: ''
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
        institutions: formData.university ? `/api/institutions/${formData.university}` : null,
        degree: formData.degree,
        languages: formData.languages,
        fees: formData.fees,
        duration: formData.duration,
        admission_process: formData.admission_process
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
    setConfirmDelete({ open: true, courseId });
  };

  const handleConfirmDelete = async () => {
    const courseId = confirmDelete.courseId;
    if (!courseId) return;
    try {
      await axios.delete(`/api/courses/${courseId}`);
      setSnackbar({ open: true, message: 'Formation supprimée avec succès', severity: 'success' });
      refreshCourses();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
    } finally {
      setConfirmDelete({ open: false, courseId: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, courseId: null });
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
        subtitle="Gérez toutes les formations proposées par les universités et établissements. Ajoutez, modifiez ou supprimez des formations."
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
              <InputLabel id="institution-filter-label">Filtrer par université</InputLabel>
              <Select
                labelId="institution-filter-label"
                value={selectedInstitution}
                label="Filtrer par université"
                onChange={e => {
                  setSelectedInstitution(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="">
                  <em>Toutes les universités</em>
                </MenuItem>
                {safeInstitutions && safeInstitutions.map((inst) => (
                  <MenuItem key={inst.id} value={inst.id}>{inst.institution_name}</MenuItem>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              px: 3,
              py: 1,
              borderRadius: 3,
              textAlign: 'center',
              minWidth: 120,
              background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {titleKeys.length} résultat{titleKeys.length > 1 ? 's' : ''}
          </Typography>
        </Box>
        {paginatedTitleKeys.map((title) => {
          const courses = coursesByTitle[title];
          return (
            <Box key={title} sx={{ mb: 5 }}>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#2d3748', mb: 2 }}>{title}</Typography>
              <Grid container spacing={3}>
                {courses.map((course) => {
                  let univId = '';
                  if (typeof course.institutions === 'object' && course.institutions !== null && course.institutions.id) {
                    univId = course.institutions.id;
                  } else if (typeof course.institutions === 'string' && course.institutions.includes('/')) {
                    univId = course.institutions.split('/').pop();
                  } else if (typeof course.institutions === 'string') {
                    univId = course.institutions;
                  }
                  const inst = safeInstitutions.find(i => String(i.id) === String(univId));
                  const instLogo = inst && inst.logo ? inst.logo : defaultImage;
                  return (
                    <Grid item key={course.id} sx={{ display: 'flex' }}>
                      <Card 
                        sx={{ 
                          width: 355,
                          display: 'flex', 
                          flexDirection: 'column',
                          background: 'white',
                          borderRadius: 4,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                          mb: 2,
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.03)',
                            boxShadow: '0 12px 32px rgba(102,126,234,0.18)',
                          },
                          overflow: 'hidden',
                        }}
                      >
                        {/* Logo université */}
                        <Box sx={{ width: '100%', height: 90, background: '#f3f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #eee' }}>
                          <img src={instLogo} alt="logo université" style={{ maxHeight: 60, maxWidth: 120, objectFit: 'contain', borderRadius: 8 }} />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
                          {/* Titre formation accentué */}
                          <Box sx={{
                            background: 'linear-gradient(90deg,rgb(222, 188, 188) 0%,rgb(248, 207, 233) 100%)',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            mb: 1,
                            display: 'inline-block',
                            alignSelf: 'flex-start',
                            boxShadow: '0 2px 8px rgba(183,120,120,0.08)',
                          }}>
                            <Typography variant="h6" fontWeight={700} sx={{ color: 'white', letterSpacing: 0.5 }}>
                              {title}
                            </Typography>
                          </Box>
                          {/* Université */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon sx={{ color: '#667eea', fontSize: 22, flexShrink: 0 }} />
                            <Typography 
                              variant="subtitle2" 
                              fontWeight={600} 
                              sx={{ color: '#667eea', fontSize: '1rem', wordBreak: 'break-word' }}
                            >
                              {inst ? inst.institution_name : 'Université inconnue'}
                            </Typography>
                          </Box>
                          {/* Débouchés */}
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                            <WorkIcon sx={{ color: '#764ba2', fontSize: 18, mt: 0.5, flexShrink: 0 }} />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ color: '#4a5568', fontWeight: 600, mb: 0.5 }}
                              >
                                Débouchés :
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ color: '#718096', lineHeight: 1.5, fontSize: '0.95rem', wordWrap: 'break-word', textAlign: 'justify' }}
                              >
                                {course.career_prospects || 'Débouchés non spécifiés'}
                              </Typography>
                            </Box>
                          </Box>
                          {/* Chips infos clés */}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            <Chip label={`Durée: ${course.duration || 'Non spécifiée'}`} size="small" sx={{ backgroundColor: alpha('#667eea', 0.08), color: '#667eea', fontWeight: 600 }} />
                            <Chip label={`Frais: ${course.fees || 'Non spécifié'}`} size="small" sx={{ backgroundColor: alpha('#B67878', 0.08), color: '#B67878', fontWeight: 600 }} />
                            <Chip label={`Diplôme: ${course.degree || 'Non spécifié'}`} size="small" sx={{ backgroundColor: alpha('#764ba2', 0.08), color: '#764ba2', fontWeight: 600 }} />
                            <Chip label={`Langues: ${course.languages || 'Non spécifiées'}`} size="small" sx={{ backgroundColor: alpha('#2d3748', 0.08), color: '#2d3748', fontWeight: 600 }} />
                          </Box>
                          {/* Prérequis */}
                          {course.prerequisites && (
                            <Box sx={{ mt: 2 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ color: '#4a5568', fontWeight: 600, mb: 0.5 }}
                              >
                                Prérequis :
                              </Typography>
                              <Chip 
                                label={course.prerequisites} 
                                size="small" 
                                sx={{ backgroundColor: alpha('#667eea', 0.13), color: '#667eea', fontSize: '0.85rem' }} 
                              />
                            </Box>
                          )}
                          {/* Procédure d'admission */}
                          <Typography variant="body2" sx={{ mt: 2, color: '#4a5568' }}>
                            <b>Procédure d'admission :</b> {course.admission_process || 'Non spécifiée'}
                          </Typography>
                          {/* Actions */}
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
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
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })}
      </motion.div>
      
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
            <FormControl fullWidth>
              <InputLabel>Université</InputLabel>
              <Select
                value={formData.university}
                label="Université"
                onChange={(e) => handleFormChange('university', e.target.value)}
              >
                {safeInstitutions && safeInstitutions.map((inst) => (
                  <MenuItem key={inst.id} value={inst.id}>{inst.institution_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Diplôme (degree)"
              value={formData.degree}
              onChange={(e) => handleFormChange('degree', e.target.value)}
              fullWidth
            />
            <TextField
              label="Langues (séparées par une virgule)"
              value={formData.languages}
              onChange={(e) => handleFormChange('languages', e.target.value)}
              fullWidth
            />
            <TextField
              label="Frais par an (Ariary)"
              value={formData.fees}
              onChange={(e) => handleFormChange('fees', e.target.value)}
              fullWidth
              type="number"
            />
            <TextField
              label="Durée (ex: 3 ans)"
              value={formData.duration}
              onChange={(e) => handleFormChange('duration', e.target.value)}
              fullWidth
            />
            <TextField
              label="Procédure d'admission"
              value={formData.admission_process}
              onChange={(e) => handleFormChange('admission_process', e.target.value)}
              fullWidth
              multiline
              rows={2}
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

      {/* Dialog de confirmation de suppression */}
      <Dialog open={confirmDelete.open} onClose={handleCancelDelete}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormationAdmin; 