import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const [userProfils, setUserProfils] = useState(null);

  useEffect(() => {
    const connectedUser = JSON.parse(localStorage.getItem("user_info"));

    if (connectedUser) {
      setUser(connectedUser);

      // Chargement des favoris
      axios
        .get(`http://localhost:8000/api/favorites`, {
          params: { user_id: connectedUser.id },
        })
        .then((response) => {
          setFavoris(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des favoris :", error);
        });

      // Chargement du profil utilisateur si l'id existe
      if (connectedUser.user_profils_id_id) {
        axios
          .get(`http://localhost:8000/api/users_profils`, {
            params: { user_profils_id_id: connectedUser.user_profils_id_id },
          })
          .then((response) => {
            // On récupère le premier élément dans member (tableau)
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
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, favoris, setFavoris, userProfils, setUserProfils }}
    >
      {children}
    </UserContext.Provider>
  );
};
