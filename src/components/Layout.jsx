import { Grid,Box,Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import Slidebar from "./Slidebar";
import Feed from "./Feed";  
import RightPanel from "./RightPanel";
function Layout() { 
    return (
        <Grid 
            container
            component="Box"
            sx={{ 
                display:'flex',
                flexDirection:'row',
                height: {xs:'100vh', sm:'100vh', md:'100vh', lg:'100vh', xl:'100vh'},
            }}>
                {/* Navigation */}
                <Grid
                    component={Paper}
                    elevation={2}
                    md={4}
                    sx={{
                        // backgroundColor: 'blue',
                        height: {
                            xs: '30%',
                            sm: '30%',
                            md: '100%',
                            lg: '100%',
                            xl: '100%',
                        },
                        width: {
                            xs: '100%',
                            sm: '50%',
                            md: '18%',
                            lg: '18%',
                            xl: '18%',
                        }
                    }}
                >
                    <Box>
                        <Slidebar />
                    </Box>
                </Grid>

                {/* Zone centrale */}
                <Grid
                    md={4}
                    component={Box}
                    sx={{
                        backgroundColor: '#F5F7FB',
                        // backgroundColor: 'green', 
                        height: '100vh',
                        overflowY: 'auto',
                       width: {
                            xs: '100%',
                            sm: '50%',
                            md: '47%',
                            lg: '47%',
                            xl: '47%',
                        },
                        '&::-webkit-scrollbar': {
                        width: '1px',
                        },
                        '&::-webkit-scrollbar-track': {
                            // backgroundColor: 'grey',
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'white',
                            // borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            // backgroundColor: '#555',
                        },
                    }}
                >
                    <Feed />
                    {/* <Outlet /> */}
                    <Outlet />
                </Grid>
                
                {/* Zone de droite */}
                <Grid
                    md={4}
                    component={Box}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1,
                        backgroundColor: '#F5F7FB',
                        height: '100%',
                        width: {
                            xs: '100%',
                            sm: '100%',
                            md: '35%',
                            lg: '35%',
                            xl: '35%',
                        }
                    }}     
                >
                    <RightPanel/>
                </Grid>
       </Grid>
    );
}    
export default Layout;