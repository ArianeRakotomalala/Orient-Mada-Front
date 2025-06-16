import { Grid, Box, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import Slidebar from "./Slidebar";
import Feed from "./Feed";  
import RightPanel from "./RightPanel";

function Layout() { 
    return (
        <Grid 
            container
            component={Box}
            sx={{ 
                display: 'flex',
                flexDirection: 'row',
                height: '100vh',
                overflow: 'hidden'
            }}>
                {/* Sidebar - Fixed */}
                <Grid
                    component={Paper}
                    elevation={2}
                    sx={{
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        height: '100vh',
                        width: {
                            xs: '100%',
                            sm: '50%',
                            md: '22%',
                            lg: '22%',
                            xl: '22%',
                        },
                        zIndex: 1000
                    }}
                >
                    <Box>
                        <Slidebar />
                    </Box>
                </Grid>
             
                {/* Main Content - Scrollable */}
                <Grid 
                    sx={{
                        marginLeft: {
                            xs: 0,
                            sm: 0,
                            md: '22%',
                            lg: '22%',
                            xl: '22%',
                        },
                        width: {
                            xs: '100%',
                            sm: '100%',
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