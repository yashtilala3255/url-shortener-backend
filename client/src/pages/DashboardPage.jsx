// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserLinks } from '../services/linkService';
import './Dashboard.css';

const DashboardPage = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        if (!token) {
          setError('No token found. Please login.');
          setIsLoading(false);
          return;
        }
        
        console.log('Fetching links with token:', token);
        const response = await getUserLinks(token);
        
        // Handle different possible response structures
        let linksData = [];
        
        if (Array.isArray(response.data)) {
          // Case 1: Response data is directly an array
          linksData = response.data;
        } else if (response.data && Array.isArray(response.data.links)) {
          // Case 2: Response data has a links property that is an array
          linksData = response.data.links;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Case 3: Response data has a data property that is an array
          linksData = response.data.data;
        } else if (response.links && Array.isArray(response.links)) {
          // Case 4: Response itself has a links property that is an array
          linksData = response.links;
        } else {
          console.error('Unexpected API response structure:', response);
          setError('Unexpected response format from server.');
        }
        
        setLinks(linksData);
      } catch (err) {
        console.error('Failed to fetch links:', err);
        if (err.response?.status === 401) {
          // Unauthorized: token invalid => log out
          logout();
          navigate('/login');
        } else {
          const errorMessage = err.response?.data?.error || 
                             err.message || 
                             'Could not load your links. Please try again later.';
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLinks();
  }, [token, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      setError('Failed to copy URL. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Function to ensure URL has proper protocol
  const ensureUrlProtocol = (url) => {
    if (!url) return '#';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="page-container">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back{user?.name ? `, ${user.name}` : ''}!</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Links</h3>
            <p className="stat-number">{links.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Clicks</h3>
            <p className="stat-number">
              {links.reduce((total, link) => total + (link.clicks || 0), 0)}
            </p>
          </div>
        </div>

        <div className="links-section">
          <div className="section-header">
            <h2>Your Short Links</h2>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Create New
            </button>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your links...</p>
            </div>
          ) : error ? (
            <div className="message error-message">
              <span className="icon">⚠️</span>
              <p>{error}</p>
            </div>
          ) : links.length > 0 ? (
            <div className="links-table-container">
              <table className="links-table">
                <thead>
                  <tr>
                    <th>Short URL</th>
                    <th>Original URL</th>
                    <th>Clicks</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link._id || link.id}>
                      <td>
                        <a
                          href={ensureUrlProtocol(link.shortUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="short-url"
                        >
                          {link.shortUrl}
                        </a>
                      </td>
                      <td className="long-url-cell">
                        <span title={link.longUrl}>
                          {link.longUrl ? 
                            (link.longUrl.length > 40 
                              ? `${link.longUrl.substring(0, 40)}...` 
                              : link.longUrl)
                            : 'N/A'
                          }
                        </span>
                      </td>
                      <td className="clicks-cell">
                        <span className="clicks-badge">{link.clicks || 0}</span>
                      </td>
                      <td className="date-cell">{formatDate(link.createdAt)}</td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleCopy(ensureUrlProtocol(link.shortUrl), link._id || link.id)}
                          className={`btn icon-btn ${
                            copiedId === (link._id || link.id) ? 'copied' : ''
                          }`}
                        >
                          {copiedId === (link._id || link.id) ? 'Copied!' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔗</div>
              <h3>No links yet</h3>
              <p>You haven&apos;t created any short links yet.</p>
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                Create Your First Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;