import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { lookupUser } from '../services/firebaseconfig'; 
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const user = await login(email, password);
        // Retrieve ID token
        const idToken = await user.getIdToken();
        // Use lookupUser function to check for custom claims
        const userInfo = await lookupUser(idToken);

        console.log('User info:', userInfo); // 

        if (userInfo && userInfo.superuser) {
            console.log('Superuser logged in');
            navigate('/dashboard');
        } else {
            setError('Not authorized as superuser');
        }
    } catch (error) {
        setError(error.message);
    }
};
  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
