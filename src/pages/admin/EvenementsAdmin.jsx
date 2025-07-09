import React, { useContext, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';

export default function EvenementsAdmin() {
  const { events, institutions, refreshEvents, loading } = useContext(DataContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_date_time: '',
    institution: '',
    type: '',
    participant: '',
    lieu: '',
    created_at: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const [searchInstitution, setSearchInstitution] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, eventId: null });
  const [selectedInstitution, setSelectedInstitution] = useState('');

  // Fonction utilitaire pour convertir la date au format HTML5 datetime-local
  const toDatetimeLocal = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.replace(' ', 'T').slice(0, 16);
  };

  // Fonction utilitaire pour obtenir l'IRI de l'institution
  const getInstitutionIri = (value) => {
    if (!value) return '';
    return value.startsWith('/api/institutions/') ? value : `/api/institutions/${value}`;
  };

  const handleOpenDialog = (event = null) => {
    setEditEvent(event);
    setForm(event ? {
      ...event,
      event_date_time: toDatetimeLocal(event.event_date_time),
    } : {
      title: '',
      description: '',
      event_date_time: '',
      institution: '',
      type: '',
      participant: '',
      lieu: '',
      created_at: ''
    });
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditEvent(null);
    setForm({
      title: '',
      description: '',
      event_date_time: '',
      institution: '',
      type: '',
      participant: '',
      lieu: '',
      created_at: ''
    });
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const config = { headers: { 'Content-Type': 'application/ld+json' } };
      let eventDateTime = form.event_date_time;
      if (eventDateTime && eventDateTime.length === 16) {
        eventDateTime = eventDateTime.replace('T', ' ') + ':00';
      } else if (eventDateTime && eventDateTime.length === 19) {
        eventDateTime = eventDateTime.replace('T', ' ');
      }
      if (!eventDateTime || !/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(eventDateTime)) {
        setSnackbar({ open: true, message: 'La date et l\'heure de l\'événement sont obligatoires et doivent être au format AAAA-MM-JJ HH:mm:ss.', severity: 'error' });
        return;
      }
      const { created_at, ...formWithoutCreatedAt } = form;
      const body = {
        ...formWithoutCreatedAt,
        event_date_time: eventDateTime,
        institution: getInstitutionIri(form.institution),
      };
      console.log('Body envoyé à l\'API:', body);
      if (editEvent) {
        await axios.put(`/api/events/${editEvent.id}`, body, config);
        setSnackbar({ open: true, message: 'Événement modifié avec succès !', severity: 'success' });
      } else {
        await axios.post('/api/events', body, config);
        setSnackbar({ open: true, message: 'Événement ajouté avec succès !', severity: 'success' });
      }
      await refreshEvents();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: `Erreur : ${error.response?.data?.detail || error.message}`, severity: 'error' });
    }
  };
  const handleDelete = (eventId) => {
    setConfirmDelete({ open: true, eventId });
  };
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/events/${confirmDelete.eventId}`);
      setSnackbar({ open: true, message: 'Événement supprimé avec succès !', severity: 'success' });
      await refreshEvents();
    } catch (error) {
      setSnackbar({ open: true, message: `Erreur lors de la suppression : ${error.response?.data?.detail || error.message}`, severity: 'error' });
    } finally {
      setConfirmDelete({ open: false, eventId: null });
    }
  };
  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, eventId: null });
  };

  // Filtrage des événements selon la recherche
  const filteredEvents = events ? events.filter(event => {
    // Recherche sur le titre
    const matchTitle = event.title?.toLowerCase().includes(searchTitle.toLowerCase());
    // Filtre sur l'institution (Select)
    let institutionId = '';
    if (institutions && Array.isArray(institutions)) {
      const inst = institutions.find(inst => String(inst.id) === String(event.institution).split('/').pop());
      institutionId = inst ? String(inst.id) : '';
    }
    const matchInstitution = selectedInstitution ? institutionId === selectedInstitution : true;
    return matchTitle && matchInstitution;
  }) : [];
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>Gestion des événements</Typography>
        <Box display="flex" gap={2}>
          <Box sx={{ position: 'relative', minWidth: 270, width: 270, height: 44 }}>
            <SearchIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#616161', fontSize: 22, zIndex: 1 }} />
            <InputBase
              placeholder="Rechercher un événement..."
              value={searchTitle}
              onChange={e => { setSearchTitle(e.target.value); setCurrentPage(1); }}
              sx={{
                pl: 6,
                pr: 2,
                py: 0,
                border: '1px solid #ccc',
                borderRadius: 2,
                background: '#fff',
                fontSize: 15,
                minWidth: 270,
                width: 270,
                height: 44,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
              }}
              inputProps={{ style: { height: 44, padding: 0, display: 'flex', alignItems: 'center' } }}
            />
          </Box>
          <Select
            value={selectedInstitution}
            onChange={e => { setSelectedInstitution(e.target.value); setCurrentPage(1); }}
            displayEmpty
            sx={{
              minWidth: 220,
              width: 220,
              height: 44,
              background: '#fff',
              borderRadius: 2,
              fontSize: 15,
              border: '1px solid #ccc',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            <MenuItem value=""><em>Tous les établissements</em></MenuItem>
            {institutions && Array.isArray(institutions) && institutions.map(inst => (
              <MenuItem key={inst.id} value={String(inst.id)}>{inst.institution_name}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Ajouter un événement
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        {loading || !events ? (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgb(231, 194, 220)' }}>
                <TableCell align="center"><Skeleton variant="text" width={90} /></TableCell>
                <TableCell align="center"><Skeleton variant="text" width={70} /></TableCell>
                <TableCell align="center"><Skeleton variant="text" width={60} /></TableCell>
                <TableCell align="center"><Skeleton variant="text" width={90} /></TableCell>
                <TableCell align="center"><Skeleton variant="text" width={60} /></TableCell>
                <TableCell align="center"><Skeleton variant="text" width={110} /></TableCell>
                <TableCell align="right"><Skeleton variant="circular" width={32} height={32} /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(6)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton variant="rectangular" height={28} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" height={28} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" height={28} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" height={28} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" height={28} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" height={28} /></TableCell>
                  <TableCell align="right"><Skeleton variant="circular" width={28} height={28} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgb(231, 194, 220)' }}>
                <TableCell sx={{ color: 'black', fontWeight: 600 }} align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <EventIcon />
                    L'événement
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 600 }} align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <AccessTimeIcon />
                    Date
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 600 }} align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <CategoryIcon />
                    Type
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 600 }} align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <GroupIcon />
                    Participant
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 600 }} align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <LocationOnIcon />
                    Lieu
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 600 }} align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <SchoolIcon />
                    Institution
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 600 }} align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEvents && paginatedEvents.map((event, idx) => {
                const institution = institutions && Array.isArray(institutions)
                  ? institutions.find(inst => String(inst.id) === String(event.institution).split('/').pop())
                  : null;
                return (
                  <TableRow
                    key={event.id}
                    sx={{ backgroundColor: idx % 2 === 1 ? 'rgb(255, 241, 251)' : '#fff' }}
                  >
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.event_date_time ? new Date(event.event_date_time).toLocaleString() : ''}</TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>{event.participant}</TableCell>
                    <TableCell>{event.lieu}</TableCell>
                    <TableCell>{institution ? institution.institution_name : ''}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog(event)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(event.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      {/* Pagination */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
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
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
      <Dialog open={confirmDelete.open} onClose={handleCancelDelete}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editEvent ? 'Modifier' : 'Ajouter'} un événement</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            margin="normal"
            label="Titre"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
            InputProps={{ style: { textAlign: 'justify' } }}
          />
          {editEvent && (
            <TextField
              margin="normal"
              label="Date de l'événement (actuelle)"
              value={editEvent.event_date_time ? editEvent.event_date_time : ''}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 1 }}
            />
          )}
          <TextField
            margin="normal"
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Participant"
            name="participant"
            value={form.participant}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Lieu"
            name="lieu"
            value={form.lieu}
            onChange={handleChange}
            fullWidth
          />
          <Box mt={2}>
            <Typography variant="subtitle2" mb={1}>Institution</Typography>
            <TextField
              select
              name="institution"
              value={form.institution}
              onChange={handleChange}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="">Sélectionner une institution</option>
              {institutions && Array.isArray(institutions) && institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.institution_name}</option>
              ))}
            </TextField>
          </Box>
          <TextField
            margin="normal"
            label="Date et heure de l'événement"
            name="event_date_time"
            type="datetime-local"
            value={form.event_date_time}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>{editEvent ? 'Modifier' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 