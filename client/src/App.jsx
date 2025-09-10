// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// --- CHANGE 1: Import the PrivateRoute component ---
// We need to import our gatekeeper component to use it in our routes.
import PrivateRoute from './components/PrivateRoute';

// It's good practice to have a simple layout component, but for now,
// we can keep the structure as is. A Navbar could be added here later.
function App() {
  return (
    <Router>
      <div className="container">
        {/* You could add a <Navbar /> component here */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- CHANGE 2: Wrap the Dashboard route with PrivateRoute --- */}
          {/* This is the core change. We are now protecting the dashboard. */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          
          {/* You can add a 404 Not Found route here later */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;