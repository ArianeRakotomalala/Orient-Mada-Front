import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const [userProfils, setUserProfils] = useState(null);
  const [loadingFavoris, setLoadingFavoris] = useState(false);

  const fetchFavoris = async () => {
    if (!user?.id) return;
    setLoadingFavoris(true);
    try {
      const response = await axios.get(`/api/favorites`, {
        params: { user: user.id },
      });
      // Compatibilité hydra:member/member/array
      const data = response.data;
      const favorisArr = data['hydra:member'] || data.member || (Array.isArray(data) ? data : []);
      setFavoris(favorisArr);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris :", error);
      setFavoris([]);
    } finally {
      setLoadingFavoris(false);
    }
  };

  // Favoris de l'utilisateur connecté
  const favorisUtilisateur = favoris.filter(fav => {
    if (!user?.id) return false;
    if (typeof fav.user === "string") {
      return fav.user.endsWith(`/${user.id}`);
    } else if (fav.user?.id) {
      return fav.user.id === user.id;
    }
    return false;
  });

  const ajouterFavori = async (collectionName, institution_id) => {
    if (!user?.id) {
      console.warn("Tentative d'ajout de favori sans utilisateur connecté");
      return false;
    }
    try {
      const res = await axios.post(
        '/api/favorites',
        {
          collection_name: collectionName,
          institution: `/api/institutions/${institution_id}`,
          user: `/api/users/${user.id}`,
        },
        {
          headers: {
            'Content-Type': 'application/ld+json'
          }
        }
      );
      const nouveauFavori = res.data;
      setFavoris(prev => [...prev, nouveauFavori]); // optimistic update
      await fetchFavoris(); // sync avec la BDD
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du favori :", error);
      return false;
    }
  };

  const supprimerFavori = async (favoriId) => {
    if (!favoriId) {
      console.warn("Tentative de suppression de favori sans ID");
      return false;
    }
    try {
      await axios.delete(`/api/favorites/${favoriId}`);
      setFavoris(prev => prev.filter(fav => {
        const id = fav.id || (fav['@id'] ? fav['@id'].split('/').pop() : undefined);
        return id !== favoriId;
      })); // optimistic update
      await fetchFavoris(); // sync avec la BDD
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du favori :", error);
      return false;
    }
  };

  const estFavori = (institution_id) => {
    if (!institution_id || !Array.isArray(favoris)) return false;
    
    return favoris.some(fav => {
      if (typeof fav.institution === 'string') {
        return fav.institution.endsWith(`/${institution_id}`);
      } else if (fav.institution?.id) {
        return fav.institution.id === institution_id;
      }
      return false;
    });
  };

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("user_info");
      if (!userInfo) {
        console.log("Aucun utilisateur connecté");
        return;
      }

      const connectedUser = JSON.parse(userInfo);
      if (!connectedUser) {
        console.log("Données utilisateur invalides");
        return;
      }

      setUser(connectedUser);

      // Chargement du profil utilisateur si l'id existe
      if (connectedUser.user_profils_id_id) {
        axios
          .get(`/api/users_profils`, {
            params: { user_profils_id_id: connectedUser.user_profils_id_id },
          })
          .then((response) => {
            const profils = response.data;
            const firstProfil =
              profils.member && profils.member.length > 0 ? profils.member[0] : null;

            if (firstProfil) {
              setUserProfils(firstProfil);
            } else {
              console.warn("Aucun profil utilisateur trouvé dans la réponse.");
              setUserProfils(null);
            }
          })
          .catch((error) => {
            console.error("Erreur lors du chargement du profil utilisateur :", error);
            setUserProfils(null);
          });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error);
      // Nettoyer le localStorage si les données sont corrompues
      localStorage.removeItem("user_info");
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchFavoris();
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ 
        user, 
        setUser, 
        favoris, 
        setFavoris, 
        userProfils, 
        setUserProfils,
        ajouterFavori,
        supprimerFavori,
        estFavori,
        loadingFavoris,
        favorisUtilisateur
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
