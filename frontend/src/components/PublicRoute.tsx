import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;

