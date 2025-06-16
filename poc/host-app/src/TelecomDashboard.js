// src/TelecomDashboard.js - Simplified Host App Dashboard
import React, { useState } from 'react';
import { useJWT } from './JWTContext';

const TelecomDashboard = () => {
  const { 
    isAuthenticated, 
    user, 
    makeAuthenticatedRequest, 
    accessToken, 
    logs,
    clearLogs,
    logout,
    addLog
  } = useJWT();
  
  // API Testing States
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLogs, setShowLogs] = useState(false);

  // Test User Profile API
  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await makeAuthenticatedRequest('http://localhost:3002/api/user/profile');
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        addLog('✅ User profile fetched successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch profile data');
        addLog(`❌ Profile fetch failed: ${errorData.error}`);
      }
    } catch (error) {
      setError(error.message);
      addLog(`❌ Profile fetch error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Authentication Status */}
      {isAuthenticated ? (
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #4CAF50'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#4CAF50' }}>
            ✅ Network Access Authenticated
          </h4>
          <div style={{ marginBottom: '10px' }}>
            <strong>Engineer:</strong> {user.username} | 
            <strong> Email:</strong> {user.email} | 
            <strong> Role:</strong> {user.role}
          </div>
          <div style={{ marginBottom: '15px', fontSize: '12px', color: '#666' }}>
            <strong>JWT Token:</strong> {accessToken ? `${accessToken.substring(0, 30)}...` : 'None'}
          </div>
          <button 
            onClick={logout}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ 
          padding: '20px', 
          border: '2px solid #ff5722', 
          borderRadius: '8px',
          backgroundColor: '#fce4ec',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#ff5722', margin: '0 0 10px 0' }}>
            🔐 Authentication Required
          </h4>
          <p style={{ color: '#666', margin: 0 }}>
            Please authenticate using the remote authentication component above to access telecom APIs.
          </p>
        </div>
      )}

      {/* API Testing Section */}
      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>
          🧪 Network Performance API Testing
        </h4>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Status:</strong> 
          <span style={{ 
            color: isAuthenticated ? '#28a745' : '#dc3545',
            marginLeft: '10px',
            fontWeight: 'bold'
          }}>
            {isAuthenticated ? '🟢 Ready for Testing' : '🔴 Authentication Required'}
          </span>
        </div>

        <button 
          onClick={fetchUserProfile}
          disabled={loading || !isAuthenticated}
          style={{
            backgroundColor: loading || !isAuthenticated ? '#ccc' : '#3f51b5',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: loading || !isAuthenticated ? 'not-allowed' : 'pointer',
            opacity: loading || !isAuthenticated ? 0.6 : 1,
            fontSize: '16px',
            fontWeight: 'bold'
          }}
          title={!isAuthenticated ? 'Please authenticate first to test API calls' : 'Test authenticated API call'}
        >
          {loading ? 'Testing API...' : 'Test User Profile API'}
        </button>

        {error && (
          <div style={{ 
            color: '#f44336', 
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            border: '1px solid #f44336',
            fontSize: '14px'
          }}>
            <strong>API Error:</strong> {error}
          </div>
        )}
      </div>

      {/* API Response Display */}
      {profileData && (
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
            📊 API Response - User Profile:
          </h4>
          <pre style={{ 
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '4px',
            fontSize: '14px',
            overflow: 'auto',
            maxHeight: '300px',
            border: '1px solid #e0e0e0'
          }}>
            {JSON.stringify(profileData, null, 2)}
          </pre>
        </div>
      )}

      {/* Activity Logs - Compact */}
      <div style={{ 
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ margin: '0', color: '#666', fontSize: '16px' }}>
            📋 Activity Logs
          </h4>
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
              <div key={index} style={{ marginBottom: '2px' }}>{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TelecomDashboard;