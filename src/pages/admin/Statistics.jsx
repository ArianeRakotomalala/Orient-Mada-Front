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
  Cell,
  Label
} from 'recharts';
import PeopleIcon from '@mui/icons-material/People';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658', '#82ca9d'];

const Statistics = () => {
  const { courses, domaines, institutions } = useContext(DataContext);
  const { users, loading: usersLoading } = useContext(ListUserContext);

  // --- DEBUG ---
  console.log('Données brutes du contexte :', { courses, domaines, institutions, users });
  console.log('users', users);
  // --- FIN DEBUG ---

  // Evolution des inscriptions utilisateurs par mois
  const usersByMonth = useMemo(() => {
    if (!users || users.length === 0) return [];
    const counts = {};
    users.forEach(user => {
      if (!user.created_at) return;
      const date = new Date(user.created_at);
      if (isNaN(date)) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // ex: 2024-04
      counts[key] = (counts[key] || 0) + 1;
    });
    // Générer un tableau trié par date
    return Object.entries(counts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [users]);

  const formationsByDomain = useMemo(() => {
    if (!courses || !domaines) return [];
    
    const counts = domaines.map(domain => ({
      id: domain.id,
      name: domain.domaine,
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
  console.log('usersByMonth', usersByMonth);
  // --- FIN DEBUG ---

  // Helper pour normaliser la région (format titre)
  function normalizeRegion(region) {
    if (!region || typeof region !== 'string') return 'Non renseignée';
    const trimmed = region.trim().toLowerCase();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  // Statistiques universités par région
  const universitiesByRegion = useMemo(() => {
    if (!institutions || institutions.length === 0) return [];
    const counts = {};
    institutions.forEach(inst => {
      const region = normalizeRegion(inst.region);
      counts[region] = (counts[region] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => a.region.localeCompare(b.region));
  }, [institutions]);

  // Calcule le total pour le pourcentage
  const totalUniversities = universitiesByRegion.reduce((sum, r) => sum + r.count, 0);

  // Helper pour nom de domaine
  const getDomainName = (name) => name && typeof name === 'string' && name.trim() ? name : 'Inconnu';

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 3 }, bgcolor: '#f8fafc' }}>
      <Typography variant="h4" fontWeight={700} color="#2d3748" gutterBottom>
        Statistiques
      </Typography>

      <Grid container spacing={4} alignItems="stretch" justifyContent="center" sx={{ width: '100%', mx: 0, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{
            p: { xs: 2, md: 5 },
            minHeight: 490,
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(79,172,254,0.10)',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            maxWidth: 800,
            width: '100%',
            border: '1px solid #e0e7ef',
          }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#2d3748', fontWeight: 800, mb: 2, letterSpacing: 0.5 }}>
              Inscriptions utilisateurs/mois
            </Typography>
            {usersByMonth.length === 0 ? (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Aucune donnée d'inscription utilisateur</Typography>
              </Box>
            ) : (
              <ResponsiveContainer  height={500} maxWidth={600} maxHeight={1000}>
                <BarChart data={usersByMonth} barSize={38} margin={{ top: 5, right: 40, left: 40, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" angle={-30} textAnchor="end" interval={0} height={100} tick={{ fontWeight: 700, fill: '#2d3748', fontSize: 15 }}>
                    <Label value="Mois" offset={20} position="insideBottom" style={{ fontWeight: 700, fill: '#2d3748', fontSize: 18 }} />
                  </XAxis>
                  <YAxis allowDecimals={false} width={60} tick={{ fontWeight: 700, fill: '#667eea', fontSize: 18 }}>
                    <Label value="Nombre d'inscriptions" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontWeight: 800, fill: '#2d3748', fontSize: 18 }} />
                  </YAxis>
                  <Tooltip cursor={{ fill: '#e3f2fd' }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 24, fontSize: 16 }}  fontWeight={700}/>
                  <Bar dataKey="count" fill="#667eea" name="Inscriptions" radius={[8,8,0,0]} style={{  fontWeight: 700,  fontSize: 18 }} >
                    <Label
                      dataKey="count"
                      position="top"
                      fill="#2d3748"
                      fontSize={18}
                      fontWeight={800}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{
            p: { xs: 2, md: 5 },
            minHeight: 520,
            width: '100%',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(79,172,254,0.10)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 800,
            border: '1px solid #e0e7ef',
            background: '#ffffff',
          }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#2d3748', fontWeight: 800, mb: 2, letterSpacing: 0.5 }}>
              Répartition des universités par région
            </Typography>
            <ResponsiveContainer width="100%" height={440} maxWidth={800}>
              <PieChart>
                <Pie
                  data={universitiesByRegion}
                  dataKey="count"
                  nameKey="region"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={120}
                  fill="#667eea"
                  label={({ region, count }) => {
                    const percent = totalUniversities ? ((count / totalUniversities) * 100).toFixed(1) : 0;
                    return `${percent}%`;
                  }}
                  labelLine={false}
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {universitiesByRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#667eea','#764ba2','#f093fb','#4facfe','#fbbf24','#f87171','#34d399'][index % 7]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} université(s)`, name]}
                  labelStyle={{ fontSize: 16, fontWeight: 600 }}
                  contentStyle={{ fontSize: 14, fontWeight: 500 }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;