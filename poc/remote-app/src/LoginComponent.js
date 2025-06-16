// src/LoginComponent.js - Remote App
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const LoginComponent = () => {
  const { login, logout, user, isAuthenticated, loading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLogging(true);

    const result = await login(credentials.username, credentials.password);
    
    if (!result.success) {
      setError(result.error);
    } else {
      setCredentials({ username: '', password: '' });
    }
    
    setIsLogging(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading authentication...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '2px solid #4CAF50', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        margin: '10px 0'
      }}>
        <h3 style={{ color: '#4CAF50', margin: '0 0 15px 0' }}>
          🔐 Authenticated in Remote App
        </h3>
        <div style={{ marginBottom: '15px' }}>
          <strong>Welcome, {user.username}!</strong>
          <br />
          <small>Role: {user.role} | Email: {user.email}</small>
        </div>
        <button 
          onClick={logout}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#e7f3ff',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>🔄 JWT Token Status:</strong> Active and shared with host apps
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #2196F3', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      margin: '10px 0'
    }}>
      <h3 style={{ color: '#2196F3', margin: '0 0 15px 0' }}>
        🔑 Remote App Authentication
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Username:
          </label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            placeholder="telecom_admin or network_engineer"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            placeholder="password123"
          />
        </div>
        
        {error && (
          <div style={{ 
            color: '#f44336', 
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            border: '1px solid #f44336'
          }}>
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLogging}
          style={{
            backgroundColor: isLogging ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: isLogging ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            width: '100%'
          }}
        >
          {isLogging ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#fff3cd',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>Test Credentials:</strong><br />
        Username: <code>telecom_admin</code> | Password: <code>password123</code><br />
        Username: <code>network_engineer</code> | Password: <code>password123</code>
      </div>
    </div>
  );
};

export default LoginComponent;