import React, { Suspense, useState } from "react";
import { JWTProvider } from './JWTContext';
import HostProtectedComponent from './HostProtectedComponent';
import ProfilePage from './ProfilePage';
import ModuleFederationErrorBoundary from './ModuleFederationErrorBoundary';

// Your existing remote components
const RemoteSyncedCounter = React.lazy(() => import("remoteCounter/SyncedCounter"));
const RemoteUnsyncedCounter = React.lazy(() => import("remoteCounter/UnsyncedCounter"));

// Remote App Status Component
const RemoteAppStatus = () => {
  const [status, setStatus] = useState('checking');

  React.useEffect(() => {
    const checkRemoteApp = async () => {
      try {
        const response = await fetch('http://localhost:3001/remoteEntry.js', { 
          method: 'HEAD',
          timeout: 3000 
        });
        setStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        setStatus('offline');
      }
    };

    checkRemoteApp();
    const interval = setInterval(checkRemoteApp, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    online: '#4CAF50',
    offline: '#f44336',
    checking: '#ff9800'
  };

  const statusText = {
    online: '🟢 Remote App Online',
    offline: '🔴 Remote App Offline',
    checking: '🟡 Checking...'
  };

  return (
    <div style={{ 
      fontSize: '12px', 
      color: statusColors[status],
      marginTop: '5px'
    }}>
      {statusText[status]}
    </div>
  );
};

// Simple Navigation without React Router
const Navigation = ({ currentPage, setCurrentPage }) => {
  const navStyle = {
    backgroundColor: '#2196F3',
    padding: '15px 20px',
    marginBottom: '20px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonStyle = (isActive) => ({
    backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    fontWeight: isActive ? 'bold' : 'normal'
  });

  return (
    <nav style={navStyle}>
      <div>
        <button 
          onClick={() => {
            setCurrentPage('home');
            window.history.pushState({}, '', '/');
          }}
          style={buttonStyle(currentPage === 'home')}
        >
          🏠 Home
        </button>
        <button 
          onClick={() => {
            setCurrentPage('profile');
            window.history.pushState({}, '', '/profile');
          }}
          style={buttonStyle(currentPage === 'profile')}
        >
          👤 Profile
        </button>
      </div>
      
      <div style={{ color: 'white', fontSize: '14px' }}>
        <div>Current URL: <code>{window.location.pathname}</code></div>
        <RemoteAppStatus />
      </div>
    </nav>
  );
};

// Home Page Component
const HomePage = () => (
  <div>
    <h1 style={{ color: "#333", borderBottom: "3px solid #2196F3", paddingBottom: "10px" }}>
      Host Application - JWT Authentication Demo
    </h1>
    
    {/* Your existing local component - unchanged */}
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <h2>Local Component</h2>
      <p>This is from the host app</p>
    </div>

    {/* JWT Demo Section */}
    <div style={{ 
      border: "2px solid #9C27B0", 
      padding: "20px", 
      margin: "20px 0",
      borderRadius: "8px",
      backgroundColor: "#fdf8ff"
    }}>
      <h2 style={{ color: "#9C27B0", margin: "0 0 15px 0" }}>
        🏠 Host App JWT Demo
      </h2>
      <HostProtectedComponent />
    </div>

    {/* Your existing counter components with Error Boundaries */}
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <h2>Remote Synced Counter</h2>
      <ModuleFederationErrorBoundary moduleName="Synced Counter">
        <Suspense fallback={<div>Loading Remote Synced Counter...</div>}>
          <RemoteSyncedCounter />
        </Suspense>
      </ModuleFederationErrorBoundary>
    </div>

    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <h2>Remote Unsynced Counter</h2>
      <ModuleFederationErrorBoundary moduleName="Unsynced Counter">
        <Suspense fallback={<div>Loading Remote Unsynced Counter...</div>}>
          <RemoteUnsyncedCounter />
        </Suspense>
      </ModuleFederationErrorBoundary>
    </div>

    {/* Information panel */}
    <div style={{ 
      backgroundColor: "#f5f5f5",
      padding: "20px",
      margin: "20px 0",
      borderRadius: "8px",
      border: "1px solid #ddd"
    }}>
      <h3 style={{ color: "#666", margin: "0 0 15px 0" }}>
        🔍 What's Available:
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div>
          <h4 style={{ color: "#2196F3" }}>Home Page (Current):</h4>
          <ul style={{ color: "#555", margin: "0" }}>
            <li>JWT authentication demo</li>
            <li>Manual login functionality</li>
            <li>API testing with shared tokens</li>
            <li>Your existing counter components</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: "#4CAF50" }}>Profile Page (/profile) 🔒:</h4>
          <ul style={{ color: "#555", margin: "0" }}>
            <li>Protected by JWT authentication</li>
            <li>User account information</li>
            <li>Network statistics dashboard</li>
            <li>Role-based access control</li>
          </ul>
        </div>
      </div>
      
      <div style={{ 
        marginTop: "15px",
        padding: "15px",
        backgroundColor: "#e3f2fd",
        borderRadius: "4px",
        border: "1px solid #2196F3"
      }}>
        <strong style={{ color: "#1976d2" }}>Test the Protection:</strong>
        <br />
        <span style={{ color: "#1976d2" }}>
          Click "Profile" in the navigation above to test the protected page!
        </span>
        <br />
        <strong>Test Credentials:</strong> telecom_admin / password123
      </div>
    </div>
  </div>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') {
        setCurrentPage('home');
      } else if (path === '/profile') {
        setCurrentPage('profile');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <JWTProvider>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'profile' && <ProfilePage />}
      </div>
    </JWTProvider>
  );
};

export default App;