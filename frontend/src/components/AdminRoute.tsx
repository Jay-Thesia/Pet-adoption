import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'admin' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;

