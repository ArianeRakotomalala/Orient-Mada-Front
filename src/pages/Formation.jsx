import React, { useContext } from 'react';
import { DataContext } from '../Context/DataContext';
import { Card, CardContent, CardMedia, Typography, Grid, Box, CircularProgress } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import log from '../assets/log.png';

const defaultImage = log;

const Formation = () => {
  const { courses, institutions, loading } = useContext(DataContext);

  // Pour retrouver le nom de l'institution à partir de l'id
  const getInstitutionName = (institutions, id) => {
    if (!institutions || !id) return 'Institution inconnue';
    const instList = Array.isArray(institutions.member) ? institutions.member : (Array.isArray(institutions) ? institutions : []);
    const found = instList.find(inst => String(inst.id) === String(id));
    return found ? found.institution_name : 'Institution inconnue';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!courses || courses.length === 0) {
    return <Typography align="center" sx={{ mt: 4 }}>Aucune formation disponible.</Typography>;
  }

  return (
    <Box sx={{ p: 4, background: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
        Formations disponibles
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => {
          // Récupérer l'id institution depuis le champ institutions (format: /api/institutions/ID)
          const institutionId = course.institutions ? course.institutions.split('/').pop() : null;
          return (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ minHeight: 420, display: 'flex', flexDirection: 'column' }}>
                {course.image ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={course.image}
                    alt={course.title}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                    <img src={defaultImage} alt="default" style={{ height: 80, opacity: 0.7 }} />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>{course.title}</Typography>
                  <Typography variant="body2"><b>Durée :</b> {course.duration || 'Non spécifiée'}</Typography>
                  <Typography variant="body2"><b>Diplôme :</b> {course.degree || 'Non spécifié'}</Typography>
                  <Typography variant="body2"><b>Prérequis :</b> {course.prerequisites || 'Non spécifiés'}</Typography>
                  <Typography variant="body2"><b>Admission :</b> {course.admission_process || 'Non spécifié'}</Typography>
                  <Typography variant="body2"><b>Frais :</b> {course.fees || 'Non spécifié'}</Typography>
                  <Typography variant="body2"><b>Langues :</b> {course.languages || 'Non spécifiées'}</Typography>
                  <Typography variant="body2"><b>Débouchés :</b> {course.career_prospects || 'Non spécifiés'}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}><b>Institution :</b> {getInstitutionName(institutions, institutionId)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Formation;
