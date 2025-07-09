import React, { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Avatar,
  Menu,
  MenuItem,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { UserContext } from '../context/UserContext';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const AdminLayout = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = () => {
    if (!isDesktop) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_info');
    setUser(null);
    navigate('/login');
  };

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Formations', icon: <SchoolIcon />, path: '/admin/formations' },
    { text: 'Universités', icon: <BusinessIcon />, path: '/admin/universities' },
    { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/admin/users' },
    // { text: 'Paramètres', icon: <SettingsIcon />, path: '/admin/settings' },
    { text: 'Événements', icon: <EventIcon />, path: '/admin/evenements' },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    if (!isDesktop) {
      setMobileOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', mt: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem
                button
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  backgroundColor: isActiveRoute(item.path) ? alpha('#667eea', 0.1) : 'transparent',
                  color: isActiveRoute(item.path) ? '#667eea' : '#4a5568',
                  '&:hover': {
                    backgroundColor: alpha('#667eea', 0.05),
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActiveRoute(item.path) ? '#667eea' : '#718096',
                  }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: isActiveRoute(item.path) ? 600 : 400
                  }}
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
        
        <Divider sx={{ my: 2, mx: 2 }} />
        
        <List>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <ListItem
              button
              onClick={() => navigate('/home')}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                color: '#4a5568',
                '&:hover': {
                  backgroundColor: alpha('#667eea', 0.05),
                },
                '& .MuiListItemIcon-root': {
                  color: '#718096',
                }
              }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Retour au site" />
            </ListItem>
          </motion.div>
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1a202c',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Administration OrientMada
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {user?.email}
            </Typography>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: 'inherit' }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop ? true : mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#f8f9fa',
              borderRight: '1px solid #e2e8f0'
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Menu utilisateur */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            borderRadius: 2
          }
        }}
      >
        <MenuItem onClick={() => navigate('/home/profil')}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Mon profil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Déconnexion
        </MenuItem>
      </Menu>

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f8f9fa'
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminLayout; 