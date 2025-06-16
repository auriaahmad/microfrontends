// src/JWTContext.js - Host App
import React, { createContext, useContext, useState, useEffect } from 'react';

const JWTContext = createContext();

export const useJWT = () => {
  const context = useContext(JWTContext);
  if (!context) {
    throw new Error('useJWT must be used within a JWTProvider');
  }
  return context;
};

export const JWTProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Listen for storage changes (when user manually clears sessionStorage)
  // Listen for JWT tokens from remote app (when we add remote auth components)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = sessionStorage.getItem('jwt_token');
      const storedUser = sessionStorage.getItem('user_data');
      
      if (!storedToken && accessToken) {
        // User manually cleared storage, update React state
        addLog('🧹 Detected manual session clear, updating state...');
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    // Check storage every 2 seconds for manual changes
    const storageCheckInterval = setInterval(handleStorageChange, 2000);
    
    // Also listen for storage events (works when multiple tabs)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(storageCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [accessToken]);
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'AUTH_TOKEN_UPDATE') {
        const { accessToken, user, source } = event.data.payload;
        
        addLog(`🔑 Received JWT token from ${source}`);
        
        setAccessToken(accessToken);
        setUser(user);
        setIsAuthenticated(true);
        
        // Store token securely
        sessionStorage.setItem('jwt_token', accessToken);
        sessionStorage.setItem('user_data', JSON.stringify(user));
      }
      
      if (event.data.type === 'AUTH_LOGOUT') {
        addLog('🚪 Logout event received from remote app');
        handleLogout();
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Try to get existing token on mount
    const storedToken = sessionStorage.getItem('jwt_token');
    const storedUser = sessionStorage.getItem('user_data');
    
    if (storedToken && storedUser) {
      addLog('🔄 Found stored JWT token, validating...');
      validateStoredToken(storedToken, JSON.parse(storedUser));
    } else {
      addLog('👋 JWT Context initialized, waiting for authentication...');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const validateStoredToken = async (token, userData) => {
    try {
      const response = await fetch('http://localhost:3002/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (data.valid) {
        setAccessToken(token);
        setUser(userData);
        setIsAuthenticated(true);
        addLog('✅ Stored JWT token is valid');
      } else {
        addLog('❌ Stored JWT token is invalid, clearing...');
        handleLogout();
      }
    } catch (error) {
      addLog(`❌ Error validating token: ${error.message}`);
      handleLogout();
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_data');
    addLog('🧹 Cleared all authentication data');
  };

  // Helper function for making authenticated requests
  const makeAuthenticatedRequest = async (url, options = {}) => {
    // Double-check token exists in both state and storage
    const currentToken = accessToken || sessionStorage.getItem('jwt_token');
    
    if (!currentToken) {
      addLog('❌ No access token available for API request');
      throw new Error('No access token available');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${currentToken}`,
    };

    addLog(`📡 Making authenticated request to: ${url}`);

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      addLog('🔄 Token expired or invalid, clearing authentication');
      handleLogout();
      throw new Error('Token expired, please login again');
    }

    if (response.ok) {
      addLog('✅ Authenticated request successful');
    } else {
      addLog(`❌ Request failed with status: ${response.status}`);
    }

    return response;
  };

  // Manual login function for testing
  const manualLogin = async (username, password) => {
    try {
      addLog(`🔐 Attempting manual login for: ${username}`);
      
      const response = await fetch('http://localhost:3002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setAccessToken(data.accessToken);
        setIsAuthenticated(true);
        
        sessionStorage.setItem('jwt_token', data.accessToken);
        sessionStorage.setItem('user_data', JSON.stringify(data.user));
        
        addLog(`✅ Manual login successful for: ${data.user.username}`);
        return { success: true, user: data.user };
      } else {
        addLog(`❌ Login failed: ${data.error}`);
        return { success: false, error: data.error };
      }
    } catch (error) {
      addLog(`❌ Network error during login: ${error.message}`);
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    accessToken,
    user,
    isAuthenticated,
    makeAuthenticatedRequest,
    logout: handleLogout,
    manualLogin,
    logs,
    clearLogs: () => setLogs([]),
    addLog  // Added this line
  };

  return (
    <JWTContext.Provider value={value}>
      {children}
    </JWTContext.Provider>
  );
};