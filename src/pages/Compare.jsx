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
  Skeleton,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Fade,
  Zoom,
  Slide
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
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloseIcon from '@mui/icons-material/Close';
import { DataContext } from '../Context/DataContext';
import PageTitle from '../components/PageTitle';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Fonction pour créer un intervalle de prix
  const createPriceRange = (feesArray) => {
    if (!feesArray || feesArray.length === 0) return 'Non spécifié';
    
    const validFees = feesArray
      .map(fee => {
        if (typeof fee === 'string') {
          // Extraire les nombres de la chaîne (ex: "500000 ar" -> 500000)
          const match = fee.match(/(\d+(?:,\d+)*)/);
          return match ? parseInt(match[1].replace(/,/g, '')) : null;
        }
        return typeof fee === 'number' ? fee : null;
      })
      .filter(fee => fee !== null && fee >= 0);

    if (validFees.length === 0) return 'Non spécifié';
    
    const minFee = Math.min(...validFees);
    const maxFee = Math.max(...validFees);
    
    if (minFee === maxFee) {
      return `${minFee.toLocaleString()} ar (frais généraux + droit d'inscription exclus)`;
    } else {
      return `${minFee.toLocaleString()} - ${maxFee.toLocaleString()} ar (frais généraux + droit d'inscription exclus)`;
    }
  };

  // Fonction pour créer un intervalle de durée
  const createDurationRange = (durationArray) => {
    if (!durationArray || durationArray.length === 0) return 'Non spécifié';
    
    const validDurations = [];
    
    durationArray.forEach(duration => {
      if (typeof duration === 'string') {
        // Gérer les intervalles comme "3-5 ans" ou "3 - 5 ans"
        const intervalMatch = duration.match(/(\d+)\s*-\s*(\d+)/);
        if (intervalMatch) {
          const min = parseInt(intervalMatch[1]);
          const max = parseInt(intervalMatch[2]);
          if (min > 0 && max > 0 && min <= max) {
            validDurations.push(min, max);
          }
        } else {
          // Gérer les durées simples comme "3 ans"
          const match = duration.match(/(\d+)/);
          if (match) {
            const value = parseInt(match[1]);
            if (value > 0) {
              validDurations.push(value);
            }
          }
        }
      } else if (typeof duration === 'number' && duration > 0) {
        validDurations.push(duration);
      }
    });

    if (validDurations.length === 0) return 'Non spécifié';
    
    const minDuration = Math.min(...validDurations);
    const maxDuration = Math.max(...validDurations);
    
    if (minDuration === maxDuration) {
      return `${minDuration} an${minDuration > 1 ? 's' : ''}`;
    } else {
      return `${minDuration}-${maxDuration} ans`;
    }
  };

  const feesArray = universityCourses.map(c => c.fees).filter(Boolean);
  const durationArray = universityCourses.map(c => c.duration).filter(Boolean);

  return {
    institution_name: university.institution_name,
    logo: university.logo || null,
    region: university.region,
    type: university.type,
    formations: universityCourses.length > 0 ? universityCourses.map(c => c.title).join('\n') : 'Non spécifié',
    formationsCount: universityCourses.length,
    fees: createPriceRange(feesArray),
    duration: createDurationRange(durationArray),
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
  const [showMission, setShowMission] = useState(false);
  const [showApproach, setShowApproach] = useState(false);

  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    const pageLoadTimer = setTimeout(() => setIsPageLoading(false), 1000);
    
    // Fait apparaître les messages d'information après l'animation du contenu principal
    const infoCardsTimer = setTimeout(() => {
        setShowMission(true);
        setShowApproach(true);
    }, 1800);

    return () => {
        clearTimeout(pageLoadTimer);
        clearTimeout(infoCardsTimer);
    };
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
      <Box sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        py: 6, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        background: '#f5f5f5'
      }}>
        <Skeleton variant="text" width={320} height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={900} height={60} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={1000} height={420} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'white',
      py: 4,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f5f5f5',
        pointerEvents: 'none'
      }} />
      
      <Box maxWidth="lg" mx="auto" mb={4} position="relative">
        <PageTitle 
          title="Comparer les universités"
          subtitle="Comparez les universités et formations pour faire le meilleur choix."
          icon={CompareArrowsIcon}
          color="linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)"
        />
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Grid container spacing={3} justifyContent="center" alignItems="flex-start" maxWidth="lg" mx="auto">
          {/* Tableau gauche */}
          <Grid item xs={12} md={6}>
            <Slide direction="left" in timeout={800}>
              <Card
                sx={{
                  borderRadius: 4,
                  minHeight: 600,
                  maxWidth: 560,
                  mx: 'auto',
                  position: 'relative',
                  width: 560,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: activeTable === 'left' 
                    ? '0 0 40px rgba(25, 118, 210, 0.4), 0 8px 32px rgba(0,0,0,0.1)' 
                    : '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: activeTable === 'left' ? 'scale(1.02) translateY(-8px)' : 'scale(1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 0 50px rgba(25, 118, 210, 0.3), 0 12px 40px rgba(0,0,0,0.15)',
                    transform: 'scale(1.02) translateY(-8px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    zIndex: 1
                  }
                }}
                onClick={() => handleTableClick('left')}
              >
                <CardContent sx={{ p: 3, pt: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog('left')} 
                      size="large" 
                      sx={{ 
                        border: '3px dashed #1976d2', 
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        width: 70,
                        height: 70,
                        '&:hover': { 
                          bgcolor: 'rgba(25, 118, 210, 0.2)',
                          transform: 'scale(1.1)',
                          transition: 'all 0.3s ease'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <AddIcon fontSize="large" />
                    </IconButton>
                  </Box>
                  
                  {selectedLeft ? (
                    <Fade in timeout={600}>
                      <Box>
                        {/* Logo et nom de l'université */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          mb: 3,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(25, 118, 210, 0.05)',
                          border: '1px solid rgba(25, 118, 210, 0.1)',
                        }}>
                          {leftData.logo ? (
                            <Box sx={{ 
                              width: 80, 
                              height: 80, 
                              borderRadius: 2, 
                              overflow: 'hidden',
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'white',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                              <img 
                                src={leftData.logo} 
                                alt="Logo" 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'contain' 
                                }} 
                              />
                            </Box>
                          ) : (
                            <Box sx={{ 
                              width: 80, 
                              height: 80, 
                              borderRadius: 2, 
                              bgcolor: 'rgba(25, 118, 210, 0.1)',
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <SchoolIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                            </Box>
                          )}
                          <Typography 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#1976d2', 
                              fontSize: '1rem',
                              textAlign: 'center',
                              lineHeight: 1.2
                            }}
                          >
                            {leftData.institution_name}
                          </Typography>
                        </Box>

                        {fields.slice(1).map((field, idx) => (
                          <Box
                            key={field.key}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'rgba(25, 118, 210, 0.05)',
                              border: '1px solid rgba(25, 118, 210, 0.1)',
                              opacity: leftData[field.key] ? 1 : 0.7,
                              animation: animateFieldsLeft && selectedLeft ? `slideInLeft 0.6s ease-out ${idx * 0.1}s both` : 'none',
                              '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.1)',
                                transform: 'translateX(4px)',
                                transition: 'all 0.3s ease'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Box sx={{ 
                              p: 0.5, 
                              borderRadius: 1, 
                              bgcolor: 'rgba(25, 118, 210, 0.1)',
                              mr: 1.5
                            }}>
                              {field.icon}
                            </Box>
                            <Typography sx={{ minWidth: 80, fontWeight: 700, color: '#1976d2', fontSize: '0.9rem' }}>
                              {field.label}
                            </Typography>
                            <Typography 
                              sx={{ 
                                flex: 1, 
                                color: 'text.secondary', 
                                ml: 1.5, 
                                fontWeight: 500,
                                whiteSpace: field.key === 'formations' ? 'pre-line' : 'normal',
                                lineHeight: field.key === 'formations' ? 1.3 : 1.4,
                                fontSize: '0.85rem'
                              }}
                            >
                              {leftData[field.key] || <Chip label="Non spécifié" size="small" color="default" variant="outlined" />}
                            </Typography>
                          </Box>
                        ))}
                        
                        {(() => {
                          const idx = fields.findIndex(f => f.key === 'formations');
                          return idx !== -1 ? (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 1.5, 
                              pl: 3,
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                              border: '1px solid rgba(76, 175, 80, 0.2)'
                            }}>
                              <TrendingUpIcon color="success" sx={{ mr: 1, fontSize: '1.2rem' }} />
                              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                {leftData.formationsCount > 0 ? `${leftData.formationsCount} formation${leftData.formationsCount > 1 ? 's' : ''} disponibles` : 'Aucune formation'}
                              </Typography>
                            </Box>
                          ) : null;
                        })()}
                        
                        {selectedLeft && (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                            <Button
                              variant="contained"
                              href={`/home/university/${selectedLeft.id}`}
                              sx={{
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                borderRadius: 3,
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                  transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Visiter la page de l'université
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Fade>
                  ) : (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                      <SchoolIcon sx={{ fontSize: 50, color: 'rgba(25, 118, 210, 0.3)', mb: 1.5 }} />
                      <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ fontSize: '1.1rem' }}>
                        Sélectionnez une université
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
                        Cliquez sur le bouton + pour commencer
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Tableau droite */}
          <Grid item xs={12} md={6}>
            <Slide direction="right" in timeout={800}>
              <Card
                sx={{
                  borderRadius: 4,
                  minHeight: 600,
                  maxWidth: 560,
                  mx: 'auto',
                  position: 'relative',
                  width: 560,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: activeTable === 'right' 
                    ? '0 0 40px rgba(156, 39, 176, 0.4), 0 8px 32px rgba(0,0,0,0.1)' 
                    : '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: activeTable === 'right' ? 'scale(1.02) translateY(-8px)' : 'scale(1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 0 50px rgba(156, 39, 176, 0.3), 0 12px 40px rgba(0,0,0,0.15)',
                    transform: 'scale(1.02) translateY(-8px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #9c27b0, #e91e63)',
                    zIndex: 1
                  }
                }}
                onClick={() => handleTableClick('right')}
              >
                <CardContent sx={{ p: 3, pt: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <IconButton 
                      color="secondary" 
                      onClick={() => handleOpenDialog('right')} 
                      size="large" 
                      sx={{ 
                        border: '3px dashed #9c27b0', 
                        bgcolor: 'rgba(156, 39, 176, 0.1)',
                        width: 70,
                        height: 70,
                        '&:hover': { 
                          bgcolor: 'rgba(156, 39, 176, 0.2)',
                          transform: 'scale(1.1)',
                          transition: 'all 0.3s ease'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <AddIcon fontSize="large" />
                    </IconButton>
                  </Box>
                  
                  {selectedRight ? (
                    <Fade in timeout={600}>
                      <Box>
                        {/* Logo et nom de l'université */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          mb: 3,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(156, 39, 176, 0.05)',
                          border: '1px solid rgba(156, 39, 176, 0.1)',
                        }}>
                          {rightData.logo ? (
                            <Box sx={{ 
                              width: 80, 
                              height: 80, 
                              borderRadius: 2, 
                              overflow: 'hidden',
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'white',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                              <img 
                                src={rightData.logo} 
                                alt="Logo" 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'contain' 
                                }} 
                              />
                            </Box>
                          ) : (
                            <Box sx={{ 
                              width: 80, 
                              height: 80, 
                              borderRadius: 2, 
                              bgcolor: 'rgba(156, 39, 176, 0.1)',
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <SchoolIcon sx={{ fontSize: 40, color: '#9c27b0' }} />
                            </Box>
                          )}
                          <Typography 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#9c27b0', 
                              fontSize: '1rem',
                              textAlign: 'center',
                              lineHeight: 1.2
                            }}
                          >
                            {rightData.institution_name}
                          </Typography>
                        </Box>

                        {fields.slice(1).map((field, idx) => (
                          <Box
                            key={field.key}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'rgba(156, 39, 176, 0.05)',
                              border: '1px solid rgba(156, 39, 176, 0.1)',
                              opacity: rightData[field.key] ? 1 : 0.7,
                              animation: animateFieldsRight && selectedRight ? `slideInRight 0.6s ease-out ${idx * 0.1}s both` : 'none',
                              '&:hover': {
                                bgcolor: 'rgba(156, 39, 176, 0.1)',
                                transform: 'translateX(-4px)',
                                transition: 'all 0.3s ease'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Box sx={{ 
                              p: 0.5, 
                              borderRadius: 1, 
                              bgcolor: 'rgba(156, 39, 176, 0.1)',
                              mr: 1.5
                            }}>
                              {field.icon}
                            </Box>
                            <Typography sx={{ minWidth: 80, fontWeight: 700, color: '#9c27b0', fontSize: '0.9rem' }}>
                              {field.label}
                            </Typography>
                            <Typography 
                              sx={{ 
                                flex: 1, 
                                color: 'text.secondary', 
                                ml: 1.5, 
                                fontWeight: 500,
                                whiteSpace: field.key === 'formations' ? 'pre-line' : 'normal',
                                lineHeight: field.key === 'formations' ? 1.3 : 1.4,
                                fontSize: '0.85rem'
                              }}
                            >
                              {rightData[field.key] || <Chip label="Non spécifié" size="small" color="default" variant="outlined" />}
                            </Typography>
                          </Box>
                        ))}
                        
                        {(() => {
                          const idx = fields.findIndex(f => f.key === 'formations');
                          return idx !== -1 ? (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 1.5, 
                              pl: 3,
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                              border: '1px solid rgba(76, 175, 80, 0.2)'
                            }}>
                              <TrendingUpIcon color="success" sx={{ mr: 1, fontSize: '1.2rem' }} />
                              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                {rightData.formationsCount > 0 ? `${rightData.formationsCount} formation${rightData.formationsCount > 1 ? 's' : ''} disponibles` : 'Aucune formation'}
                              </Typography>
                            </Box>
                          ) : null;
                        })()}
                        
                        {selectedRight && (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                            <Button
                              variant="contained"
                              href={`/home/university/${selectedRight.id}`}
                              sx={{
                                background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
                                borderRadius: 3,
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #7b1fa2, #c2185b)',
                                  boxShadow: '0 6px 20px rgba(156, 39, 176, 0.4)',
                                  transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Visiter la page de l'université
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Fade>
                  ) : (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                      <SchoolIcon sx={{ fontSize: 50, color: 'rgba(156, 39, 176, 0.3)', mb: 1.5 }} />
                      <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ fontSize: '1.1rem' }}>
                        Sélectionnez une université
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
                        Cliquez sur le bouton + pour commencer
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>
      </motion.div>

      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 1301,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <AnimatePresence>
          {showMission && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            >
              <Card sx={{ 
                maxWidth: 360,
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: 'success.light',
              }}>
                <CardContent sx={{ p: 2, position: 'relative', pr: 4 }}>
                  <IconButton
                    size="small"
                    onClick={() => setShowMission(false)}
                    sx={{ position: 'absolute', top: 4, right: 4 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.5)', mr: 1.5, width: 32, height: 32 }}>
                      <InfoOutlinedIcon sx={{ color: 'success.dark' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} sx={{ color: 'success.dark', fontSize: '1rem' }}>
                      Notre Mission
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ textAlign: 'justify', color: 'text.secondary', fontSize: '0.875rem' }}>
                    Vous aider à prendre une décision éclairée en fonction de vos objectifs, de votre profil et de vos préférences.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showApproach && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
            >
              <Card sx={{ 
                maxWidth: 360,
                background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: 'error.light',
              }}>
                <CardContent sx={{ p: 2, position: 'relative', pr: 4 }}>
                  <IconButton
                    size="small"
                    onClick={() => setShowApproach(false)}
                    sx={{ position: 'absolute', top: 4, right: 4 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.5)', mr: 1.5, width: 32, height: 32 }}>
                      <WarningAmberOutlinedIcon sx={{ color: 'error.dark' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} sx={{ color: 'error.dark', fontSize: '1rem' }}>
                      Notre Approche
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ textAlign: 'justify', color: 'text.secondary', fontSize: '0.875rem' }}>
                    Cette comparaison n'a pas pour but de juger ou de rabaisser une institution. Chaque université a ses points forts, son histoire et ses valeurs.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Dialog de sélection d'université */}
      <Dialog 
        open={openDialog.open} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          color: 'white',
          fontWeight: 600
        }}>
          Sélectionner une université
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
              <LinearProgress sx={{ width: '100%' }} />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {universities.map((uni, index) => (
                <ListItem 
                  button 
                  onClick={() => handleSelectUniversity(uni)}
                  sx={{
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      transform: 'translateX(4px)',
                      transition: 'all 0.3s ease'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <SchoolIcon />
                  </Avatar>
                  <ListItemText
                    primary={uni.institution_name}
                    secondary={uni.region ? `Région : ${uni.region}` : ''}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Box>
  );
}
