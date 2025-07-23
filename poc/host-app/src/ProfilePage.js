// src/ProfilePage.js - Clean Protected Profile Page (With Loading State)
import React from 'react';
import { useJWT } from './JWTContext';

const ProfilePage = () => {
  const { 
    isAuthenticated, 
    user,
    isLoading
  } = useJWT();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f0f2f5' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid #e3f2fd',
            borderTop: '6px solid #2196f3',
            borderRadius: '50%',
            margin: '0 auto 20px'
          }} className="loading-spinner" />
          <h3 style={{ color: '#666', margin: '0 0 10px 0' }}>
            🔄 Checking Authentication
          </h3>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
            Please wait while we verify your access...
          </p>
        </div>
        
        {/* Add CSS animation to document head */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .loading-spinner {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />
      </div>
    );
  }

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
            👤 Profile Page
          </h1>
          <p style={{ 
            color: '#666', 
            margin: 0,
            fontSize: '1.1em'
          }}>
            PoC Tesing Profile Page
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
          justifyContent: 'center',
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
            <span style={{ color: '#333' }}>{user?.username || 'N/A'}</span>
            
            <strong>Email:</strong>
            <span style={{ color: '#333' }}>{user?.email || 'N/A'}</span>
            
            <strong>Role:</strong>
            <span style={{ 
              color: 'white', 
              backgroundColor: user?.role === 'admin' ? '#ff5722' : '#2196F3',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {user?.role || 'N/A'}
            </span>
            
            <strong>Authentication:</strong>
            <span style={{ 
              color: '#4CAF50',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🔒</span>
              Secured via Remote App
            </span>
          </div>
        </div>

        {/* User Data Display */}
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
            📊 Profile Data (From Remote Auth)
          </h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            fontSize: '14px',
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            lineHeight: '1.5'
          }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        {/* Security Info */}
        <div style={{
          backgroundColor: '#e8f5e8',
          border: '2px solid #4CAF50',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h4 style={{ color: '#4CAF50', margin: '0 0 15px 0' }}>
            🔒 Security Information
          </h4>
          <ul style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
            <li>✅ No direct API calls from this page</li>
            <li>✅ Authentication managed by remote app</li>
            <li>✅ JWT tokens never exposed to host app</li>
            <li>✅ All data received via secure message passing</li>
          </ul>
        </div>

        {/* Loading State Fix Notice */}
        <div style={{
          backgroundColor: '#e3f2fd',
          border: '2px solid #2196F3',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h4 style={{ color: '#2196F3', margin: '0 0 15px 0' }}>
            🔧 Refresh Issue Fixed
          </h4>
          <ul style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
            <li>✅ Added loading state for page refresh</li>
            <li>✅ Prevents premature "Unauthorized Access" error</li>
            <li>✅ Waits for remote app to initialize auth state</li>
            <li>✅ Smooth user experience on direct page access</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;