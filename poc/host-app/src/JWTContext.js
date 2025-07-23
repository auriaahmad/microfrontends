// src/JWTContext.js - Simplified Host App (Auth Status Only)
import React, { createContext, useContext, useState, useEffect } from 'react';

const JWTContext = createContext();

export const JWTProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth status from remote app
    const handleMessage = (event) => {
      if (event.data?.type === 'AUTH_STATUS_UPDATE') {
        const { isAuthenticated: authStatus, user: userData } = event.data.payload;
        
        setIsAuthenticated(authStatus);
        setUser(userData);
        setIsLoading(false);
        
        console.log(`🏠 Host: Auth status updated - ${authStatus ? 'authenticated' : 'not authenticated'}`);
      }
    };

    window.addEventListener('message', handleMessage);

    // Request initial auth status from remote
    const requestAuthStatus = () => {
      window.postMessage({
        type: 'REQUEST_AUTH_STATUS',
        payload: { timestamp: Date.now() }
      }, '*');
    };

    // Request status after small delay to ensure remote is ready
    setTimeout(requestAuthStatus, 100);

    // Fallback: if no response in 2 seconds, assume not authenticated
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        console.log('🏠 Host: Auth check timeout - assuming not authenticated');
      }
    }, 2000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(fallbackTimeout);
    };
  }, [isLoading]);

  // Make API requests through remote proxy
  const makeAuthenticatedRequest = async (endpoint, options = {}) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated - please login first');
    }

    const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    return new Promise((resolve, reject) => {
      // Listen for response
      const handleResponse = (event) => {
        if (event.data?.type === 'API_RESPONSE' && event.data.payload.requestId === requestId) {
          window.removeEventListener('message', handleResponse);
          
          const { success, data, error, status } = event.data.payload;
          
          if (success) {
            // Return Response-like object
            resolve({
              ok: status < 400,
              status,
              json: () => Promise.resolve(data),
              text: () => Promise.resolve(JSON.stringify(data))
            });
          } else {
            reject(new Error(error || 'API request failed'));
          }
        }
      };

      window.addEventListener('message', handleResponse);

      // Set timeout
      const timeout = setTimeout(() => {
        window.removeEventListener('message', handleResponse);
        reject(new Error('API request timeout'));
      }, 10000);

      // Send request to remote
      window.postMessage({
        type: 'API_REQUEST',
        payload: {
          endpoint: endpoint.replace('http://localhost:3002/api', ''),
          options,
          requestId
        }
      }, '*');

      // Clear timeout when resolved/rejected
      const originalResolve = resolve;
      const originalReject = reject;
      resolve = (...args) => {
        clearTimeout(timeout);
        originalResolve(...args);
      };
      reject = (...args) => {
        clearTimeout(timeout);
        originalReject(...args);
      };
    });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    makeAuthenticatedRequest
  };

  return (
    <JWTContext.Provider value={value}>
      {children}
    </JWTContext.Provider>
  );
};

export const useJWT = () => {
  const context = useContext(JWTContext);
  if (!context) {
    throw new Error('useJWT must be used within a JWTProvider');
  }
  return context;
};