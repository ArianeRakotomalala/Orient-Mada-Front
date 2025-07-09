import axios from 'axios';

// Crée une instance Axios
const api = axios.create({
  baseURL: '/', // à adapter si besoin
});

// Ajoute le token JWT à chaque requête si présent
api.interceptors.request.use(
  (config) => {
    // N'ajoute PAS le token pour la route de login
    if (
      config.url !== '/api/auth' && // <-- Ajoute cette condition
      config.url !== '/auth' // (au cas où)
    ) {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 