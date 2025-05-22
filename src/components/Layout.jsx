import { Grid,Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function Layout() { 
    return (
        <Grid 
            container
            component="layout"
            sx={{ 
                display:'flex',
                flexDirection:'row',
                height: '100vh',
                // backgroundColor: 'red' 
            }}>
                <Grid
                    // xs={0}
                    // sm={4}
                    md={4}
                    component={Box}
                    sx={{
                        backgroundColor: 'blue',
                        // display: { xs: 'none', sm: 'block' }
                        height: '100%',
                        width: {
                            xs: '100%',
                            sm: '50%',
                            md: '33.33%',
                        }
                    }}
                />
                <Grid
                    // xs={0}
                    // sm={4}
                    md={4}
                    component={Box}
                    sx={{
                        backgroundColor: 'green',
                        // display: { xs: 'none', sm: 'block' }, 
                        height: '100%',
                       width: {
                            xs: '100%',
                            sm: '50%',
                            md: '33.33%',
                        }
                    }}
                />
                <Grid
                    // xs={12}
                    // sm={4}
                    md={4}
                    component={Box}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: 4,
                        backgroundColor:'yellow',
                        height: '100%',
                        width: {
                            xs: '100%',
                            sm: '100%',
                            md: '32.6%',
                        }
                    }}     
                />
                {/* <Outlet />       */}
       </Grid>
    );
}    
export default Layout;