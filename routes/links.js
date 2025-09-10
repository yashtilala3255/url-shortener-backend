// routes/links.js

// Import the Express framework
const express = require('express');
// Create a new router object
const router = express.Router();

// --- ADD THIS IMPORT ---
// Import our authentication middleware. This is the 'gatekeeper' for our private routes.
const auth = require('../middleware/auth');
const { getMyLinks } = require('../controllers/linksController');

/**
 * @route   GET /api/links/my-links
 * @desc    Get all links created by the logged-in user
 * @access  Private
 */
// --- UPDATE THIS LINE ---
// We insert the 'auth' middleware function right before our route handler.
// Express will now execute 'auth' first. If it succeeds (i.e., calls next()),
// then the final (req, res) => { ... } handler will be executed.
router.get('/my-links', auth, (req, res) => {
  // We'll replace this placeholder with a real controller in the next task.
  // For now, if we get here, it means the middleware has run.
  res.status(200).json({
    success: true,
    message: 'My Links route is working! (Middleware was applied)',
  });
});

// Export the router
module.exports = router;