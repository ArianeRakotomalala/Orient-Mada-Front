import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ListUserContext = createContext();

export const ListUserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfilsList, setUserProfilsList] = useState([]);

    useEffect(() => {
        const fetchUsersAndProfils = async () => {
            try {
                setLoading(true);
                // Récupérer tous les utilisateurs
                const response = await axios.get('/api/users');
                const data = response.data;
                const userList = data['hydra:member'] || data.member || (Array.isArray(data) ? data : []);
                // Récupérer tous les profils utilisateurs
                const profilsRes = await axios.get('/api/users_profils');
                const profilsData = profilsRes.data;
                const profilsList = profilsData['hydra:member'] || profilsData.member || (Array.isArray(profilsData) ? profilsData : []);
                setUserProfilsList(profilsList);
                // Associer chaque user à son profil (par user IRI ou id)
                const usersWithProfil = userList.map(user => {
                    // Le champ user dans le profil est souvent un IRI du type /api/users/ID
                    const profil = profilsList.find(p => {
                        if (typeof p.user === 'string') {
                            return p.user.endsWith(`/${user.id}`);
                        } else if (p.user?.id) {
                            return String(p.user.id) === String(user.id);
                        }
                        return false;
                    });
                    return { ...user, profil };
                });
                setUsers(usersWithProfil);
                setError(null);
            } catch (err) {
                console.error("Erreur lors du chargement des utilisateurs ou profils :", err);
                setError(err);
                setUsers([]);
                setUserProfilsList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersAndProfils();
    }, []);

    return (
        <ListUserContext.Provider value={{ users, loading, error, userProfilsList }}>
            {children}
        </ListUserContext.Provider>
    );
}; 