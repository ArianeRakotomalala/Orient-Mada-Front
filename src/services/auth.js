import axios from 'axios';
const login = async ({ email, password }) => {
  const response = await axios.post('/api/auth', {
    email: email,
    password: password,
  });
 return {
    token: response.data.token,
    user: response.data.user
 }
};
export default login;