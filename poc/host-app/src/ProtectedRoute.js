// src/ProtectedRoute.js - Route Protection Component
import React from 'react';
import { useJWT } from './JWTContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useJWT();

  // If not authenticated, show unauthorized message
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f0f2f5' 
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '600px',
          border: '3px solid #f44336'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🚫</div>
          <h1 style={{ color: '#f44336', marginBottom: '20px', fontSize: '2.5em' }}>
            Access Denied
          </h1>
          <h3 style={{ color: '#666', marginBottom: '20px' }}>
            Unauthorized - JWT Token Required
          </h3>
          <p style={{ color: '#888', marginBottom: '30px', fontSize: '16px', lineHeight: '1.6' }}>
            This page requires authentication. Please login first using the remote authentication component to access protected telecom network resources.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🏠 Go to Login Page
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🔄 Retry
            </button>
          </div>
          <div style={{ 
            marginTop: '25px', 
            padding: '15px', 
            backgroundColor: '#fff3cd',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#856404'
          }}>
            <strong>Network Engineers:</strong> Ensure your JWT token is valid and not expired.
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;