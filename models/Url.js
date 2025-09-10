// models/Url.js

const mongoose = require('mongoose');

// Define the schema for our URL model
const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  urlCode: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // --- ADD THIS NEW FIELD BELOW ---
  // This field establishes the relationship between a URL and the user who created it.
  user: {
    // We are storing the user's unique MongoDB ID (_id).
    type: mongoose.Schema.Types.ObjectId,
    // The 'ref' property tells Mongoose that this ID refers to a document
    // in the 'User' collection. This is crucial for using Mongoose's 'populate' feature later.
    ref: 'User',
    // This field is not strictly required. This is a design choice that allows us to
    // still support the original functionality where anonymous, non-logged-in users can create short links.
    // If a link is created by a guest, this field will simply be empty.
    required: false,
  },
});

// Create and export the Url model based on the schema
module.exports = mongoose.model('Url', urlSchema);
