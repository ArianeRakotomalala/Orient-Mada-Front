import React, { useContext, useMemo } from 'react';
import { DataContext } from '../../Context/DataContext';
import { ListUserContext } from '../../context/ListUserContext';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import PeopleIcon from '@mui/icons-material/People';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658', '#82ca9d'];

const Statistics = () => {
  const { courses, domaines, institutions } = useContext(DataContext);
  const { users, loading: usersLoading } = useContext(ListUserContext);

  // --- DEBUG ---
  console.log('Données brutes du contexte :', { courses, domaines, institutions, users });
  // --- FIN DEBUG ---

  const formationsByDomain = useMemo(() => {
    if (!courses || !domaines) return [];
    
    const counts = domaines.map(domain => ({
      id: domain.id,
      name: domain.nom,
      formations: courses.filter(course => {
        if (!course.domaine) return false;
        // Gère le cas où `course.domaine` est une string (IRI) ou un objet
        const domainId = typeof course.domaine === 'string' ? course.domaine : course.domaine['@id'];
        return domainId === domain['@id'];
      }).length
    }));
    
    return counts.filter(d => d.formations > 0);
  }, [courses, domaines]);

  const formationsByInstitution = useMemo(() => {
    if (!courses || !institutions) return [];

    const counts = institutions.map(inst => ({
      name: inst.nom,
      value: courses.filter(course => {
        if (!course.institution) return false;
        // Gère le cas où `course.institution` est une string (IRI) ou un objet
        const institutionId = typeof course.institution === 'string' ? course.institution : course.institution['@id'];
        return institutionId === inst['@id'];
      }).length
    }));

    return counts.filter(i => i.value > 0);
  }, [courses, institutions]);

  // --- DEBUG ---
  console.log('Données pour les graphiques :', { formationsByDomain, formationsByInstitution });
  // --- FIN DEBUG ---

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="#2d3748" gutterBottom>
        Statistiques
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                color: 'white', 
                height: '100%',
                borderRadius: 3
            }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <PeopleIcon sx={{ fontSize: 50, mb: 1 }} />
                    <Typography variant="h3" fontWeight={700}>
                        {usersLoading ? '...' : (users?.length || 0)}
                    </Typography>
                    <Typography variant="h6" fontWeight={400}>
                        Utilisateurs Inscrits
                    </Typography>
                </CardContent>
            </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Formations par Domaine
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formationsByDomain} margin={{ top: 5, right: 20, left: 10, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={100}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="formations" fill="#8884d8" name="Nombre de formations" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Répartition par Université
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formationsByInstitution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {formationsByInstitution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics; 