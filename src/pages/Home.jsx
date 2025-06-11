import Feed from "../components/Feed";
import { Box, Grid } from "@mui/material";
import RightPanel from "../components/RightPanel";

// affichage de zone centrale et de rightpanel ensemble

function Home() {
  return (
    <Grid
      container
      component={Box}
      // gap={1}
      sx={{
        height: '100vh',
        backgroundColor: '#F5F7FB',
        overflow: 'hidden'
      }}
    >
      {/* Zone centrale */}
      <Grid
        // item
        component={Box}
        sx={{
          // backgroundColor: '#F5F7FB',
          height: '100vh',
          overflowY: 'auto',
          width: {
            xs: '100%',
            sm: '100%',
            md: '65%',
            lg: '65%',
            xl: '65%',
          },
          '&::-webkit-scrollbar': {
            width: '1px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'white',
          }
        }}
      >
        <Feed />
      </Grid>

      {/* Zone de droite */}
      <Grid
        // item
        component={Box}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          // backgroundColor: '#F5F7FB',
          height: '100vh',
          width: {
            xs: '100%',
            sm: '100%',
            md: '35%',
            lg: '35%',
            xl: '35%',
          }
        }}
      >
        <RightPanel />
      </Grid>
    </Grid>
  );
}

export default Home;
