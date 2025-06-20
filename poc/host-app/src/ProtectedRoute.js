// src/ProtectedRoute.js - Host App (Updated for better compatibility)
import React from 'react';
import { useJWT } from './JWTContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user, logout } = useJWT();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '20px 0'
      }}>
        <div style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>
          🔄 Checking authentication...
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e3f2fd',
          borderTop: '4px solid #2196f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }} />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '20px 0'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
        <h2 style={{ color: '#f44336', marginBottom: '15px' }}>
          Access Denied
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This page requires authentication. Please login using the Remote Authentication Component above.
        </p>
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#fff3e0',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#ff9800'
        }}>
          Debug: isAuthenticated={isAuthenticated.toString()}, hasUser={!!user}
        </div>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return (
    <div>
      {/* Show user info at the top of protected pages */}
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px',
        border: '1px solid #4CAF50',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <strong>🔓 Authenticated as:</strong> {user?.username} ({user?.role})
        </div>
        <button 
          onClick={logout}
          style={{
            padding: '5px 10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Logout
        </button>
      </div>
      
      {children}
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProtectedRoute;