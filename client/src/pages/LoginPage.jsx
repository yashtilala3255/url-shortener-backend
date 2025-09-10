import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser({ email, password });
      // Expect data = { token, user, ... }
      if (data.token && data.user) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError('Login succeeded but server did not return token/user.');
      }
    } catch (err) {
      setError(err.error || err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p style={{color:'red'}}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
