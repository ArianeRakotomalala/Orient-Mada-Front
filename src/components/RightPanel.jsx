import StoryViewer from "./StoryViewer"; 
import { Typography,Box, Button,Grid, avatarClasses, Skeleton } from "@mui/material";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../Context/DataContext";
import EventIcon from '@mui/icons-material/Event';

function RightPanel(){
    const { loading, events } = useContext(DataContext);
    const [rate, setRate] = useState(0);
    const univerity=[
        {
            id: 1,
            name: 'ONIFRA',
            // description: 'L\'ONIFRA est une institution de formation reconnue pour son excellence académique.',
            ville: 'Ampandrana, Antananarivo',
            img: 'https://i.pinimg.com/736x/e8/6a/3d/e86a3dba21f62a1d48281d0af01ef225.jpg',

            // srcimage: 'https://i.pinimg.com/736x/24/30/f0/2430f0496b5753ce53e420bd9a3d0559.jpg'
        },
        {
            id: 2,
            name: 'UCM',
            // description: 'L\'UCM est un institut de renom qui offre des programmes variés.',
            ville: 'Ambanidia, Antananarivo',
            img: 'https://i.pinimg.com/736x/47/8f/74/478f74342329caac9feff40379ab3658.jpg',
        },
        
    ]

    // Trouver l'événement à venir le plus proche
    const getNextEvent = () => {
        if (!Array.isArray(events) || events.length === 0) return null;
        const now = new Date();
        const upcoming = events.filter(e => e.event_date_time && new Date(e.event_date_time) > now);
        if (upcoming.length === 0) return null;
        upcoming.sort((a, b) => new Date(a.event_date_time) - new Date(b.event_date_time));
        return upcoming[0];
    };
    const nextEvent = getNextEvent();

    // Skeleton component for loading state
    const RightPanelSkeleton = () => (
        <>
            <StoryViewer/>
            <br/>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
            
            {/* Suggestions skeleton */}
            {Array.from({ length: 2 }).map((_, index) => (
                <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ flexGrow: 1, mx: 1 }}>
                        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1.5, mt: 1 }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="text" width="40%" height={24} />
                        </Box>
                    </Box>
                    <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: '30px' }} />
                </Box>
            ))}

            {/* Orientation rapide skeleton */}
            <Box sx={{ mt: 2, p: 1, borderRadius: 3 }}>
                <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" width="100%" height={48} sx={{ borderRadius: 2 }} />
            </Box>

            {/* Événements skeleton */}
            <Skeleton variant="text" width="50%" height={32} sx={{ mt: 2, mb: 2 }} />
            <Box sx={{ background: '#F5F7FB', borderRadius: 2, p: 2, mb: 1.5 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box>
                            <Skeleton variant="text" width={120} height={24} />
                            <Skeleton variant="text" width={80} height={20} />
                        </Box>
                    </Box>
                    <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 2 }} />
                </Box>
            </Box>
        </>
    );

    return(
    <>
        {loading ? (
            <RightPanelSkeleton />
        ) : (
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
                            <Box sx={{ flexGrow: 1, mx: 1  }}>
                                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1.5, mt: 1 }}>
                                    <Avatar src={uni.img} />
                                    <Typography variant="subtitle1" fontWeight="bold" color="black" sx={{  textAlign: 'right' }}>
                                        {uni.name}
                                    </Typography>
                                
                                  {/* <Rating name="read-only" value={rate}  size="small"  sx={{mx:5}}/> */}
                                    
                                </Box>
                                
                                
                            </Box>
                            
                            <Button size="small" variant="h3" 
                                sx={{
                                    fontSize: '0.7rem',
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
                    <Box sx={{ textAlign: 'right' }}>
                        <Button
                            component={Link}
                            to="/home/university"
                            variant="text"
                            sx={{
                                color: 'black',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                '&:hover': {
                                    color: '#B67878',
                                },
                            }}
                        >
                            Voir tout
                        </Button>
                    </Box>
                {/* Orientation Rapide */}
                <Grid
                    sx={{
                        // backgroundColor: '#F5F7FB',
                        padding: 1,
                        borderRadius: 3,
                        // boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        marginTop:2,
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    {/* 2E3B55 */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 0.5 }}>
                        Orientation rapide
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: 13, color: '#5A5A5A', mb: 2 }}>
                        Vous hésitez sur votre filière ? Faites un test d'orientation pour vous guider.
                    </Typography>
                    <Button
                        component={Link}
                        to="/home/orientation"
                        variant="contained"
                        sx={{
                            mt: 1,
                            mb: 0.5,
                            width: '100%',
                            textTransform: 'none',
                            background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                            borderRadius: 2,
                            fontWeight: 'bold',
                            fontSize: 15,
                            boxShadow: '0 2px 8px rgba(79,141,253,0.15)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #4F8DFD 0%, #38C6D9 100%)',
                            },
                        }}
                    >
                        Commencer l'orientation
                    </Button>
                </Grid>     
                {/* Evenements        */}
                <Typography  variant="h6" sx={{ fontWeight: 'bold' , mt:2 }}>Événements</Typography>
                <Box>
                    {nextEvent ? (
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
                                <Avatar sx={{ bgcolor: '#4F8DFD' }}>
                                    <EventIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2E3B55' }}>
                                        {nextEvent.title || nextEvent.name || 'Événement sans titre'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#5A5A5A', fontSize: 13 }}>
                                        {nextEvent.event_date_time ? new Date(nextEvent.event_date_time).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date à venir'}
                                    </Typography>
                                    {nextEvent.lieu && (
                                        <Typography variant="body2" sx={{ color: '#888', fontSize: 13, display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <EventIcon sx={{ fontSize: 16, mr: 0.5 }} /> {nextEvent.lieu}
                                        </Typography>
                                    )}
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
                    ) : (
                        <Box sx={{ textAlign: 'center', color: '#aaa', fontSize: 15, py: 2 }}>
                            Aucun événement à venir
                        </Box>
                    )}
                </Box>
            </>
        )}
    </>
    );
   
}
export default RightPanel
