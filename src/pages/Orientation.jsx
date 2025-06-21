import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import { DataContext } from '../Context/DataContext';
import Bouton from '../components/Bouton';
import {
  Box,
  Paper,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Skeleton,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReplayIcon from '@mui/icons-material/Replay';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CircularProgress from '@mui/material/CircularProgress';
import questions from '../static/orientationQuestions';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import PageTitle from '../components/PageTitle';

function Orientation() {
  const { user, userProfils } = useContext(UserContext);
  const { institutions, courses, domaines } = useContext(DataContext);
  const [answers, setAnswers] = useState({});
  const [suggestion, setSuggestion] = useState(null);
  const [explication, setExplication] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const navigate = useNavigate();

  // Ajout pour transition d'entrée
  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000); // 1 seconde
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckboxChange = (option) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAnalysisDialogOpen(true);
    setAnalysisProgress(0);

    const minLoadingTime = 2500;
    const start = Date.now();

    const filiereScores = {};

    const answerToFiliereMap = {
      'Programmer et créer des applications': ['Informatique', 'STICOM'],
      'Soigner et aider les autres': ['Médecine', 'Sciences Infirmières'],
      'Analyser les comportements humains': ['Sociologie', 'Psychologie'],
      'Concevoir et construire des structures': ['Génie Civil', 'Architecture'],
      "Travailler avec la nature et l'environnement": ['Agronomie', 'Environnement'],
      'Accueillir et faire découvrir': ['Hôtellerie', 'Tourisme'],
      'Laboratoire ou bureau technique': ['SVT', 'Biotechnologie', 'Génie Géologique'],
      'Hôpital ou centre médical': ['Médecine', 'Sciences Infirmières', 'Maïeutique'],
      'Bureau ou salle de réunion': ['Économie', 'Gestion', 'Droit'],
      'Chantier ou atelier': ['Génie Civil', 'Génie Mécanique et Industriel'],
      'Extérieur ou ferme': ['Agronomie'],
      'Hôtel ou site touristique': ['Hôtellerie', 'Tourisme'],
      'Mathématiques et Physique': ['Mathématiques', 'Physique'],
      'Biologie et Sciences de la vie': ['SVT', 'Biotechnologie', 'Botanique'],
      'Histoire et Géographie': ['Histoire', 'Géographie'],
      'Économie et Gestion': ['Économie', 'Gestion', 'Marketing'],
      'Technologie et Dessin technique': ['Génie Civil', 'Génie Mécanique et Industriel', 'Architecture'],
      'Sciences de la terre': ['Agronomie', 'Génie Géologique', 'Paléontologie'],
    };

    Object.values(answers).forEach(answer => {
      const filieres = answerToFiliereMap[answer.label];
      if (filieres) {
        filieres.forEach(filiere => {
          filiereScores[filiere] = (filiereScores[filiere] || 0) + 1;
        });
      }
    });

    const sortedFilieres = Object.entries(filiereScores).sort((a, b) => b[1] - a[1]);

    let suggestionValue, explicationValue;

    if (sortedFilieres.length === 0) {
      suggestionValue = 'Aucun profil dominant';
      explicationValue = "Il semble que vos réponses soient très variées ! Nous vous suggérons d'explorer plusieurs domaines pour affiner vos intérêts.";
    } else {
      const topFiliereName = sortedFilieres[0][0];
      const topCourse = courses.find(c => c.title.toLowerCase().includes(topFiliereName.toLowerCase()));

      if (topCourse && topCourse.domaine_id) {
        const topDomaine = domaines.find(d => d.id === parseInt(topCourse.domaine_id));
        suggestionValue = topFiliereName;
        if (topDomaine) {
          explicationValue = `La filière qui semble le mieux vous correspondre est **${topFiliereName}**, qui fait partie du domaine **${topDomaine.domaine}**. Explorez cette voie pour voir si elle vous passionne !`;
        } else {
          explicationValue = `La filière qui semble le mieux vous correspondre est **${topFiliereName}**. Explorez cette voie pour voir si elle vous passionne !`;
        }
      } else {
        suggestionValue = topFiliereName;
        explicationValue = `La filière qui semble le mieux vous correspondre est **${topFiliereName}**. Comme cette filière n'est pas directement listée, nous vous conseillons de rechercher des formations similaires.`;
      }
    }

    const analysisDuration = minLoadingTime - 500;
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(100, Math.floor((elapsed / analysisDuration) * 100));
      setAnalysisProgress(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minLoadingTime - elapsed);
    setTimeout(() => {
      clearInterval(progressInterval);
      setSuggestion(suggestionValue);
      setExplication(explicationValue);
      setIsLoadingResult(false);
      setIsAnalysisDialogOpen(false);
      
      setShowTransition(true);
      setTimeout(() => {
        setOpenDialog(true);
        setTimeout(() => {
          setShowExplosion(true);
          setTimeout(() => setShowExplosion(false), 3000);
        }, 800);
      }, 500);
    }, remaining);
  };

  const getUniversitiesForFiliere = (filiereName) => {
    if (!filiereName || !Array.isArray(courses)) return null;

    const institutionsList = Array.isArray(institutions.member) ? institutions.member : (Array.isArray(institutions) ? institutions : []);
    
    const relevantCourses = courses.filter(c => c.title.toLowerCase().includes(filiereName.toLowerCase()));
    
    const institutionIds = new Set(
      relevantCourses.map(c => c.institutions ? c.institutions.split('/').pop() : null).filter(Boolean)
    );
    
    const relevantInstitutions = institutionsList
      .filter(inst => institutionIds.has(String(inst.id)))
      .slice(0, 5);

    if (relevantInstitutions.length === 0) {
      return (
        <Typography sx={{ color: '#333' }}>
          Aucune université trouvée pour cette filière pour le moment.
        </Typography>
      );
    }
    
    const handleUniversityClick = (id) => {
      navigate(`/home/university/${id}`);
    };

    return (
      <Stack spacing={1}>
        {relevantInstitutions.map((university, index) => (
          <Button
            key={index}
            onClick={() => handleUniversityClick(university.id)}
            sx={{ 
              color: '#333', 
              padding: '4px 8px',
              borderRadius: 1,
              background: 'white',
              border: '1px solid #e9ecef',
              textTransform: 'none',
              justifyContent: 'flex-start',
              textAlign: 'left',
              '&:hover': {
                background: '#f8f9fa',
                borderColor: '#667eea',
                transition: 'all 0.3s ease'
              },
              transition: 'all 0.3s ease'
            }}
          >
            🏛️ {university.institution_name || university.name || `Université ${index + 1}`}
          </Button>
        ))}
      </Stack>
    );
  };

  const handleReset = () => {
    setAnswers({});
    setSuggestion(null);
    setExplication('');
    setCurrentStep(0);
    setShowResult(false);
    setOpenDialog(false);
    setShowExplosion(false);
    setShowTransition(false);
    setIsAnalysisDialogOpen(false);
    setAnalysisProgress(0);
  };

  const isLastStep = currentStep === questions.length - 1;
  const isFirstStep = currentStep === 0;
  const currentQuestion = questions[currentStep];

  
  let prenom = userProfils?.firstname || user?.name || '';
  let mail = user?.email || '';
  if (prenom) prenom = prenom.charAt(0).toUpperCase() + prenom.slice(1);

  
  const questionsRestantes = questions.length - currentStep - 1;
  let messageMotivant = '';
  if (questionsRestantes > 1) messageMotivant = `Encore ${questionsRestantes} questions, continuez !`;
  else if (questionsRestantes === 1) messageMotivant = "Plus qu'une question, courage !";
  else messageMotivant = "Dernière question, bravo !";

 
  if (isPageLoading) {
    return (
      <Box sx={{ width: '100%', minHeight: '100vh', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f7fafd' }}>
        {isPageLoading ? (
          <>
            <Skeleton variant="text" width={320} height={48} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width={900} height={60} sx={{ mb: 3, borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={1000} height={420} sx={{ borderRadius: 3, mb: 2 }} />
            <Skeleton variant="rectangular" width={200} height={48} sx={{ borderRadius: 2, mb: 1 }} />
            <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 2 }} />
          </>
        ) : (
          <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" color="error" gutterBottom>
              Aucune formation disponible
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Il semble qu'aucune formation ne soit actuellement disponible dans la base de données.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Veuillez réessayer plus tard ou contactez l'administrateur si le problème persiste.
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center',
      backgroundColor: '#f7fafd' }}>
      
      <PageTitle 
        title="Test d'orientation"
        subtitle="Ce test est conçu pour vous aider à découvrir les filières qui correspondent le mieux à votre profil. Répondez honnêtement pour une expérience personnalisée."
        icon={SchoolIcon}
        color="#667eea"
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Fade in timeout={600}>
          <Paper elevation={6} sx={{ 
            maxWidth: { xs: '95%', sm: '90%', md: 1100 },
            width: '100%', 
            p: { xs: 2, sm: 5 }, 
            borderRadius: 3, 
            boxShadow: '0 4px 32px #b39ddb55', 
            minHeight: 650,
            maxHeight: 750,
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start', 
            alignItems: 'stretch', 
            background: '#fff',
            overflow: 'hidden',
            position: 'relative',
            pb: { xs: '80px', sm: 5 }
          }}>
            {/* Stepper de progression */}
            <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 3, '& .MuiStepIcon-root': { color: '#9575cd' }, '& .MuiStepIcon-root.Mui-active': { color: '#ffb74d' }, '& .MuiStepIcon-root.Mui-completed': { color: '#43a047' } }}>
              {questions.map((q, idx) => (
                <Step key={q.id} completed={answers[q.id] !== undefined}>
                  <StepLabel />
                </Step>
              ))}
            </Stepper>
            {/* Numéro de la question et message motivant */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary.main" fontWeight={600}>
                Question {currentStep + 1} / {questions.length}
              </Typography>
              <Typography variant="body2" color="#ff9800" fontWeight={600}>
                {messageMotivant}
              </Typography>
            </Stack>
            <Typography variant="h5" fontWeight="bold" mb={2} color="primary.main" align="center">
              Test d'orientation
            </Typography>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <Stack spacing={4} sx={{ flex: 1, overflow: 'auto', py: 2, px: 1 }}>
                <FormControl component="fieldset" fullWidth required>
                  <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1, color: '#7b1fa2' }}>{currentQuestion.label}</FormLabel>
                  <Stack spacing={1}>
                    {currentQuestion.options.map((opt) => (
                      <FormControlLabel
                        key={opt.label}
                        control={
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon />}
                            checkedIcon={<CheckBoxIcon />}
                            checked={answers[currentQuestion.id]?.label === opt.label}
                            onChange={() => handleCheckboxChange(opt)}
                            name={currentQuestion.id}
                            sx={{
                              color: '#1976d2',
                              '&.Mui-checked': { color: '#43a047' },
                              borderRadius: 1,
                              mr: 2
                            }}
                          />
                        }
                        label={opt.label}
                        sx={{ alignItems: 'flex-start', mb: 0.5, borderRadius: 2, px: 1, '&:hover': { background: '#fffde7' }, fontWeight: 500 }}
                      />
                    ))}
                  </Stack>
                </FormControl>
              </Stack>

              {isLastStep && (
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ pt: 2 }}>
                  <Bouton
                    label="Obtenir ma suggestion"
                    type="submit"
                    backgroundColor="#1976d2"
                    color="#fff"
                    hoverbackground="#1565c0"
                    hoverColor="#fff"
                    disabled={!answers[currentQuestion.id]}
                    sx={{ borderRadius: 2, fontSize: 18, boxShadow: '0 2px 8px #1976d220', width: { xs: '100%', sm: '60%', md: '40%' } }}
                  />
                </Stack>
              )}
            </form>

            {!isFirstStep && (
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  bottom: { xs: 20, sm: 40 },
                  left: { xs: 20, sm: 40 },
                  background: '#e3f2fd',
                  color: '#1976d2',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px #1976d220',
                  '&:hover': { background: '#bbdefb' },
                  p: 2
                }}
              >
                <ArrowBackIcon fontSize="large" />
              </IconButton>
            )}

            {!isLastStep && (
              <IconButton
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                sx={{
                  position: 'absolute',
                  bottom: { xs: 20, sm: 40 },
                  right: { xs: 20, sm: 40 },
                  background: !answers[currentQuestion.id] ? '#e0e0e0' : '#1976d2',
                  color: !answers[currentQuestion.id] ? '#bdbdbd' : '#fff',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px #1976d220',
                  '&:hover': { background: '#1565c0' },
                  p: 2
                }}
              >
                <ArrowForwardIcon fontSize="large" />
              </IconButton>
            )}
          </Paper>
        </Fade>
      </motion.div>
      
      <Dialog open={isAnalysisDialogOpen} PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <Skeleton variant="circular" width={120} height={120} sx={{ mb: 3, bgcolor: 'primary.light' }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {analysisProgress}%
              </Typography>
            </Box>
          </Skeleton>
          <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
            Analyse de vos réponses...
          </Typography>
        </Box>
      </Dialog>
      
      {/* Dialog des résultats avec effet d'explosion */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'white !important',
            color: '#333',
            position: 'relative',
            overflow: 'hidden',
            maxHeight: '80vh',
            '& .MuiDialog-paper': {
              background: 'white !important'
            },
            transform: showTransition ? 'scale(1)' : 'scale(0.8)',
            opacity: showTransition ? 1 : 0,
            transition: 'all 0.5s ease-in-out'
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            background: 'white !important'
          }
        }}
      >
        {/* Effet d'explosion */}
        {showExplosion && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1,
              animation: 'explosion 3s ease-out forwards'
            }}
          >
            {/* Confettis */}
            {[...Array(30)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: Math.random() * 8 + 3,
                  height: Math.random() * 8 + 3,
                  background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
                  borderRadius: '50%',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animation: `confetti ${Math.random() * 2 + 1}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
          </Box>
        )}
        
        <DialogContent sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {isLoadingResult ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
              <CircularProgress size={50} sx={{ color: '#667eea', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#333' }}>
                Analyse de vos réponses en cours...
              </Typography>
            </Box>
          ) : suggestion && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CelebrationIcon sx={{ fontSize: 30, mr: 1, color: '#ffd700' }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#333' }}>
                  🎉 Résultat ! 🎉
                </Typography>
                <CelebrationIcon sx={{ fontSize: 30, ml: 1, color: '#ffd700' }} />
              </Box>
              
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#667eea', mb: 2 }}>
                Filières recommandées :
              </Typography>
              
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  color: '#333', 
                  mb: 3,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                {suggestion}
              </Typography>
              
              {explication && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#333', 
                    mb: 3, 
                    whiteSpace: 'pre-line',
                    lineHeight: 1.5,
                    background: '#f8f9fa',
                    padding: 2,
                    borderRadius: 2,
                    border: '1px solid #e9ecef',
                    fontSize: '0.9rem'
                  }}
                >
                  {explication}
                </Typography>
              )}
              
              {/* Liste des universités */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#667eea', mb: 2 }}>
                  🏫 Universités proposant cette filière :
                </Typography>
                <Box sx={{ 
                  background: '#f8f9fa', 
                  padding: 2, 
                  borderRadius: 2,
                  border: '1px solid #e9ecef',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {getUniversitiesForFiliere(suggestion)}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<ReplayIcon />}
            onClick={handleReset}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 600, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': { 
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Refaire le test
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Styles CSS pour les animations */}
      <style>
        {`
          @keyframes explosion {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
          
          @keyframes confetti {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </Box>
  );
}

export default Orientation;