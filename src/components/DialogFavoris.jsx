import React, { useContext, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { UserContext } from "../Context/UserContext";
import { useNavigate } from 'react-router-dom';

export default function DialogFavoris({
  open,
  onClose,
  onAddToCollection,
  collections = [],
  loadingCollections = false
}) {
  const { favoris, loadingFavoris, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');

  // Filtre les favoris pour ne garder que ceux de l'utilisateur connecté
  const favorisUtilisateur = favoris.filter(fav => {
    if (!user?.id) return false;
    if (typeof fav.user === "string") {
      return fav.user.endsWith(`/${user.id}`);
    } else if (fav.user?.id) {
      return fav.user.id === user.id;
    }
    return false;
  });

  // Extraire tous les noms de collections uniques depuis les favoris de l'utilisateur
  const collectionNames = [...new Set(favorisUtilisateur.map(fav => fav.collection_name).filter(Boolean))];

  const handleSubmit = () => {
    const collectionName = newCollectionName.trim() || selectedCollection;
    if (collectionName) {
      onAddToCollection(collectionName);
      onClose();
      setSelectedCollection('');
      setNewCollectionName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {(!user || !user.id) ? (
        <>
          <DialogTitle>Connexion requise</DialogTitle>
          <DialogContent>
            <Box sx={{ minWidth: 300, mt: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                Vous êtes déconnecté.<br/>Connectez-vous pour bénéficier de cette fonctionnalité (ajout aux favoris).
              </Typography>
              <Button variant="contained" color="primary" onClick={() => { onClose(); navigate('/login'); }}>
                Se connecter
              </Button>
            </Box>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogTitle>Ajouter aux favoris</DialogTitle>
          <DialogContent>
            {loadingFavoris ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : loadingCollections ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={80}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ minWidth: 300, mt: 2 }}>
                <FormControl fullWidth margin="normal" disabled={newCollectionName.trim().length > 0}>
                  <InputLabel>Choisir une collection</InputLabel>
                  <Select
                    value={selectedCollection}
                    label="Choisir une collection"
                    onChange={(e) => setSelectedCollection(e.target.value)}
                  >
                    {collectionNames.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ou
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Créer une nouvelle collection"
                  placeholder="Nom nouvelle collection"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Annuler</Button>
            <Button 
              onClick={handleSubmit}
              disabled={!newCollectionName.trim() && !selectedCollection}
            >
              Ajouter
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}