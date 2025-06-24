import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ListUserContext = createContext();

export const ListUserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/users');
                const data = response.data;
                const userList = data['hydra:member'] || data.member || (Array.isArray(data) ? data : []);
                setUsers(userList);
                setError(null);
            } catch (err) {
                console.error("Erreur lors du chargement des utilisateurs :", err);
                setError(err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <ListUserContext.Provider value={{ users, loading, error }}>
            {children}
        </ListUserContext.Provider>
    );
}; 