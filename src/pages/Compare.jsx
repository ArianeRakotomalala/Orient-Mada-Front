import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Chip,
  Skeleton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { DataContext } from '../Context/DataContext';

const fields = [
  { label: 'Nom', key: 'institution_name', icon: <SchoolIcon color="primary" sx={{ mr: 1 }} /> },
  { label: 'Région', key: 'region', icon: <LocationOnIcon color="secondary" sx={{ mr: 1 }} /> },
  { label: 'Type', key: 'type', icon: <CategoryIcon color="action" sx={{ mr: 1 }} /> },
  { label: 'Formations', key: 'formations', icon: <MenuBookIcon color="info" sx={{ mr: 1 }} /> },
  { label: 'Frais', key: 'fees', icon: <MonetizationOnIcon color="success" sx={{ mr: 1 }} /> },
  { label: 'Durée', key: 'duration', icon: <AccessTimeIcon color="disabled" sx={{ mr: 1 }} /> },
];

function getUniversityData(university, courses) {
  if (!university) return {};
  // Récupérer les formations de l'université
  const universityCourses = Array.isArray(courses)
    ? courses.filter(course => {
        if (!course.institutions) return false;
        const institutionId = course.institutions.split('/').pop();
        return String(institutionId) === String(university.id);
      })
    : [];
  return {
    institution_name: university.institution_name,
    region: university.region,
    type: university.type,
    formations: universityCourses.length > 0 ? universityCourses.map(c => c.title).join(', ') : 'Non spécifié',
    formationsCount: universityCourses.length,
    fees: universityCourses.length > 0 ? universityCourses.map(c => c.fees || 'Non spécifié').filter(Boolean).join(', ') : 'Non spécifié',
    duration: universityCourses.length > 0 ? universityCourses.map(c => c.duration || 'Non spécifié').filter(Boolean).join(', ') : 'Non spécifié',
  };
}

export default function Compare() {
  const { institutions, courses, loading } = useContext(DataContext);
  const universities = Array.isArray(institutions.member) ? institutions.member : (Array.isArray(institutions) ? institutions : []);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [openDialog, setOpenDialog] = useState({ side: null, open: false });
  const [activeTable, setActiveTable] = useState(null);
  const [animateFieldsLeft, setAnimateFieldsLeft] = useState(false);
  const [animateFieldsRight, setAnimateFieldsRight] = useState(false);

  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenDialog = (side) => setOpenDialog({ side, open: true });
  const handleCloseDialog = () => setOpenDialog({ side: null, open: false });

  const handleSelectUniversity = (university) => {
    if (openDialog.side === 'left') {
      setSelectedLeft(university);
      setAnimateFieldsLeft(false);
      setTimeout(() => setAnimateFieldsLeft(true), 10);
    } else if (openDialog.side === 'right') {
      setSelectedRight(university);
      setAnimateFieldsRight(false);
      setTimeout(() => setAnimateFieldsRight(true), 10);
    }
    handleCloseDialog();
  };

  const handleTableClick = (side) => {
    setActiveTable(side);
    setTimeout(() => setActiveTable(null), 250); // Effet temporaire
  };

  const leftData = getUniversityData(selectedLeft, courses);
  const rightData = getUniversityData(selectedRight, courses);

  if (isPageLoading) {
    return (
      <Box sx={{ width: '100%', minHeight: '100vh', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f7fafd' }}>
        <Skeleton variant="text" width={320} height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={900} height={60} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={1000} height={420} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', py: 4 }}>
      <Box maxWidth="lg" mx="auto" mb={4}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>
          Comparaison d'universités
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={2}>
          Notre plateforme vous permet de comparer deux établissements côte à côte afin de mieux comprendre leurs spécificités : les filières proposées, les frais de scolarité, les conditions d'admission, les débouchés, la durée des formations, et bien plus encore.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Paper elevation={0} sx={{ background: '#e3f2fd', p: 2, borderRadius: 2, flex: 1, mb: { xs: 2, md: 0 }, display: 'flex', alignItems: 'center' }}>
            <InfoOutlinedIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="body2" sx={{ textAlign: 'justify' }}>
              Vous aider à prendre une décision éclairée en fonction de vos objectifs, de votre profil et de vos préférences.
            </Typography>
          </Paper>
          <Paper elevation={0} sx={{ background: 'linear-gradient(90deg,rgb(230, 189, 189) 0%,rgb(214, 168, 198) 100%)', p: 2, borderRadius: 2, flex: 1, display: 'flex', alignItems: 'center' }}>
            <WarningAmberOutlinedIcon color="warning" sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="body2" sx={{ textAlign: 'justify' }}>
              Cette comparaison n'a pas pour but de juger ou de rabaisser une institution. Chaque université a ses points forts, son histoire et ses valeurs. Il s'agit simplement de vous offrir une vision plus claire pour vous orienter sereinement vers la voie qui vous correspond le mieux.
            </Typography>
          </Paper>
        </Box>
      </Box>
      <Grid container spacing={2} justifyContent="center" alignItems="flex-start" maxWidth="lg" mx="auto">
        {/* Tableau gauche */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              borderRadius: 4,
              minHeight: 500,
              maxWidth: 500,
              mx: 'auto',
              position: 'relative',
              width: 500,
              boxShadow: activeTable === 'left' ? '0 0 24px #1976d2aa' : '0 4px 32px #1976d233',
              transition: 'box-shadow 0.3s, transform 0.2s',
              transform: activeTable === 'left' ? 'scale(1.03)' : 'scale(1)',
              background: '#fff',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 0 40px #1976d2cc, 0 4px 32px #1976d233',
                transform: 'scale(1.025)',
              },
            }}
            className="compare-table-animate"
            onClick={() => handleTableClick('left')}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <IconButton color="primary" onClick={() => handleOpenDialog('left')} size="large" sx={{ border: '2px dashed #1976d2', bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}>
                <AddIcon fontSize="large" />
              </IconButton>
            </Box>
            {selectedLeft ? (
              <Box>
                {fields.map((field, idx) => (
                  <Box
                    key={field.key}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      opacity: leftData[field.key] ? 1 : 0.7,
                      animation: animateFieldsLeft && selectedLeft ? `fade-in-up 0.7s cubic-bezier(0.23,1,0.32,1) ${idx * 0.09 + 0.15}s both` : 'none',
                    }}
                  >
                    {field.icon}
                    <Typography sx={{ minWidth: 120, fontWeight: 600 }}>{field.label} :</Typography>
                    <Typography sx={{ flex: 1, color: 'text.secondary', ml: 1 }}>
                      {leftData[field.key] || <Chip label="Non spécifié" size="small" color="default" />}
                    </Typography>
                  </Box>
                ))}
                {(() => {
                  const idx = fields.findIndex(f => f.key === 'formations');
                  return idx !== -1 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 7 }}>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 600, fontSize: 15 }}>
                        {leftData.formationsCount > 0 ? `${leftData.formationsCount} formation${leftData.formationsCount > 1 ? 's' : ''}` : 'Aucune formation'}
                      </Typography>
                    </Box>
                  ) : null;
                })()}
                {selectedLeft && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
                    <a
                      href={`/home/university/${selectedLeft.id}`}
                      style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500, fontSize: 15 }}
                    >
                      Visiter la page de l'université
                    </a>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                Sélectionnez une université à comparer
              </Typography>
            )}
          </Paper>
        </Grid>
        {/* Colonne centrale (espace ou design) */}
        {/* Colonne centrale (espace ou design) */}
        {/* Tableau droite */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              borderRadius: 4,
              minHeight: 500,
              maxWidth: 500,
              mx: 'auto',
              position: 'relative',
              width: 500,
              boxShadow: activeTable === 'right' ? '0 0 24px #1976d2aa' : '0 4px 32px #1976d233',
              transition: 'box-shadow 0.3s, transform 0.2s',
              transform: activeTable === 'right' ? 'scale(1.03)' : 'scale(1)',
              background: '#fff',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 0 40px #1976d2cc, 0 4px 32px #1976d233',
                transform: 'scale(1.025)',
              },
            }}
            className="compare-table-animate"
            onClick={() => handleTableClick('right')}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <IconButton color="primary" onClick={() => handleOpenDialog('right')} size="large" sx={{ border: '2px dashed #1976d2', bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}>
                <AddIcon fontSize="large" />
              </IconButton>
            </Box>
            {selectedRight ? (
              <Box>
                {fields.map((field, idx) => (
                  <Box
                    key={field.key}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      opacity: rightData[field.key] ? 1 : 0.7,
                      animation: animateFieldsRight && selectedRight ? `fade-in-up 0.7s cubic-bezier(0.23,1,0.32,1) ${idx * 0.09 + 0.15}s both` : 'none',
                    }}
                  >
                    {field.icon}
                    <Typography sx={{ minWidth: 120, fontWeight: 600 }}>{field.label} :</Typography>
                    <Typography sx={{ flex: 1, color: 'text.secondary', ml: 1 }}>
                      {rightData[field.key] || <Chip label="Non spécifié" size="small" color="default" />}
                    </Typography>
                  </Box>
                ))}
                {(() => {
                  const idx = fields.findIndex(f => f.key === 'formations');
                  return idx !== -1 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 7 }}>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 600, fontSize: 15 }}>
                        {rightData.formationsCount > 0 ? `${rightData.formationsCount} formation${rightData.formationsCount > 1 ? 's' : ''}` : 'Aucune formation'}
                      </Typography>
                    </Box>
                  ) : null;
                })()}
                {selectedRight && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
                    <a
                      href={`/home/university/${selectedRight.id}`}
                      style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500, fontSize: 15 }}
                    >
                      Visiter la page de l'université
                    </a>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                Sélectionnez une université à comparer
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* Dialog de sélection d'université */}
      <Dialog open={openDialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Sélectionner une université</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
              <Typography>Chargement...</Typography>
            </Box>
          ) : (
            <List>
              {universities.map((uni) => (
                <ListItem button onClick={() => handleSelectUniversity(uni)}>
                  <ListItemText
                    primary={uni.institution_name}
                    secondary={uni.region ? `Région : ${uni.region}` : ''}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
