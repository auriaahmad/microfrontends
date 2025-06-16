// src/bootstrap.js - Host App with Routing (Updated)
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { JWTProvider } from "./JWTContext";
import TelecomDashboard from "./TelecomDashboard";
import ProfilePage from "./ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [remoteComponentsLoaded, setRemoteComponentsLoaded] = useState(false);
  const [remoteError, setRemoteError] = useState(null);
  const [RemoteAuthProvider, setRemoteAuthProvider] = useState(null);
  const [RemoteLoginComponent, setRemoteLoginComponent] = useState(null);

  // Simple routing based on URL path
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/profile') {
      setCurrentPage('profile');
    } else {
      setCurrentPage('dashboard');
    }

    // Listen for browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/profile') {
        setCurrentPage('profile');
      } else {
        setCurrentPage('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation function
  const navigateTo = (page) => {
    const path = page === 'profile' ? '/profile' : '/';
    window.history.pushState({}, '', path);
    setCurrentPage(page);
  };

  useEffect(() => {
    const loadRemoteComponents = async () => {
      try {
        console.log('🔄 Attempting to load remote components...');
        
        const testResponse = await fetch('http://localhost:3001/remoteEntry.js');
        if (!testResponse.ok) {
          throw new Error(`Remote app not accessible: ${testResponse.status}`);
        }
        
        console.log('✅ Remote app is accessible, loading components...');
        
        const [AuthProviderModule, LoginComponentModule] = await Promise.all([
          import("remoteCounter/AuthProvider").catch(err => {
            console.error('Failed to load AuthProvider:', err);
            throw new Error('AuthProvider component failed to load');
          }),
          import("remoteCounter/LoginComponent").catch(err => {
            console.error('Failed to load LoginComponent:', err);
            throw new Error('LoginComponent component failed to load');
          })
        ]);

        console.log('✅ Remote components loaded successfully');
        
        setRemoteAuthProvider(() => AuthProviderModule.default);
        setRemoteLoginComponent(() => LoginComponentModule.default);
        setRemoteComponentsLoaded(true);
        
      } catch (error) {
        console.error('❌ Failed to load remote components:', error);
        setRemoteError(error.message);
      }
    };

    const timer = setTimeout(loadRemoteComponents, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <JWTProvider>
          
          {/* Render different pages based on current route */}
          {currentPage === 'profile' ? (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ) : (
            <>
              {/* Header */}
              <header style={{ 
                textAlign: 'center', 
                marginBottom: '30px', 
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h1 style={{ 
                  color: '#333', 
                  margin: '0 0 10px 0',
                  fontSize: '2.5em'
                }}>
                  🏠 Telecom Network Performance Host Application
                </h1>
                <p style={{ 
                  color: '#666', 
                  margin: '0 0 15px 0',
                  fontSize: '1.1em'
                }}>
                  End-to-End Network Engineering & Data Pipeline Management Dashboard
                </p>
                
                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                  <button 
                    onClick={() => navigateTo('dashboard')}
                    style={{
                      backgroundColor: currentPage === 'dashboard' ? '#2196F3' : '#ccc',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    🏠 Dashboard
                  </button>
                  <button 
                    onClick={() => navigateTo('profile')}
                    style={{
                      backgroundColor: currentPage === 'profile' ? '#2196F3' : '#ccc',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    👤 Profile
                  </button>
                </div>
              </header>

              {/* Connection Status */}
              <div style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: remoteComponentsLoaded ? '#d4edda' : remoteError ? '#f8d7da' : '#fff3cd',
                border: `1px solid ${remoteComponentsLoaded ? '#c3e6cb' : remoteError ? '#f5c6cb' : '#ffeaa7'}`,
                borderRadius: '8px',
                color: remoteComponentsLoaded ? '#155724' : remoteError ? '#721c24' : '#856404'
              }}>
                <strong>Remote App Status:</strong> {
                  remoteComponentsLoaded ? '🟢 Connected to Remote App (port 3001)' :
                  remoteError ? `🔴 Connection Failed: ${remoteError}` :
                  '🟡 Connecting to Remote App...'
                }
              </div>

              {/* Remote Authentication Section */}
              <div style={{ 
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ 
                  color: '#2196F3', 
                  margin: '0 0 20px 0',
                  borderBottom: '2px solid #2196F3',
                  paddingBottom: '10px'
                }}>
                  🔐 Remote Authentication Component
                </h2>
                
                {remoteComponentsLoaded && RemoteAuthProvider && RemoteLoginComponent ? (
                  <RemoteAuthProvider>
                    <RemoteLoginComponent />
                  </RemoteAuthProvider>
                ) : remoteError ? (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    border: '2px solid #f44336',
                    borderRadius: '8px',
                    backgroundColor: '#ffebee'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                    <h3 style={{ color: '#f44336', marginBottom: '15px' }}>
                      Remote Component Load Failed
                    </h3>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                      {remoteError}
                    </p>
                    <button 
                      onClick={() => window.location.reload()}
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
                      Retry Connection
                    </button>
                  </div>
                ) : (
                  <div style={{ 
                    padding: '40px', 
                    textAlign: 'center',
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>
                      🔄 Loading Remote Authentication Component...
                    </div>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid #e3f2fd',
                      borderTop: '4px solid #2196f3',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '20px auto'
                    }} />
                  </div>
                )}
              </div>

              {/* Host App Dashboard */}
              <div style={{ 
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ 
                  color: '#ff5722', 
                  margin: '0 0 20px 0',
                  borderBottom: '2px solid #ff5722',
                  paddingBottom: '10px'
                }}>
                  🧪 Host Application - API Testing & Network Performance
                </h2>
                <TelecomDashboard />
              </div>

              {/* Footer */}
              <footer style={{ 
                textAlign: 'center', 
                marginTop: '40px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: '#666'
              }}>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>Tech Stack:</strong> Airflow • Trino • Docker • Kubernetes • Wireshark • VoLTE Analysis • Module Federation
                </p>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Network Performance Engineering Dashboard | Remote: localhost:3001 | Host: localhost:3000 | API: localhost:3002
                </p>
              </footer>
            </>
          )}

        </JWTProvider>
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);