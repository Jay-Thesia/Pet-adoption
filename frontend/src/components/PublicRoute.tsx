import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactElement;
}

/**
 * PublicRoute component redirects authenticated users away from public pages
 * (like login/register) to the home page
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  // If user is authenticated, redirect to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, show the public page (login/register)
  return children;
};

export default PublicRoute;

