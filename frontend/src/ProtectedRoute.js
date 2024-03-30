import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  if (isLoggedIn === undefined || isLoggedIn === 'false' ) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }

  return children; // Render child component if logged in
};

export default ProtectedRoute;