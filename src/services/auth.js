import axios from 'axios';
const login = async ({ email, password }) => {
  const response = await axios.post('/api/auth', {
    email: email,
    password: password,
  });
  return response.data.token;
};
export default login;