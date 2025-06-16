// src/ProfilePage.js - Protected Profile Page
import React, { useState, useEffect } from 'react';
import { useJWT } from './JWTContext';

const ProfilePage = () => {
  const { 
    isAuthenticated, 
    user, 
    makeAuthenticatedRequest, 
    accessToken, 
    addLog,
    logout 
  } = useJWT();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch detailed profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDetailedProfile();
    }
  }, [isAuthenticated]);

  const fetchDetailedProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await makeAuthenticatedRequest('http://localhost:3002/api/user/profile');
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        addLog('✅ Detailed profile data loaded for profile page');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch detailed profile');
        addLog(`❌ Profile page data fetch failed: ${errorData.error}`);
      }
    } catch (error) {
      setError(error.message);
      addLog(`❌ Profile page error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show unauthorized message if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        backgroundColor: '#f0f2f5' 
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '500px',
          border: '2px solid #f44336'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔐</div>
          <h2 style={{ color: '#f44336', marginBottom: '15px' }}>
            Unauthorized Access
          </h2>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '16px' }}>
            You need to be authenticated to access this profile page.
          </p>
          <p style={{ color: '#888', marginBottom: '25px', fontSize: '14px' }}>
            Please login first using the remote authentication component.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #e3f2fd',
            borderTop: '5px solid #2196f3',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#666', fontSize: '16px' }}>Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Main profile page content
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5', 
      padding: '20px' 
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            color: '#333', 
            margin: '0 0 10px 0',
            fontSize: '2.5em'
          }}>
            👤 Network Engineer Profile
          </h1>
          <p style={{ 
            color: '#666', 
            margin: 0,
            fontSize: '1.1em'
          }}>
            Telecom Data Pipeline & Network Performance Engineering
          </p>
        </div>

        {/* Navigation */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Dashboard
          </button>
          <button 
            onClick={logout}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>

        {/* Profile Information */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ 
            color: '#4CAF50', 
            margin: '0 0 20px 0',
            borderBottom: '2px solid #4CAF50',
            paddingBottom: '10px'
          }}>
            ✅ Authenticated User Information
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '15px', alignItems: 'center' }}>
            <strong>Username:</strong>
            <span style={{ color: '#333' }}>{user.username}</span>
            
            <strong>Email:</strong>
            <span style={{ color: '#333' }}>{user.email}</span>
            
            <strong>Role:</strong>
            <span style={{ 
              color: 'white', 
              backgroundColor: user.role === 'admin' ? '#ff5722' : '#2196F3',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {user.role}
            </span>
            
            <strong>JWT Token:</strong>
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '12px', 
              color: '#666',
              wordBreak: 'break-all' 
            }}>
              {accessToken ? `${accessToken.substring(0, 50)}...` : 'None'}
            </span>
          </div>
        </div>

        {/* API Response Data */}
        {error ? (
          <div style={{
            backgroundColor: '#ffebee',
            border: '2px solid #f44336',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h4 style={{ color: '#f44336', margin: '0 0 10px 0' }}>
              ❌ Error Loading Profile Data
            </h4>
            <p style={{ color: '#666', margin: 0 }}>{error}</p>
          </div>
        ) : profileData ? (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h3 style={{ 
              color: '#2196F3', 
              margin: '0 0 20px 0',
              borderBottom: '2px solid #2196F3',
              paddingBottom: '10px'
            }}>
              📊 Detailed Profile API Response
            </h3>
            <pre style={{ 
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              overflow: 'auto',
              maxHeight: '400px',
              border: '1px solid #e0e0e0',
              lineHeight: '1.5'
            }}>
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        ) : null}



      </div>
      
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

export default ProfilePage;