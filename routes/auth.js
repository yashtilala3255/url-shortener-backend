// routes/auth.js

const express = require('express');
// --- UPDATE THIS IMPORT ---
// Import both controller functions using destructuring.
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and get a token
 * @access  Public
 */
// --- UPDATE THIS LINE ---
// We replace the placeholder function with a reference to our new 'loginUser' controller.
router.post('/login', loginUser);

module.exports = router;