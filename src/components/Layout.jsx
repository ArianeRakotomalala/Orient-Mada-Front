import { Grid, Box, Paper, useMediaQuery, IconButton, Drawer } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Slidebar from "./Slidebar";
import Feed from "./Feed";  
import RightPanel from "./RightPanel";
import { useState } from "react";

function Layout() { 
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => setDrawerOpen(true);
    const handleDrawerClose = () => setDrawerOpen(false);

    return (
        <Grid 
            container
            component={Box}
            sx={{ 
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                height: '100vh',
                overflow: 'hidden'
            }}>
                {/* Hamburger menu for mobile */}
                {isMobile && (
                    <Box sx={{ position: 'fixed', top: 8, left: 8, zIndex: 1201 }}>
                        <IconButton onClick={handleDrawerOpen} size="large">
                            <MenuIcon />
                        </IconButton>
                    </Box>
                )}

                {/* Sidebar - Responsive */}
                {!isMobile && (
                    <Grid
                        component={Paper}
                        elevation={2}
                        sx={{
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            height: '100vh',
                            width: {
                                md: '22%',
                                lg: '22%',
                                xl: '22%',
                            },
                            zIndex: 1000,
                        }}
                    >
                        <Box>
                            <Slidebar />
                        </Box>
                    </Grid>
                )}

                {/* Drawer for mobile sidebar */}
                {isMobile && (
                    <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={handleDrawerClose}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: '75vw',
                                maxWidth: 300,
                            }
                        }}
                    >
                        <Box sx={{ width: '100vw', maxWidth: 300 }}>
                            <Slidebar />
                        </Box>
                    </Drawer>
                )}
             
                {/* Main Content - Scrollable */}
                <Grid 
                    sx={{
                        marginLeft: isMobile ? 0 : {
                            md: '22%',
                            lg: '22%',
                            xl: '22%',
                        },
                        width: isMobile ? '100%' : {
                            md: '78%',
                            lg: '78%',
                            xl: '78%',
                        },
                        height: '100vh',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#555',
                        }
                    }}
                >
                    <Outlet/>
                </Grid>
         </Grid> 
    );
}    

export default Layout;