import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../Context/DataContext';
import { UserContext } from '../../Context/UserContext';
import {
  Box, Card, CardContent, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, Snackbar, Alert, InputBase, alpha, FormControl, InputLabel, Select, MenuItem, CircularProgress, Skeleton, CardMedia
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import PageTitle from '../../components/PageTitle';
import log from '../../assets/log.png';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';

const defaultImage = log;
const regions = [
  "Antananarivo", "Toamasina", "Mahajanga", "Fianarantsoa", "Antsiranana", "Toliara"
];
const types = ["Publique", "Privée"];

const UniversityAdmin = () => {
  const { institutions, loading } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, universityId: null });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    institution_name: '',
    type: '',
    region: '',
    location: '',
    logo: '',
    src_img: '',
    history: '',
    contact: ''
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sécurisation des données
  const safeInstitutions = Array.isArray(institutions) ? institutions : [];

  // Recherche et filtre
  const filtered = safeInstitutions.filter(u =>
    (!search || (u.institution_name || '').toLowerCase().includes(search.toLowerCase()) || (u.location || '').toLowerCase().includes(search.toLowerCase()) || (u.region || '').toLowerCase().includes(search.toLowerCase())) &&
    (!selectedRegion || (u.region || '').toLowerCase() === selectedRegion.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedUniversities = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gestion du formulaire
  const handleOpenDialog = (university = null) => {
    if (university) {
      setEditingUniversity(university);
      setFormData({
        institution_name: university.institution_name || '',
        type: university.type || '',
        region: university.region || '',
        location: university.location || '',
        logo: university.logo || '',
        src_img: university.src_img || '',
        history: university.history || '',
        contact: university.contact || ''
      });
      setLogoPreview(university.logo || university.src_img || '');
    } else {
      setEditingUniversity(null);
      setFormData({ institution_name: '', type: '', region: '', location: '', logo: '', src_img: '', history: '', contact: '' });
      setLogoPreview('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUniversity(null);
    setFormData({ institution_name: '', type: '', region: '', location: '', logo: '', src_img: '', history: '', contact: '' });
    setLogoPreview('');
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'logo' || field === 'src_img') setLogoPreview(value);
  };

  // CRUD
  const handleSubmit = async () => {
    try {
      const data = {
        institution_name: formData.institution_name,
        type: formData.type,
        region: formData.region,
        location: formData.location,
        logo: formData.logo,
        src_img: formData.src_img,
        history: formData.history,
        contact: formData.contact
      };
      if (editingUniversity) {
        await axios.put(`/api/institutions/${editingUniversity.id}`, data, { headers: { 'Content-Type': 'application/ld+json' } });
        setSnackbar({ open: true, message: 'Université modifiée avec succès', severity: 'success' });
      } else {
        await axios.post('/api/institutions', data, { headers: { 'Content-Type': 'application/ld+json' } });
        setSnackbar({ open: true, message: 'Université ajoutée avec succès', severity: 'success' });
      }
      handleCloseDialog();
      window.location.reload(); // Pour rafraîchir la liste (à remplacer par un vrai refresh si possible)
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la sauvegarde', severity: 'error' });
    }
  };

  const handleDelete = (universityId) => {
    setConfirmDelete({ open: true, universityId });
  };

  const handleConfirmDelete = async () => {
    const universityId = confirmDelete.universityId;
    if (!universityId) return;
    try {
      await axios.delete(`/api/institutions/${universityId}`);
      setSnackbar({ open: true, message: 'Université supprimée avec succès', severity: 'success' });
      setConfirmDelete({ open: false, universityId: null });
      window.location.reload();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, universityId: null });
  };

  // Affichage
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
        title="Administration des Universités"
        subtitle="Gérez toutes les universités et établissements d'enseignement supérieur. Ajoutez, modifiez ou supprimez des universités."
        icon={BusinessIcon}
        color="linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)"
      />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Box sx={{ position: 'relative', borderRadius: 1, backgroundColor: alpha('#000', 0.05), '&:hover': { backgroundColor: alpha('#000', 0.08) }, width: '100%' }}>
              <Box sx={{ padding: '0 12px', height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SearchIcon color="action" />
              </Box>
              <InputBase
                placeholder="Rechercher…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ color: 'inherit', width: '100%', '& .MuiInputBase-input': { padding: '16.5px 14px 16.5px 40px', width: '100%' } }}
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <FormControl fullWidth variant="outlined" sx={{ borderRadius: 1, backgroundColor: alpha('#000', 0.05), '&:hover': { backgroundColor: alpha('#000', 0.08) }, '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
              <InputLabel id="region-filter-label">Filtrer par région</InputLabel>
              <Select labelId="region-filter-label" value={selectedRegion} label="Filtrer par région" onChange={e => setSelectedRegion(e.target.value)}>
                <MenuItem value=""><em>Toutes les régions</em></MenuItem>
                {regions.map(region => (
                  <MenuItem key={region} value={region}>{region}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ backgroundColor: '#764ba2', '&:hover': { backgroundColor: '#5a3d8a' }, height: 56, px: 3 }}>
            Ajouter
          </Button>
        </Box>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, px: 3, py: 1, borderRadius: 3, textAlign: 'center', minWidth: 120, background: 'linear-gradient(90deg, #764ba2 0%, #b993d6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
          </Typography>
        </Box>
        <Grid container spacing={1} justifyContent="center">
          {paginatedUniversities.map((uni) => (
            <Grid item key={uni.id} xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Card sx={{ width: 270, display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', p: 1, m: 0, width: '100%' }}>
                  {uni.logo ? (
                    <CardMedia component="img" sx={{ objectFit: 'contain', width: '100%', maxHeight: 140 }} image={uni.logo} alt={uni.institution_name} />
                  ) : uni.src_img ? (
                    <CardMedia component="img" sx={{ objectFit: 'contain', width: '100%', maxHeight: 120 }} image={uni.src_img} alt={uni.institution_name} />
                  ) : (
                    <CardMedia component="img" sx={{ objectFit: 'contain', width: '100%', maxHeight: 120 }} image={defaultImage} alt="Logo par défaut" />
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 2, minHeight: 100, textAlign: 'justify' }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '1.1rem', wordBreak: 'break-word', width: '100%', mb: 1, lineHeight: 1.2, textAlign: 'left', minHeight: '2.4em', maxHeight: '3.6em', overflow: 'hidden', display: 'block' }} title={uni.institution_name}>
                    {uni.institution_name}
                  </Typography>
                  {uni.history && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 0.5, maxHeight: 40, overflow: 'hidden' }}>
                      {uni.history}
                    </Typography>
                  )}
                  {uni.contact && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Contact : {uni.contact}
                    </Typography>
                  )}
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    Type : <span style={{ color: uni.type?.toLowerCase() === 'publique' ? '#2e7d32' : '#1976d2', fontWeight: 600 }}>{uni.type}</span>
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    Région : {uni.region}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    Localisation : {uni.location}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => handleOpenDialog(uni)} sx={{ color: '#764ba2' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton size="small" onClick={() => handleDelete(uni.id)} sx={{ color: '#e53e3e' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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
                  backgroundColor: '#764ba2 !important',
                  color: 'white',
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: '#4a5568'
                }
              }}
            />
          </Box>
        )}
      </motion.div>
      {/* Dialog pour ajouter/modifier */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUniversity ? 'Modifier l\'université' : 'Ajouter une nouvelle université'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nom de l'université" value={formData.institution_name} onChange={e => handleFormChange('institution_name', e.target.value)} fullWidth required />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={formData.type} label="Type" onChange={e => handleFormChange('type', e.target.value)}>
                {types.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Région</InputLabel>
              <Select value={formData.region} label="Région" onChange={e => handleFormChange('region', e.target.value)}>
                {regions.map(region => (
                  <MenuItem key={region} value={region}>{region}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Localisation (ville, quartier...)" value={formData.location} onChange={e => handleFormChange('location', e.target.value)} fullWidth />
            <TextField label="URL du logo" value={formData.logo} onChange={e => handleFormChange('logo', e.target.value)} fullWidth placeholder="https://..." />
            <TextField label="URL d'une image" value={formData.src_img} onChange={e => handleFormChange('src_img', e.target.value)} fullWidth placeholder="https://..." />
            <TextField label="Contact" value={formData.contact} onChange={e => handleFormChange('contact', e.target.value)} fullWidth placeholder="Téléphone, email..." />
            <TextField label="Histoire / Présentation" value={formData.history} onChange={e => handleFormChange('history', e.target.value)} fullWidth multiline rows={2} placeholder="Brève histoire ou présentation de l'université..." />
            {logoPreview && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <img src={logoPreview} alt="Aperçu" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.institution_name}> {editingUniversity ? 'Modifier' : 'Ajouter'} </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar pour les notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Dialog de confirmation de suppression */}
      <Dialog open={confirmDelete.open} onClose={handleCancelDelete}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette université ? Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UniversityAdmin;
