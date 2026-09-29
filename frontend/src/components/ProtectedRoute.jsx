// component that checks if a user is logged in, if not they go to login page. Shows "Dashboard/Logout" for logged-in Users only. 
// The component will use out useAuth hook that we created to check for a user

// focuflow/frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// This component is a "wrapper" for any route we want to protect.
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Get the current user from our context

  if (!user) {
    // If there is no user, redirect them to the /login page.
    // The `replace` prop is used to replace the current entry in the
    // history stack instead of pushing a new one, which is better for login flows.
    return <Navigate to="/login" replace />;
  }

  // If there IS a user, render the children components that were passed in.
  // In our case, this will be the DashboardPage.
  return children;
};

export default ProtectedRoute;