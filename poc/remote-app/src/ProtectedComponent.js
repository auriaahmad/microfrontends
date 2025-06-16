// src/ProtectedComponent.js - Remote App
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProtectedComponent = () => {
  const { isAuthenticated, user, makeAuthenticatedRequest } = useAuth();
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNetworkStats = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await makeAuthenticatedRequest('http://localhost:3002/api/network/stats');
      
      if (response.ok) {
        const data = await response.json();
        setNetworkData(data.networkStats);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch network data');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNetworkStats();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '2px solid #ff9800', 
        borderRadius: '8px',
        backgroundColor: '#fff3e0',
        margin: '10px 0',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#ff9800', margin: '0 0 10px 0' }}>
          🔒 Protected Content
        </h3>
        <p>This component requires authentication. Please login first.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #4CAF50', 
      borderRadius: '8px',
      backgroundColor: '#f1f8e9',
      margin: '10px 0'
    }}>
      <h3 style={{ color: '#4CAF50', margin: '0 0 15px 0' }}>
        📊 Protected Telecom Network Dashboard
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Access granted for:</strong> {user.username} ({user.role})
      </div>

      <button 
        onClick={fetchNetworkStats}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#2196F3',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '15px'
        }}
      >
        {loading ? 'Loading...' : 'Refresh Network Stats'}
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

      {networkData && (
        <div style={{ 
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
            Real-time Network Statistics
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <strong>Total Calls:</strong> {networkData.totalCalls?.toLocaleString()}
            </div>
            <div>
              <strong>Active Connections:</strong> {networkData.activeConnections?.toLocaleString()}
            </div>
            <div>
              <strong>Average Latency:</strong> {networkData.avgLatency}
            </div>
            <div>
              <strong>Error Rate:</strong> {networkData.errorRate}
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <strong>Last Updated:</strong> {new Date(networkData.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#e8f5e8',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>🔐 Security:</strong> This data is fetched using your JWT token and is only accessible to authenticated telecom engineers.
      </div>
    </div>
  );
};

export default ProtectedComponent;