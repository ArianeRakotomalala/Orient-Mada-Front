import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Box
} from '@mui/material';
import { useFavoris } from "../Context/FavoriteContext.jsx";

export default function DialogFavoris({
  ouvert,
  onFermer,
  onAjouter,
  loadingCollections = false
}) {
  const { favoris } = useFavoris();

  // Récupère l'ID utilisateur connecté
  const userInfo = JSON.parse(localStorage.getItem('user_info'));
  const userId = userInfo?.id;

  // Filtre les favoris pour ne garder que ceux de l'utilisateur connecté
  const favorisUtilisateur = favoris.filter(fav => {
    if (typeof fav.user === "string") {
      return fav.user.endsWith(`/${userId}`);
    } else if (fav.user?.id) {
      return fav.user.id === userId;
    }
    return false;
  });

  // Extraire tous les noms de collections uniques depuis les favoris de l'utilisateur
  const collectionNames = [...new Set(favorisUtilisateur.map(fav => fav.collection_name).filter(Boolean))];

  const [nouvelleCollection, setNouvelleCollection] = useState('');
  const [collectionSelectionnee, setCollectionSelectionnee] = useState('');

  useEffect(() => {
    if (collectionNames.length > 0) {
      setCollectionSelectionnee(collectionNames[0]);
    } else {
      setCollectionSelectionnee('');
    }
  }, [collectionNames]);

  const handleAjouter = () => {
    const collectionFinale = nouvelleCollection.trim() || collectionSelectionnee;
    if (!collectionFinale) return alert("Merci de choisir ou créer une collection.");
    onAjouter(collectionFinale);
  };

  return (
    <Dialog open={ouvert} onClose={onFermer} maxWidth="xs" fullWidth>
      <DialogTitle>Ajouter aux favoris</DialogTitle>
      <DialogContent>
        {loadingCollections ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={80}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FormControl fullWidth margin="normal" disabled={nouvelleCollection.trim().length > 0}>
              <InputLabel id="select-collection-label">Choisir une collection</InputLabel>
              <Select
                labelId="select-collection-label"
                value={collectionSelectionnee}
                label="Choisir une collection"
                onChange={e => setCollectionSelectionnee(e.target.value)}
              >
                {collectionNames.map(name => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Ou créer une nouvelle collection"
              placeholder="Nom nouvelle collection"
              value={nouvelleCollection}
              onChange={e => setNouvelleCollection(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onFermer} color="secondary">Annuler</Button>
        <Button
          onClick={handleAjouter}
          variant="contained"
          color="primary"
          disabled={loadingCollections || (!nouvelleCollection.trim() && !collectionSelectionnee)}
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}