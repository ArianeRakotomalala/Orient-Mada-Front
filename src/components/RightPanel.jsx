import StoryViewer from "./StoryViewer"; 
import { Typography,Box, Button,Grid, avatarClasses} from "@mui/material";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function RightPanel(){
    const [rate, setRate] = useState(0);
    const univerity=[
        {
            id: 1,
            name: 'ONIFRA',
            description: 'L\'ONIFRA est une institution de formation reconnue pour son excellence académique.',
            ville: 'Ampandrana, Antananarivo',
            img: 'https://i.pinimg.com/736x/e8/6a/3d/e86a3dba21f62a1d48281d0af01ef225.jpg',

            // srcimage: 'https://i.pinimg.com/736x/24/30/f0/2430f0496b5753ce53e420bd9a3d0559.jpg'
        },
        {
            id: 2,
            name: 'UCM',
            description: 'L\'UCM est un institut de renom qui offre des programmes variés.',
            ville: 'Ambanidia, Antananarivo',
            img: 'https://i.pinimg.com/736x/47/8f/74/478f74342329caac9feff40379ab3658.jpg',
        },
        
    ]

    return(
    <>
        <StoryViewer/>
        <br/>
        {/* SUGGESTIONS */}
            <Typography  variant="h6" sx={{ fontWeight: 'bold' }}>Suggestions</Typography>
            {/* <Typography  variant="h9">Les universités que vous pourriez aimer</Typography> */}
            {univerity.map((uni) => (
                <Box
                    key={uni.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                        sx={{
                            // borderBottom: "1px solid #ddd",
                            // padding: "8px 0",
                        }}
                >
                    <Box sx={{ flexGrow: 1, mx: 1 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar src={uni.img} />
                            <Typography variant="subtitle1" fontWeight="bold" color="Green">
                                {uni.name}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ textAlign: 'justify', fontSize: 13, width: 320 }}>
                            {uni.description}
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <LocationOnOutlinedIcon fontSize="small" sx={{ mr: 0.3 }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {uni.ville}
                            </Typography>
                        </Box>
                        <Rating name="read-only" value={rate}  size="small" />
                    </Box>
                    <Button size="small" variant="h1" 
                        sx={{
                            fontSize: '0.8rem',
                            textTransform: 'none',
                            backgroundColor: 'black',
                            borderRadius: '30px',
                            color: 'white',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                                color: 'white'
                            }
                        }}  
                    >
                        Découvrir
                    </Button>
                </Box>
            ))}
        {/* Orientation Rapide */}
        <Grid
            sx={{
                backgroundColor: '#F5F7FB',
                padding: 1,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                // marginTop: ,
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E3B55', mb: 0.5 }}>
                Orientation rapide
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, color: '#5A5A5A', mb: 2 }}>
                Vous hésitez sur votre filière ? Faites un test d’orientation pour vous guider.
            </Typography>
            <Button
                component={Link}
                to="/layout/orientation"
                variant="contained"
                sx={{
                    mt: 1,
                    mb: 0.5,
                    width: '100%',
                    textTransform: 'none',
                    background: 'linear-gradient(90deg, #4F8DFD 0%, #38C6D9 100%)',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    fontSize: 15,
                    boxShadow: '0 2px 8px rgba(79,141,253,0.15)',
                    '&:hover': {
                        background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                    },
                }}
            >
                Commencer l'orientation
            </Button>
        </Grid>     
        {/* Evenements        */}
        <Typography  variant="h6" sx={{ fontWeight: 'bold' , mt:2 }}>Événements</Typography>
<Box>
    {/* Example event */}
    <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
            background: '#F5F7FB',
            borderRadius: 2,
            mb: 1.5,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}
    >
        <Box display="flex" alignItems="center" gap={2}>
            {/* Event Icon */}
            <Avatar sx={{ bgcolor: '#4F8DFD' }}>
                <span role="img" aria-label="event">🎓</span>
            </Avatar>
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2E3B55' }}>
                    Forum des Métiers 2025
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A5A5A', fontSize: 13 }}>
                    15 Juin 2025
                </Typography>
            </Box>
        </Box>
        <Button
            href="#"
            variant="contained"
            size="small"
            sx={{
                background: 'linear-gradient(90deg, #4F8DFD 0%, #38C6D9 100%)',
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: 13,
                boxShadow: '0 2px 8px rgba(79,141,253,0.10)',
                '&:hover': {
                        background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                    },
            }}
        >
            Participer
        </Button>
    </Box>
</Box>



    </>
    );
   
}
export default RightPanel
