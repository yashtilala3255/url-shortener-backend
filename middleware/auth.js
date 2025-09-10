// middleware/auth.js

// Import the jsonwebtoken library to verify the token
const jwt = require('jsonwebtoken');

/**
 * @desc This middleware function verifies the JWT sent by the client.
 * If the token is valid, it attaches the decoded user payload to the request object.
 * If a token is present but invalid, it sends a 401 Unauthorized response.
 * If no token is present, it simply moves on to the next function.
 */
const auth = (req, res, next) => {
  // 1. Get the token from the request header.
  const token = req.header('x-auth-token');

  // 2. Check if a token was provided.
  // --- THIS IS THE CRUCIAL CHANGE ---
  // If no token is found, we don't send an error.
  // We simply call next() to proceed without an authenticated user.
  // The req.user will be undefined in the next handlers.
  if (!token) {
    return next();
  }

  // 3. Verify the token if it exists.
  try {
    // jwt.verify() decodes the token and validates its signature.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user payload to the request object.
    req.user = decoded.user;

    // 5. Pass control to the next middleware or route handler.
    next();

  } catch (err) {
    // This block catches errors from an invalid or expired token.
    console.error('Token verification failed:', err.message);
    res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

// Export the middleware function
module.exports = auth;