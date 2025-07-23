// src/ProtectedRoute.js - Fixed Protected Route with Better Loading Logic
import React, { useState, useEffect } from 'react';
import { useJWT } from './JWTContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user, logout } = useJWT();
  const [initialCheck, setInitialCheck] = useState(true);

  // Give extra time for auth initialization on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialCheck(false);
    }, 2000); // Wait 2 seconds for auth to properly initialize
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading while doing initial check OR context is loading
  if (initialCheck || isLoading) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '20px 0'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #e3f2fd',
          borderTop: '5px solid #2196f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h3 style={{ color: '#666', margin: '0 0 10px 0' }}>
          🔄 Checking Authentication
        </h3>
        <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
          Please wait while we verify your access...
        </p>
      </div>
    );
  }

  // Check if user is authenticated after loading is complete
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
          This page requires authentication. Please login using the Remote Authentication Component.
        </p>
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#fff3e0',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#ff9800'
        }}>
          Debug: isAuthenticated={isAuthenticated.toString()}, hasUser={!!user}, initialCheck={initialCheck.toString()}, isLoading={isLoading.toString()}
        </div>
        <button 
          onClick={() => window.location.href = '/'}
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
          Go to Dashboard
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
      </div>
      
      {children}
    </div>
  );
};

export default ProtectedRoute;