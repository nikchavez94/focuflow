// focuflow/frontend/src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import our new api service

const SignupPage = () => {
  // State to hold the form input values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold any error messages
  
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle the form submission
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setError(''); // Clear previous errors

    try {
      // Make a POST request to our backend's register endpoint
      await api.post('/auth/register', {
        name: name,
        email: email,
        password: password,
      });
      
      // If signup is successful, navigate to the login page
      alert('Signup successful! Please log in.');
      navigate('/login');

    } catch (err) {
      // If there's an error, display it
      console.error("Signup error:", err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.error || "An unknown error occurred.";
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Display any error messages here */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;