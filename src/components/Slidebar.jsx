import { NavLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import ExploreIcon from '@mui/icons-material/Explore';

const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#1976d2' : '#222',
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 500,
    padding: '12px 18px',
    borderRadius: '8px',
    background: isActive ? '#e3f2fd' : 'transparent',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.08rem',
    transition: 'background 0.2s, color 0.2s',
    gap: '12px',
    // fontFamily: "'Inter', 'Roboto', sans-serif",
    marginBottom: '4px',
    letterSpacing: '0.02em',
    boxShadow: isActive ? '0 2px 8px #e3f2fd55' : 'none',
    cursor: 'pointer',
    '&:hover': {
        background: '#f5faff',
        color: '#1976d2'
    }
});

function Slidebar() {
    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                // bgcolor: '#f8fafc',
                px: 3,
                py: 4,
                borderRadius: 3,
                boxShadow: '0 2px 12px #e3f2fd33',
                // fontFamily: "'Inter', 'Roboto', sans-serif"
            }}
        >
            <Typography
                component="h1"
                variant="h4"
                sx={{
                    mb: 4,
                    mt: 2,
                    fontWeight: 'bold',
                    // color: '#1976d2',
                    // letterSpacing: '0.04em',
                }}
            >
                Orient Mada
            </Typography>
            <nav>
                <NavLink to="/explore" style={navLinkStyle}>
                    <ExploreIcon sx={{ mr: 1 }} /> Explorer
                </NavLink>
                <NavLink to="/university" style={navLinkStyle}>
                    <SchoolIcon sx={{ mr: 1 }} /> Universités
                </NavLink>
                <NavLink to="/formation" style={navLinkStyle}>
                    <WorkIcon sx={{ mr: 1 }} /> Formation
                </NavLink>
                <NavLink to="/event" style={navLinkStyle}>
                    <EventIcon sx={{ mr: 1 }} /> Evenement
                </NavLink>
            </nav>
        </Box>
    );
}

export default Slidebar;