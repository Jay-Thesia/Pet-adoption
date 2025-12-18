import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

const AuthGuard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Login />;
};

export default AuthGuard;

