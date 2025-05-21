// // import {
// //   FormControl,
// //   InputLabel,
// //   OutlinedInput,
// //   InputAdornment,
// //   FormHelperText,
// //   Input
// // } from '@mui/material';
// // function Try({ label, icone }) {
// //     return (
// // <FormControl variant="standard">
// //         <InputLabel htmlFor="input-with-icon-adornment">
// //           {label}
// //         </InputLabel>
// //         <Input
// //           id="input-with-icon-adornment"
// //           startAdornment={
// //             <InputAdornment position="start">
// //               {icone}
// //             </InputAdornment>
// //           }
// //         />
// // </FormControl>
// //     );
// // }

// // export default Try;

// // LoginForm.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const LoginForm = () => {
//   const [inputs, setInputs] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://votre-api-symfony/login_check', {
//         username: inputs.email,
//         password: inputs.password
//       });
      
//       // Stockage du JWT dans localStorage
//       localStorage.setItem('jwtToken', response.data.token);
//       window.location.href = '/dashboard'; // Redirection après connexion
//     } catch (err) {
//       setError('Identifiants incorrects');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input 
//         type="email" 
//         name="email" 
//         onChange={(e) => setInputs({...inputs, email: e.target.value})}
//         required 
//       />
//       <input
//         type="password"
//         name="password"
//         onChange={(e) => setInputs({...inputs, password: e.target.value})}
//         required
//       />
//       {error && <div className="error">{error}</div>}
//       <button type="submit">Se connecter</button>
//     </form>
//   );
// };
// ///expliquer ca donc svp de a a z le fonctionnement ?

// // src/services/auth.js
// import axios from 'axios';

// export const login = async ({ email, password }) => {
//   const response = await axios.post('http://votre-api-symfony/login_check', {
//     username: email,
//     password: password,
//   });
//   return response.data.token;
// };
