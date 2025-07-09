import React, { useContext, useState } from 'react';
import { ListUserContext, ListUserProvider } from '../../context/ListUserContext';
import { Avatar, Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Menu, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SortIcon from '@mui/icons-material/Sort';

const getInitials = (user) => {
  if (user.profil && (user.profil.name || user.profil.firstname)) {
    return `${user.profil.name?.[0] || ''}${user.profil.firstname?.[0] || ''}`.toUpperCase();
  }
  if (user.firstname || user.lastname) {
    return `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase();
  }
  if (user.name) return user.name[0].toUpperCase();
  if (user.email) return user.email[0].toUpperCase();
  return '?';
};

const isAdmin = (user) => {
  if (!user.roles) return false;
  return user.roles.some(role => typeof role === 'string' && role.toLowerCase().includes('admin'));
};

const SORT_OPTIONS = [
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
  { value: 'oldest', label: 'Le plus ancien' },
  { value: 'newest', label: 'Le plus récent' },
];

const sortUsers = (users, sortBy) => {
  switch (sortBy) {
    case 'az':
      return [...users].sort((a, b) => {
        const nameA = (a.profil?.name || a.firstname || a.name || '').toLowerCase();
        const nameB = (b.profil?.name || b.firstname || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    case 'za':
      return [...users].sort((a, b) => {
        const nameA = (a.profil?.name || a.firstname || a.name || '').toLowerCase();
        const nameB = (b.profil?.name || b.firstname || b.name || '').toLowerCase();
        return nameB.localeCompare(nameA);
      });
    case 'oldest':
      return [...users].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case 'newest':
      return [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    default:
      return users;
  }
};

const UserTable = ({ users, title, minWidth = 320, isAdminTable = false, showSort = false, sortBy, setSortBy }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSort = (value) => {
    setSortBy(value);
    handleClose();
  };

  return (
    <Box sx={{ mb: 6, flex: 1, minWidth }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2, position: 'relative' }}>
        <Typography variant="h5" fontWeight={700} color="black" sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', textAlign: 'center', mb: 0, flex: 1 }}>
          {isAdminTable && <AdminPanelSettingsIcon sx={{ color: '#fff', bgcolor: 'grey.800', borderRadius: '50%', p: 0.5, fontSize: 32 }} />}
          {title}
        </Typography>
        {showSort && (
          <Box sx={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleClick} color="primary" aria-label="trier">
              <SortIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <List sx={{ p: 0 }}>
                {SORT_OPTIONS.map(opt => (
                  <ListItem key={opt.value} disablePadding>
                    <ListItemButton selected={sortBy === opt.value} onClick={() => handleSort(opt.value)}>
                      <ListItemText primary={`- ${opt.label}`} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Menu>
          </Box>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, overflowX: 'auto', bgcolor: isAdminTable ? 'rgb(247, 227, 227)' : 'background.paper' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'black', fontWeight: 700 }}>Utilisateur</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 700 }}>Téléphone</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 700 }}>Membre depuis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, idx) => (
              <TableRow key={user.id || idx} sx={isAdminTable ? { bgcolor: 'rgb(247, 227, 227)', '&:hover': { bgcolor: 'rgb(249, 241, 241)' } } : {}}>
                <TableCell sx={{ color: 'black' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: isAdminTable ? 'rgb(247, 227, 227)' : '#667eea', color: isAdminTable ? '#b71c1c' : '#fff', fontWeight: 700, border: isAdminTable ? '2px solid #b71c1c' : undefined }}>
                      {getInitials(user)}
                    </Avatar>
                    <Typography fontWeight={600} sx={{ color: 'black' }}>
                      {user.profil && (user.profil.name || user.profil.firstname)
                        ? `${user.profil.name || ''} ${user.profil.firstname || ''}`.trim()
                        : `${user.firstname || ''} ${user.lastname || user.name || ''}`.trim()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'black' }}>{user.email}</TableCell>
                <TableCell sx={{ color: 'black' }}>{user.telephone || '-'}</TableCell>
                <TableCell sx={{ color: 'black' }}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const UserList = () => {
  const { users, loading, error } = useContext(ListUserContext);
  const [sortBy, setSortBy] = useState('az');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Erreur lors du chargement des utilisateurs.</Alert>;
  }

  if (!users || users.length === 0) {
    return <Typography>Aucun utilisateur trouvé.</Typography>;
  }

  const admins = users.filter(isAdmin);
  const simples = users.filter(u => !isAdmin(u));
  const sortedSimples = sortUsers(simples, sortBy);

  return (
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <UserTable users={admins} title="Administrateurs" minWidth={700} isAdminTable />
      <UserTable users={sortedSimples} title="Utilisateurs simples" minWidth={700} showSort sortBy={sortBy} setSortBy={setSortBy} />
    </Box>
  );
};

export default function UserPage() {
  return (
    <ListUserProvider>
      <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: 2, md: 4 }, overflowX: 'auto' }}>
        <Typography variant="h4" fontWeight={700} mb={4} color="black">
          Liste des utilisateurs
        </Typography>
        <UserList />
      </Box>
    </ListUserProvider>
  );
}
