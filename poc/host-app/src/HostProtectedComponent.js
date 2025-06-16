// src/HostProtectedComponent.js - Host App
import React, { useState } from 'react';
import { useJWT } from './JWTContext';

const HostProtectedComponent = () => {
  const { 
    isAuthenticated, 
    user, 
    makeAuthenticatedRequest, 
    accessToken, 
    manualLogin,
    logs,
    clearLogs,
    logout,
    addLog
  } = useJWT();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLogs, setShowLogs] = useState(true);
  
  // Manual login form state
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await makeAuthenticatedRequest('http://localhost:3002/api/user/profile');
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch profile data');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    const result = await manualLogin(credentials.username, credentials.password);
    if (result.success) {
      setCredentials({ username: '', password: '' });
    }
  };

  return (
    <div>
      {/* Authentication Status */}
      {!isAuthenticated ? (
        <div style={{ 
          padding: '20px', 
          border: '2px solid #ff5722', 
          borderRadius: '8px',
          backgroundColor: '#fce4ec',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#ff5722', margin: '0 0 15px 0' }}>
            🔐 Manual Login (Host App)
          </h3>
          <form onSubmit={handleManualLogin}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Username (telecom_admin)"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                type="password"
                placeholder="Password (password123)"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button 
                type="submit"
                style={{
                  backgroundColor: '#ff5722',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
            </div>
          </form>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px' }}>
            No JWT token available. You can login manually here or wait for remote app authentication.
          </p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '2px solid #4CAF50'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
            ✅ JWT Authentication Successful
          </h4>
          <div><strong>Username:</strong> {user.username}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Role:</strong> {user.role}</div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <strong>Token:</strong> {accessToken ? `${accessToken.substring(0, 30)}...` : 'None'}
          </div>
          <button 
            onClick={logout}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              marginTop: '10px',
              marginRight: '10px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
          <button 
            onClick={() => {
              sessionStorage.clear();
              addLog('🧹 Manually cleared sessionStorage for testing');
            }}
            style={{
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              marginTop: '10px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Clear Session (Test)
          </button>
        </div>
      )}

      {/* API Testing Section - Always Visible */}
      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>
          🧪 API Testing
        </h4>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Status:</strong> 
          <span style={{ 
            color: isAuthenticated ? '#28a745' : '#dc3545',
            marginLeft: '10px',
            fontWeight: 'bold'
          }}>
            {isAuthenticated ? '🟢 Authenticated' : '🔴 Not Authenticated'}
          </span>
        </div>

        <button 
          onClick={fetchUserProfile}
          disabled={loading || !isAuthenticated}
          style={{
            backgroundColor: loading || !isAuthenticated ? '#ccc' : '#3f51b5',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: loading || !isAuthenticated ? 'not-allowed' : 'pointer',
            marginBottom: '15px',
            opacity: loading || !isAuthenticated ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}
          title={!isAuthenticated ? 'Please login first to test API calls' : 'Test authenticated API call'}
        >
          {loading ? 'Loading...' : !isAuthenticated ? 'API Test (Login Required)' : 'Test API Call with JWT'}
        </button>

        {error && (
          <div style={{ 
            color: '#f44336', 
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            border: '1px solid #f44336'
          }}>
            Error: {error}
          </div>
        )}

        {profileData && (
          <div style={{ 
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginBottom: '15px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
              API Response:
            </h4>
            <pre style={{ 
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Activity Logs - Always Visible */}
      <div style={{ 
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ margin: '0', color: '#666' }}>📋 JWT Activity Logs</h4>
          <div>
            <button 
              onClick={() => setShowLogs(!showLogs)}
              style={{ 
                backgroundColor: '#2196F3', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '4px', 
                marginRight: '5px',
                fontSize: '12px',
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
                padding: '5px 10px', 
                borderRadius: '4px',
                fontSize: '12px',
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
            padding: '10px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {logs.length === 0 ? 'No activity yet...' : logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostProtectedComponent;