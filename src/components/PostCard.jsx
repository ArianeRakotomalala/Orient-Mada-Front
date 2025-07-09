import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useState } from "react";
import {
    Card, CardHeader, CardMedia, CardContent, CardActions,
    Avatar, IconButton, Typography, Box, Button, Snackbar, CircularProgress
} from "@mui/material";
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchoolIcon from '@mui/icons-material/School';
import DialogFavoris from "./DialogFavoris";
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';

// Fonction utilitaire pour obtenir la première lettre sans accent et en majuscule
function getFirstLetterNoAccent(str) {
    if (!str) return '';
    return str[0]
        .toLocaleUpperCase('fr-FR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function PostCard({ id, description, ville, region, srcimage, university, collections = [], loadingCollections = false, loading = false }) {
    const navigate = useNavigate();
    const { favorisUtilisateur, ajouterFavori, supprimerFavori, loadingFavoris } = useContext(UserContext);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    // Vérifie si l'université est déjà dans les favoris
    const isFavori = favorisUtilisateur.some(fav => {
        if (typeof fav.institution === 'string') {
            return fav.institution.endsWith(`/${id}`);
        } else if (fav.institution?.id) {
            return fav.institution.id === id;
        }
        return false;
    });

    // Gère le clic sur le bouton favori
    const handleFavoriClick = () => {
        if (isFavori) {
            const fav = favorisUtilisateur.find(fav => {
                if (typeof fav.institution === 'string') {
                    return fav.institution.endsWith(`/${id}`);
                } else if (fav.institution?.id) {
                    return fav.institution.id === id;
                }
                return false;
            });
            if (fav) {
                const favoriId = fav['@id'] ? fav['@id'].split('/').pop() : undefined;
                supprimerFavori(favoriId);
                setSnackbarMessage("Retiré des favoris !");
                setOpenSnackbar(true);
            }
        } else {
            setOpenDialog(true);
        }
    };

    // Redirige vers la page de l'université
    const handleViewUniversity = () => {
        navigate(`/home/university/${id}`);
    };

    // Ajoute l'université à une collection de favoris
    const handleAddToFavoris = (collectionName) => {
        ajouterFavori(collectionName, id);
        setSnackbarMessage("Ajouté aux favoris !");
        setOpenSnackbar(true);
    };

    if (loading) {
        return (
            <Card sx={{ maxWidth: 600, margin: '20px auto', borderRadius: '10px' }}>
                <CardHeader
                    avatar={<Skeleton variant="circular" width={40} height={40} />}
                    action={<Skeleton variant="circular" width={40} height={40} />}
                    title={<Skeleton variant="text" width="60%" height={32} />}
                    subheader={<Skeleton variant="text" width="40%" height={24} />}
                />
                <Skeleton variant="rectangular" height={194} />
                <CardContent>
                    <Skeleton variant="text" width="90%" height={24} />
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={24} />
                </CardContent>
                <CardActions>
                    <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 2 }} />
                </CardActions>
            </Card>
        );
    }

    return (
        <>
            <Card sx={{ maxWidth: 600, margin: '20px auto', borderRadius: '10px' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {university.charAt(0) || 'U'}
                        </Avatar>
                    }
                    title={university }
                    subheader={`${ville} , ${region}`}
                />
                <CardMedia
                    component="img"
                    height="260"
                    sx={{ objectFit: 'cover', maxHeight: 260, width: '100%', background: '#f5f5f5' }}
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
                        onClick={handleFavoriClick}
                        disabled={loadingFavoris}
                    >
                        {loadingFavoris ? (
                            <CircularProgress size={24} />
                        ) : (
                            <FavoriteIcon sx={{ color: isFavori ? red[500] : 'inherit' }} />
                        )}
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SchoolIcon />}
                        sx={{
                            background: '#f5f5f5',
                            borderRadius: '40px',
                            fontWeight: 'bold',
                            fontSize: 16,
                            textTransform: 'none',
                            color: 'black',
                            border: '1px solid transparent',
                            transition: 'all 0.3s',
                            '&:hover': {
                                border: '1px solid #B67878',
                                color: '#B67878',
                                background: '#f5f5f5',
                            },
                        }}
                        onClick={() => navigate(`/home/university/${id}`)}
                    >
                        Voir l'université
                    </Button>
                </CardActions>
            </Card>

            {/* Dialog pour ajouter aux favoris */}
            <DialogFavoris
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onAddToCollection={handleAddToFavoris}
                collections={collections}
                loadingCollections={loadingCollections}
            />

            {/* Snackbar pour feedback utilisateur */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </>
    );
}

export default PostCard;