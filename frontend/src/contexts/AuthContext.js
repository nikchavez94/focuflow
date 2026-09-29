import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
// This will hold the "global state" for our authentication.
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
// This component will wrap our entire application and provide the context values
// to all children components.
export const AuthProvider = ({ children }) => {
  // Here we will manage the actual state
  // For now, let's track the current user. null means no user is logged in.
  const [user, setUser] = useState(null);

  // We can also add login/logout functions here later.
  const login = (userData) => {
    // This will be called when the user successfully logs in
    setUser(userData);
  };

  const logout = () => {
    // This will be called to log the user out
    setUser(null);
  };

  // The 'value' object is what gets passed down to consuming components.
  // We'll pass down the user object and our login/logout functions.
  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption of the context
// This is a helper function so that other components don't have to
// import `useContext` and `AuthContext` every time.
export const useAuth = () => {
  return useContext(AuthContext);
};