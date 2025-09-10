// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import './Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log('Registration successful:', response);
      setSuccess('Registration successful! Please log in.');
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      const errorMessage = err.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join us to start creating your own short links!</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Choose a strong password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary auth-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          {error && <div className="message error-message">{error}</div>}
          {success && <div className="message success-message">{success}</div>}
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;