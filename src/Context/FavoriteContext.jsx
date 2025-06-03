import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const FavorisContext = createContext();

export const useFavoris = () => useContext(FavorisContext);

export const FavorisProvider = ({ children }) => {
  const [favoris, setFavoris] = useState([]);

  useEffect(() => {
    const fetchFavoris = async () => {
      try {
        const res = await axios.get('/api/favorites');
        const data = res.data;
        setFavoris(data['hydra:member'] || data.member || []);
      } catch (error) {
        console.error("Erreur lors du chargement des favoris :", error);
      }
    };

    fetchFavoris();
  }, []);
    
  const ajouterFavori = async (collectionName, institution_id, user_id) => {
    try {
      const res = await axios.post(
        '/api/favorites',
        {
          collection_name: collectionName,
          institution: `/api/institutions/${institution_id}`,
          user: `/api/users/${user_id}`,
        },
        {
          headers: {
            'Content-Type': 'application/ld+json'
          }
        }
      );
      const nouveauFavori = res.data;
      setFavoris(prev => [...prev, nouveauFavori]);
    } catch (error) {
      if (error.response) {
        console.error("Erreur lors de l'ajout du favori :", error.response.data);
      } else {
        console.error("Erreur réseau lors de l'ajout du favori :", error);
      }
    }
  };

  const supprimerFavori = async (favoriId) => {
    try {
      await axios.delete(`/api/favorites/${favoriId}`);
      setFavoris(prev => prev.filter(fav => {
        // fav.id peut ne pas exister, donc on extrait l'id depuis @id si besoin
        const id = fav.id || (fav['@id'] ? fav['@id'].split('/').pop() : undefined);
        return id !== favoriId;
      }));
    } catch (error) {
      if (error.response) {
        console.error("Erreur lors de la suppression du favori :", error.response.data);
      } else {
        console.error("Erreur réseau lors de la suppression :", error);
      }
    }
  };

  const estFavori = (institution_id) => {
    return favorisUtilisateur.some(fav => {
      if (typeof fav.institution === 'string') {
        return fav.institution.endsWith(`/${institution_id}`);
      } else if (fav.institution?.id) {
        return fav.institution.id === institution_id;
      }
      return false;
    });
  };

  // Filtrer les favoris pour ne garder que ceux de l'utilisateur connecté
  const userInfo = JSON.parse(localStorage.getItem('user_info'));
  const userId = userInfo?.id;
  const favorisUtilisateur = favoris.filter(fav => {
    if (typeof fav.user === "string") {
      return fav.user.endsWith(`/${userId}`);
    } else if (fav.user?.id) {
      return fav.user.id === userId;
    }
    return false;
  });

  return (
    <FavorisContext.Provider value={{
      favoris: favorisUtilisateur,
      ajouterFavori,
      supprimerFavori,
      estFavori
    }}>
      {children}
    </FavorisContext.Provider>
  );
};