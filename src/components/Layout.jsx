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

            <Grid sx={{backgroundColor: 'green' ,width: {
                            xs: '100%',
                            sm: '50%',
                            md: '82%',
                            lg: '82%',
                            xl: '82%',
            }}} >
                <Outlet/>
            </Grid>
         </Grid> 
       
    );
}    
export default Layout;