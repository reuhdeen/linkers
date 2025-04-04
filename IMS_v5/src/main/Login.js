import React, { useState } from 'react';
import axios from 'axios';
import crypto from 'crypto-browserify';
import { Buffer } from 'buffer';
import { Readable } from 'stream-browserify';

window.Buffer = Buffer;  // Make buffer globally available
window.Readable = Readable; // Make stream globally available

const Login = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const secretKey = 'your_secret_key';

  const validatePassword = (password) => {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  const encrypt = (data) => {
    const key = crypto.createHash('sha256').update(secretKey).digest();
    const iv = crypto.randomBytes(16); // Ensure consistent IV size
    const cipher = crypto.createCipheriv('aes-256-cfb', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64'); // Concatenate IV and cipherText
  };
  

  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Submitting login form");

      if (!validatePassword(password)) {
          alert('Password does not meet criteria.');
          return;
      }

      const encryptedUsername = encrypt(username);
      const encryptedPassword = encrypt(password);

      try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
              username: encryptedUsername,
              password: encryptedPassword,
          });

          if (response.status === 200) {
              const { accessToken, refreshToken } = response.data;
              console.log('Tokens received:', accessToken, refreshToken);

              // Store tokens
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', refreshToken);

              // Set Axios headers
              axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

              // Clear input fields
              setUsername('');
              setPassword('');

              // Pass the token back to update the parent component's state
              onLogin(accessToken, refreshToken);
          } else {
              console.error('Login failed:', response.data.message);
              alert('Login failed. Please check your credentials and try again.');
          }
      } catch (error) {
          console.error('Error during login:', error);
          alert('Login failed. Please check your credentials and try again.');
      }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
