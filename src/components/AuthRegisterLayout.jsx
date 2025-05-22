import {  Typography, Paper, Grid } from '@mui/material';

function AuthRegisterLayout({ children, image }) {
    return (
        // CONTAINER , ilay gris ivelany
        <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
            height: '100vh',
            backgroundColor: '#f0f2f5',
        }}
        >
        {/* // CONTAINER , ilay blanc be  */}
        <Grid
            container
            component={Paper}
            elevation={10}
            sx={{
            width: { xs: '100%', sm: '85%', md: '80%' },
            height: { xs: '90%', md: '80%' },
            display: 'flex',
            borderRadius: 1,
            overflow: 'hidden',
            minHeight: '90vh',
            }}
        >
            {/* FORMULAIRE */}
                <Grid 
                size={{ xs: 12, md: 6 }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 4,
                    backgroundColor: 'white',
                    width: {
                    xs: '100%',
                    sm: '100%',
                    md: '50%',
                    }
                }}
                >
                    {children}


                </Grid>
                {/* IMAGE */}
                <Grid
                size={{ xs: 0, md: 6 }}
                sx={{
                    position: 'relative',
                    display: { xs: 'none',  sm : 'none',md:'block'}, // cache sur mobile
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    height: '100%' ,
                    width:'50%',
                }}
                /> 
            </Grid>
        </Grid>
    )

}
export default AuthRegisterLayout;