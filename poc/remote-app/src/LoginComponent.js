// src/LoginComponent.js - Clean Remote App (Login Only)
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const LoginComponent = () => {
  const { 
    login, 
    logout, 
    user, 
    isAuthenticated, 
    loading, 
    accessToken, 
    logs, 
    clearLogs, 
    clearStorage,
    addLog 
  } = useAuth();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

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
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        border: '2px solid #2196F3',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <div>🔄 Initializing remote authentication...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Authentication Section */}
      {!isAuthenticated ? (
        <div style={{ 
          padding: '20px', 
          border: '2px solid #2196F3', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          marginBottom: '20px'
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
              {isLogging ? 'Authenticating...' : 'Login to Network System'}
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
      ) : (
        <div style={{ 
          padding: '20px', 
          border: '2px solid #4CAF50', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#4CAF50', margin: '0 0 15px 0' }}>
            ✅ Network Authentication Successful
          </h3>
          <div style={{ marginBottom: '15px' }}>
            <strong>Welcome, {user.username}!</strong>
            <br />
            <small>Role: {user.role} | Email: {user.email}</small>
          </div>
          <div style={{ marginBottom: '15px', fontSize: '12px', color: '#666' }}>
            <strong>JWT Token:</strong> {accessToken ? `${accessToken.substring(0, 30)}...` : 'None'}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={logout}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Logout
            </button>
            <button 
              onClick={() => {
                clearStorage();
                addLog('🧹 Manually cleared all storage for testing');
              }}
              style={{
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear Storage (Test)
            </button>
          </div>
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#e7f3ff',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <strong>🔄 Token Status:</strong> Active and shared with host applications
          </div>
        </div>
      )}

      {/* Compact Activity Logs */}
      <div style={{ 
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            📋 Remote Auth Logs
          </h4>
          <div>
            <button 
              onClick={() => setShowLogs(!showLogs)}
              style={{ 
                backgroundColor: '#2196F3', 
                color: 'white', 
                border: 'none', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                marginRight: '5px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              {showLogs ? 'Hide' : 'Show'}
            </button>
            <button 
              onClick={clearLogs}
              style={{ 
                backgroundColor: '#666', 
                color: 'white', 
                border: 'none', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </div>
        {showLogs && (
          <div style={{ 
            backgroundColor: '#000',
            color: '#00ff00',
            padding: '8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '10px',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {logs.length === 0 ? 'No activity yet...' : logs.map((log, index) => (
              <div key={index} style={{ marginBottom: '1px' }}>{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginComponent;