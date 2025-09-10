// client/src/services/authService.js

// 1. Import axios for making HTTP requests
import axios from 'axios';

// Define the base URL for our authentication API endpoints
// This is a good practice if you have many related endpoints.
const API_URL = '/api/auth/';

/**
 * @desc    Registers a new user by sending their data to the backend.
 * @param   {object} userData An object containing { name, email, password }.
 * @returns {Promise<object>} A promise that resolves to the data returned from the API.
 *          On success, this will be the new user object and a token.
 *          On failure, the promise will be rejected with an error object.
 */
export const registerUser = async (userData) => {
  // 2. Use a try...catch block for robust error handling.
  try {
    // 3. Make the POST request to the registration endpoint.
    // We combine the API_URL with the specific endpoint 'register'.
    // The second argument, 'userData', is the request body sent to the server.
    const response = await axios.post(API_URL + 'register', userData);

    // 4. If the request is successful, return the data from the response.
    // This will typically include the user's info and a JWT.
    return response.data;

  } catch (error) {
    // 5. If an error occurs, log it and re-throw a structured error.
    console.error('API Error: User registration failed', error);
    
    // Re-throw the specific error message from the backend if available.
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('An unexpected error occurred during registration.');
    }
  }
};

/**
 * @desc    Logs in a user by sending their credentials to the backend.
 * @param   {object} credentials An object containing { email, password }.
 * @returns {Promise<object>} A promise that resolves to the data returned from the API.
 *          On success, this is critically important: it will contain the JWT.
 *          On failure, the promise will be rejected with an error object.
 */
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post("/api/auth/login", credentials);

    // ✅ Always return res.data so LoginPage can see { token, user, ... }
    return res.data;
  } catch (err) {
    // Re-throw the error in a consistent way
    throw err.response?.data || { error: "Something went wrong" };
  }
};