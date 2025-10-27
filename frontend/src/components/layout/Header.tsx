import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import './Header.css';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-logo">
            <h1>FUT Draft</h1>
          </Link>

          {user ? (
            <>
              <nav className="header-nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/team-battle" className="nav-link">Team Battle</Link>
                <Link to="/draft-battle" className="nav-link">Draft Battle</Link>
                <Link to="/my-players" className="nav-link">My Players</Link>
              </nav>

              <div className="header-user">
                <span className="user-name">{user.username}</span>
                <Button variant="ghost" size="small" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="header-auth">
              <Link to="/login">
                <Button variant="ghost" size="small">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="small">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
