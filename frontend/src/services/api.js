// focuflow/frontend/src/services/api.js
import axios from 'axios';
import { auth } from '../firebase'; // Import auth from our firebase.js setup

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// This is an "interceptor". It's a function that runs
// BEFORE each request made with this 'api' instance is sent.
api.interceptors.request.use(async (config) => {
  // Get the current user from the Firebase auth state.
  const user = auth.currentUser;

  if (user) {
    // If a user is logged in, get their ID token.
    // This token proves to our backend who the user is.
    const token = await user.getIdToken();
    // Attach the token to the request's Authorization header.
    // The 'Bearer' scheme is a standard convention.
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config; // Continue with the modified request
}, (error) => {
  // Handle any errors during the request setup
  return Promise.reject(error);
});

export default api;