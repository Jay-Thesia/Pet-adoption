import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

/**
 * AuthGuard component handles the root route logic:
 * - Shows login/register for unauthenticated users
 * - Redirects authenticated users to home page
 */
const AuthGuard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  // If user is authenticated, show home page
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, show login page
  return <Login />;
};

export default AuthGuard;

