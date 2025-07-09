import api from './axios';

const login = async ({ email, password }) => {
  const response = await api.post('/api/auth', {
    email: email,
    password: password,
  });
  return {
    token: response.data.token,
    user: response.data.user
  }
};

export default login;