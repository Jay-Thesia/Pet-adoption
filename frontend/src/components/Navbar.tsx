import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            🐾 Pet Adoption
          </Link>
          <div className="navbar-links">
            {user && <Link to="/home">Home</Link>}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin">Admin Dashboard</Link>
                )}
                <Link to="/dashboard">My Applications</Link>
                <span className="navbar-user">Hello, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

