// src/ProfilePage.js - Host App
import React, { useState, useEffect } from 'react';
import { useJWT } from './JWTContext';

const ProfilePage = () => {
  const { isAuthenticated, user, makeAuthenticatedRequest, logout } = useJWT();
  const [profileData, setProfileData] = useState(null);
  const [networkStats, setNetworkStats] = useState(null);
  const [loading, setLoading] = useState({
    profile: false,
    network: false
  });
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Access denied. Please login first.');
    } else {
      // Auto-fetch profile data when authenticated
      fetchProfileData();
    }
  }, [isAuthenticated]);

  const fetchProfileData = async () => {
    setLoading(prev => ({ ...prev, profile: true }));
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
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const fetchNetworkStats = async () => {
    setLoading(prev => ({ ...prev, network: true }));
    setError('');
    
    try {
      const response = await makeAuthenticatedRequest('http://localhost:3002/api/network/stats');
      
      if (response.ok) {
        const data = await response.json();
        setNetworkStats(data.networkStats);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch network stats');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, network: false }));
    }
  };

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        border: '2px solid #f44336',
        borderRadius: '8px',
        backgroundColor: '#ffebee',
        margin: '20px 0'
      }}>
        <h2 style={{ color: '#f44336', margin: '0 0 20px 0' }}>
          🔒 Access Denied
        </h2>
        <p style={{ fontSize: '18px', margin: '0 0 20px 0' }}>
          This profile page requires JWT authentication.
        </p>
        <p style={{ color: '#666', margin: '0 0 30px 0' }}>
          Please login first to access your telecom operator profile and network data.
        </p>
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '4px',
          border: '1px solid #ff9800'
        }}>
          <h4 style={{ color: '#e65100', margin: '0 0 10px 0' }}>
            💡 How to Access:
          </h4>
          <ol style={{ textAlign: 'left', color: '#bf360c' }}>
            <li>Go back to the main page</li>
            <li>Login using the authentication form</li>
            <li>Return to this profile page</li>
            <li>Access will be granted automatically</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Profile Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        borderRadius: '8px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0' }}>
            👤 Telecom Operator Profile
          </h1>
          <p style={{ margin: '0', opacity: 0.9 }}>
            Secure access to your account and network statistics
          </p>
        </div>
        <button 
          onClick={logout}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          color: '#f44336', 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          border: '1px solid #f44336'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* User Information Card */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginBottom: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#333', margin: '0 0 20px 0' }}>
          👨‍💼 Account Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong>Username:</strong>
            <div style={{ color: '#666', marginTop: '5px' }}>{user.username}</div>
          </div>
          <div>
            <strong>Email:</strong>
            <div style={{ color: '#666', marginTop: '5px' }}>{user.email}</div>
          </div>
          <div>
            <strong>Role:</strong>
            <div style={{ 
              color: user.role === 'admin' ? '#f44336' : '#2196F3', 
              marginTop: '5px',
              fontWeight: 'bold'
            }}>
              {user.role.toUpperCase()}
            </div>
          </div>
          <div>
            <strong>User ID:</strong>
            <div style={{ color: '#666', marginTop: '5px' }}>{user.userId}</div>
          </div>
        </div>
      </div>

      {/* Profile Data Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginBottom: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0' }}>
            📋 Extended Profile Data
          </h3>
          <button 
            onClick={fetchProfileData}
            disabled={loading.profile}
            style={{
              backgroundColor: loading.profile ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: loading.profile ? 'not-allowed' : 'pointer'
            }}
          >
            {loading.profile ? 'Loading...' : '🔄 Refresh Profile'}
          </button>
        </div>

        {profileData ? (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <pre style={{ 
              margin: '0',
              fontSize: '14px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap'
            }}>
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        ) : (
          <p style={{ color: '#666', margin: '0' }}>
            Click "Refresh Profile" to load extended profile data from the backend.
          </p>
        )}
      </div>

      {/* Network Statistics Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginBottom: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0' }}>
            📊 Network Statistics
          </h3>
          <button 
            onClick={fetchNetworkStats}
            disabled={loading.network || user.role === 'user'}
            style={{
              backgroundColor: loading.network || user.role === 'user' ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: loading.network || user.role === 'user' ? 'not-allowed' : 'pointer'
            }}
            title={user.role === 'user' ? 'Admin or Engineer role required' : 'Load network statistics'}
          >
            {loading.network ? 'Loading...' : '📈 Load Network Stats'}
          </button>
        </div>

        {user.role === 'user' && (
          <div style={{
            padding: '15px',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
            border: '1px solid #ffc107',
            marginBottom: '15px'
          }}>
            <strong>⚠️ Access Restricted:</strong> Network statistics require Admin or Engineer role.
          </div>
        )}

        {networkStats ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#e3f2fd',
              borderRadius: '4px',
              border: '1px solid #2196F3'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Calls</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {networkStats.totalCalls?.toLocaleString()}
              </div>
            </div>
            <div style={{
              padding: '15px',
              backgroundColor: '#e8f5e8',
              borderRadius: '4px',
              border: '1px solid #4CAF50'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Active Connections</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {networkStats.activeConnections?.toLocaleString()}
              </div>
            </div>
            <div style={{
              padding: '15px',
              backgroundColor: '#fff3e0',
              borderRadius: '4px',
              border: '1px solid #ff9800'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Avg Latency</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {networkStats.avgLatency}
              </div>
            </div>
            <div style={{
              padding: '15px',
              backgroundColor: '#fce4ec',
              borderRadius: '4px',
              border: '1px solid #e91e63'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#c2185b' }}>Error Rate</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {networkStats.errorRate}
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: '#666', margin: '0' }}>
            Click "Load Network Stats" to fetch real-time telecom network data.
          </p>
        )}

        {networkStats && (
          <div style={{ 
            marginTop: '15px', 
            fontSize: '12px', 
            color: '#666',
            textAlign: 'center'
          }}>
            Last updated: {new Date(networkStats.timestamp).toLocaleString()}
          </div>
        )}
      </div>

      {/* Security Info */}
      <div style={{
        backgroundColor: '#f1f8e9',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #4CAF50'
      }}>
        <h4 style={{ color: '#2e7d32', margin: '0 0 15px 0' }}>
          🔐 Security Information
        </h4>
        <ul style={{ color: '#388e3c', margin: '0', paddingLeft: '20px' }}>
          <li>This page is protected by JWT authentication</li>
          <li>All API calls use your authenticated token</li>
          <li>Session automatically expires after 15 minutes</li>
          <li>Role-based access control is enforced</li>
          <li>All actions are logged and monitored</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;