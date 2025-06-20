import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
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
  Skeleton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReplayIcon from '@mui/icons-material/Replay';
import questions from '../static/orientationQuestions';
import CircularProgress from '@mui/material/CircularProgress';

// Explications personnalisées pour chaque domaine
const domaineExplanations = {
  sciences: {
    titre: 'Sciences & Technologies',
    texte: "Ce domaine regroupe les filières comme l'informatique, les mathématiques, la physique, la chimie, la biologie, le génie civil ou l'électronique. Il est fait pour ceux qui aiment comprendre, expérimenter et innover dans les sciences et la technologie.",
  },
  sante: {
    titre: 'Santé & Social',
    texte: "Ce domaine concerne la médecine, la pharmacie, le travail social, la psychologie ou l'éducation. Il est idéal pour ceux qui souhaitent aider, soigner ou accompagner les autres dans leur bien-être.",
  },
  lettres: {
    titre: 'Lettres & Sciences Humaines',
    texte: "Ce domaine englobe le droit, l'histoire, la sociologie, les langues, la communication ou le journalisme. Il s'adresse à ceux qui aiment comprendre la société, débattre, écrire ou transmettre la culture.",
  },
  eco: {
    titre: 'Économie & Gestion',
    texte: "Ce domaine regroupe la gestion, l'économie, le commerce, le marketing, la finance ou le management. Il est fait pour ceux qui aiment organiser, entreprendre, gérer ou développer des projets.",
  },
  arts: {
    titre: 'Arts & Design',
    texte: "Ce domaine comprend les arts plastiques, l'architecture, le design graphique, la musique ou le théâtre. Il est parfait pour ceux qui souhaitent exprimer leur créativité et leur sens artistique.",
  },
  agri: {
    titre: 'Agriculture & Environnement',
    texte: "Ce domaine concerne l'agronomie, la gestion des ressources naturelles ou l'environnement. Il s'adresse à ceux qui veulent préserver la nature, travailler en extérieur ou gérer durablement les ressources.",
  },
};

function Orientation() {
  const { user, userProfils } = useContext(UserContext);
  const [answers, setAnswers] = useState({});
  const [suggestion, setSuggestion] = useState(null);
  const [explication, setExplication] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoadingResult, setIsLoadingResult] = useState(false);

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

  const handleCheckboxChange = (optionKey) => {
    // Simule un radio mais avec un visuel carré
    setAnswers({ ...answers, [currentQuestion.id]: optionKey });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResult(false);
    setIsLoadingResult(true);
    // On démarre le timer minimal
    const minLoadingTime = 1000; // 1 seconde
    const start = Date.now();

    // Calcul du résultat (rapide)
    const counts = {};
    Object.values(answers).forEach((domaineKey) => {
      counts[domaineKey] = (counts[domaineKey] || 0) + 1;
    });
    let max = 0;
    let bestKeys = [];
    Object.entries(counts).forEach(([key, count]) => {
      if (count > max) {
        max = count;
        bestKeys = [key];
      } else if (count === max) {
        bestKeys.push(key);
      }
    });
    let suggestionValue, explicationValue;
    if (bestKeys.length === 1) {
      const domaineKey = bestKeys[0];
      suggestionValue = domaineExplanations[domaineKey]?.titre || 'Aucun domaine dominant';
      explicationValue = domaineExplanations[domaineKey]?.texte || '';
    } else if (bestKeys.length > 1) {
      const domaines = bestKeys.map(key => domaineExplanations[key]?.titre).filter(Boolean).join(' / ');
      suggestionValue = domaines;
      explicationValue = "Vous avez des affinités pour plusieurs domaines : " + domaines + ". N'hésitez pas à explorer davantage ces voies pour affiner votre choix !";
    } else {
      suggestionValue = 'Aucun domaine dominant';
      explicationValue = '';
    }
    
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minLoadingTime - elapsed);
    setTimeout(() => {
      setSuggestion(suggestionValue);
      setExplication(explicationValue);
      setIsLoadingResult(false);
      setShowResult(true);
    }, remaining);
  };

  const handleReset = () => {
    setAnswers({});
    setSuggestion(null);
    setExplication('');
    setCurrentStep(0);
    setShowResult(false);
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
        <Skeleton variant="text" width={320} height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={900} height={60} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={1000} height={420} sx={{ borderRadius: 3, mb: 2 }} />
        <Skeleton variant="rectangular" width={200} height={48} sx={{ borderRadius: 2, mb: 1 }} />
        <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center',
      backgroundColor: '#f7fafd' }}>
      {/* Message d'accueil */}
      {prenom ? (
        <Typography variant="h3" fontWeight="bold" mb={1} color="black" align="center">
          {`Bonjour ${prenom.charAt(0).toUpperCase() + prenom.slice(1)} !`}
        </Typography>
      ) : null}
      {/* {mail && (
        <Typography variant="body2" color="text.secondary" mb={2} align="center" sx={{ fontWeight: 400, letterSpacing: 0.2 }}>
          {mail}
        </Typography>
      )} */}
      <Typography variant="body1" mb={4} color="text.secondary" align="justify" sx={{ maxWidth: 980, width: '100%', mx: 'auto' }}>
      Nous vous proposons un test d'orientation conçu pour vous guider dans le choix d'un parcours adapté à vos intérêts, vos aptitudes et vos aspirations. Prenez le temps de répondre avec sincérité à chaque question afin d'obtenir des résultats pertinents. 
      </Typography>
      <Fade in timeout={600}>
        <Paper elevation={6} sx={{ maxWidth: 1000, width: '100%', p: { xs: 2, sm: 5 }, borderRadius: 3, boxShadow: '0 4px 32px #b39ddb55', minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', background: '#fff' }}>
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
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
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
                          checked={answers[currentQuestion.id] === opt.domaineKey}
                          onChange={() => handleCheckboxChange(opt.domaineKey)}
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
              <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                <IconButton
                  onClick={handlePrev}
                  disabled={isFirstStep}
                  sx={{
                    background: isFirstStep ? '#e0e0e0' : '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px #1976d220',
                    '&:hover': { background: '#bbdefb' },
                    p: 2
                  }}
                >
                  <ArrowBackIcon fontSize="large" />
                </IconButton>
                {!isLastStep ? (
                  <IconButton
                    onClick={handleNext}
                    disabled={!answers[currentQuestion.id]}
                    sx={{
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
                ) : (
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
                )}
              </Stack>
            </Stack>
          </form>
          <Fade in={showResult || isLoadingResult} timeout={700}>
            <Box>
              {isLoadingResult ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, mt: 4, width: '100%' }}>
                  <Skeleton variant="circular" width={60} height={60} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width={180} height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width={260} height={38} sx={{ mb: 2, borderRadius: 2 }} />
                  <Skeleton variant="text" width={420} height={24} sx={{ mb: 2, maxWidth: '90%' }} />
                  <Skeleton variant="rounded" width={160} height={40} />
                </Box>
              ) : suggestion && showResult && (
                <Paper elevation={0} sx={{ mt: 4, p: 3, background: '#fff', borderRadius: 2, textAlign: 'center', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 32px #9575cd33' }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Domaine suggéré :
                  </Typography>
                  <Typography fontSize={26} fontWeight="bold" color="#7b1fa2" mb={2}>
                    {suggestion}
                  </Typography>
                  {explication && (
                    <Typography variant="body1" color="text.secondary" mb={2}>
                      {explication}
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ReplayIcon />}
                    onClick={handleReset}
                    sx={{ mt: 2, borderRadius: 2, fontWeight: 600, background: '#fff', boxShadow: '0 2px 8px #b39ddb33', '&:hover': { background: '#ede7f6' } }}
                  >
                    Refaire le test
                  </Button>
                </Paper>
              )}
            </Box>
          </Fade>
        </Paper>
      </Fade>
    </Box>
  );
}

export default Orientation;