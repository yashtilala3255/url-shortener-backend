// server.js

require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');

connectDB();
const app = express();

app.use(express.json());

// --- Define Routes ---
// The order of these API route handlers does not strictly matter,
// but it's good practice to group them.

// Mount the API routes for URL shortening
const urlRoutes = require('./routes/urls');
app.use('/api', urlRoutes);

// Mount the API routes for authentication
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// --- ADD THIS NEW ROUTE HANDLER ---
// Mount the API routes for fetching user-specific links
const linksRoutes = require('./routes/links');
app.use('/api/links', linksRoutes);

// Mount the index/redirect routes (should be last for catch-all)
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is alive and running on port ${PORT}`));