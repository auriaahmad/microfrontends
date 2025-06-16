// src/Navigation.js - Host App
import React from 'react';
import { useJWT } from './JWTContext';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const { isAuthenticated, user } = useJWT();

  const navStyle = {
    backgroundColor: '#2196F3',
    padding: '15px 20px',
    marginBottom: '20px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonStyle = (isActive) => ({
    backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    fontWeight: isActive ? 'bold' : 'normal'
  });

  return (
    <nav style={navStyle}>
      <div>
        <button 
          onClick={() => setCurrentPage('home')}
          style={buttonStyle(currentPage === 'home')}
        >
          🏠 Home
        </button>
        <button 
          onClick={() => setCurrentPage('profile')}
          style={{
            ...buttonStyle(currentPage === 'profile'),
            opacity: !isAuthenticated ? 0.5 : 1,
            cursor: !isAuthenticated ? 'not-allowed' : 'pointer'
          }}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? 'Login required to access profile' : 'View your profile'}
        >
          👤 Profile {!isAuthenticated && '🔒'}
        </button>
      </div>
      
      <div style={{ color: 'white', fontSize: '14px' }}>
        {isAuthenticated ? (
          <span>
            Welcome, <strong>{user.username}</strong> ({user.role})
          </span>
        ) : (
          <span>Not authenticated</span>
        )}
      </div>
    </nav>
  );
};

export default Navigation;