import { useFavoris } from "../Context/FavoriteContext.jsx";
import { useState } from "react";
import {
    Card, CardHeader, CardMedia, CardContent, CardActions,
    Avatar, IconButton, Typography, Box, Button, Snackbar
} from "@mui/material";
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchoolIcon from '@mui/icons-material/School';
import DialogFavoris from "./DialogFavoris";

function PostCard({ id, description, ville, srcimage, university, collections = [], loadingCollections = false }) {
    const { favoris, ajouterFavori, supprimerFavori } = useFavoris();
    console.log("favoris:", favoris); 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const isFavori = favoris.some(fav => {
      if (typeof fav.institution === 'string') {
        return fav.institution.endsWith(`/${id}`);
      } else if (fav.institution?.id) {
        return fav.institution.id === id;
      }
      return false;
    });

    const handleFavoriClick = () => {
        if (isFavori) {  
            const fav = favoris.find(fav => {
              if (typeof fav.institution === 'string') {
                return fav.institution.endsWith(`/${id}`);
              } else if (fav.institution?.id) {
                return fav.institution.id === id;
              }
              return false;
            });
            if (fav) {
                // Extraire l'id numérique depuis fav['@id']
                const favoriId = fav['@id'] ? fav['@id'].split('/').pop() : undefined;
                supprimerFavori(favoriId);
                setSnackbarMessage("Retiré des favoris !");
                setOpenSnackbar(true);
            }
        } else {
            setOpenDialog(true);
        }
    };

  
   const handleAddToFavoris = (collectionName) => {
        const userInfo = JSON.parse(localStorage.getItem('user_info'));
        const userId = userInfo?.id;
        if (!userId) {
            alert("Utilisateur non connecté !");
            return;
        }
        ajouterFavori(collectionName, id, userId); // `id` = institution_id
        setSnackbarMessage("Ajouté aux favoris !");
        setOpenSnackbar(true);
    };

    return (
        <>
            <Card sx={{ maxWidth: 600, margin: '20px auto', borderRadius: '10px' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[900], color: 'white' }} aria-label="university">
                            {university?.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={university}
                    subheader={ville}
                />
                <CardMedia
                    component="img"
                    height="194"
                    image={srcimage}
                    alt={university}
                />
                <CardContent>
                    <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                        {description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        aria-label="add to favorites"
                        onClick={handleFavoriClick}
                    >
                        <FavoriteIcon sx={{ color: isFavori ? red[500] : 'inherit' }} />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        variant="contained"
                        startIcon={<SchoolIcon />}
                        sx={{
                            backgroundColor: 'white',
                            color: "black",
                            borderRadius: "30px",
                            textTransform: "none",
                            fontWeight: "bold",
                            px: 3,
                            py: 1,
                            '&:hover': {
                                background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                                color: 'white',
                            },
                        }}
                    >
                        Voir l'université
                    </Button>
                </CardActions>
            </Card>

            <DialogFavoris
                ouvert={openDialog}
                onFermer={() => setOpenDialog(false)}
                onAjouter={(collectionName) => {
                    handleAddToFavoris(collectionName);
                    setOpenDialog(false);
                }}
                collections={collections}
                loadingCollections={loadingCollections}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{color:"green"}}
            />
        </>
    );
}

export default PostCard;