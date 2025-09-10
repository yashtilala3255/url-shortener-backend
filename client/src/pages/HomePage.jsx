// client/src/pages/HomePage.jsx
import React, { useState } from 'react';
import { createShortUrl } from '../services/apiService';
import './HomePage.css';

const HomePage = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrlData, setShortUrlData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCopied(false);

    if (!longUrl) {
      setError('Please enter a URL to shorten.');
      setShortUrlData(null);
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      const response = await createShortUrl(longUrl);
      setShortUrlData(response.data);
    } catch (err) {
      const errorMessage = err.error || 'An unexpected error occurred.';
      setError(errorMessage);
      setShortUrlData(null);
      console.error('Error from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrlData?.shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrlData.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      setError('Failed to copy URL.');
    }
  };

  return (
    <div className="page-container">
      <div className="home-container">
        <div className="hero-section">
          <h1>Shorten Your Long URLs</h1>
          <p className="hero-subtitle">Make your links shorter, easier to share, and track clicks - all for free!</p>
        </div>

        <form onSubmit={handleSubmit} className="url-form">
          <div className="input-group">
            <input
              type="url"
              placeholder="Paste your long URL here..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
              className="url-input"
            />
            <button 
              type="submit" 
              className="btn btn-primary shorten-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="message error-message">
            <span className="icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {shortUrlData && (
          <div className="result-container">
            <h3>Your Short URL is Ready!</h3>
            <div className="result-box">
              <div className="short-url-display">
                <a 
                  href={shortUrlData.shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="short-url-link"
                >
                  {shortUrlData.shortUrl}
                </a>
                <button 
                  onClick={handleCopy} 
                  className={`btn copy-btn ${copied ? 'copied' : ''}`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="original-url">
                Original: <span title={shortUrlData.longUrl}>{shortUrlData.longUrl.substring(0, 60)}...</span>
              </p>
            </div>
          </div>
        )}

        <div className="features-section">
          <h2>Why Use Our URL Shortener?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast & Simple</h3>
              <p>Shorten your URLs in seconds with our easy-to-use tool.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Click Analytics</h3>
              <p>Track how many clicks your shortened URLs receive.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Links</h3>
              <p>All shortened URLs are checked for security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;