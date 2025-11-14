// src/AuthContext.js - Secured Remote App (Authentication + API Proxy)
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:3002/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  // Enhanced logging functionality
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(`🔐 Remote Auth: ${message}`);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('🧹 Logs cleared');
  };

  // Secure auth status sharing with host apps (NO TOKEN SHARING)
  const shareAuthStatusWithHost = (isAuthenticated, user) => {
    addLog(`🔄 Sharing auth status with host apps (no tokens)`);

    const authPayload = {
      type: 'AUTH_STATUS_UPDATE',
      payload: {
        isAuthenticated,
        user: user ? {
          username: user.username,
          email: user.email,
          role: user.role
        } : null,
        timestamp: Date.now(),
        source: 'remoteAuth'
      }
    };

    // Share with parent window (for iframe scenario)
    if (window.parent !== window) {
      window.parent.postMessage(authPayload, '*');
    }

    // Share with same window (for module federation scenario)
    window.postMessage(authPayload, '*');

    addLog('🔒 Auth status shared securely (tokens kept private)');
  };

  // Enhanced storage management (only refresh token)
  const clearStorage = () => {
    localStorage.removeItem('refreshToken');
    addLog('🧹 Storage cleared');
  };

  // Secure API proxy for host apps
  const makeSecureAPICall = async (endpoint, options = {}) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }
    
    try {
      addLog(`🔄 Proxying API call: ${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        addLog(`✅ API call successful: ${endpoint}`);
        return { success: true, data, status: response.status };
      } else {
        addLog(`❌ API call failed: ${data.error}`);
        return { success: false, error: data.error, status: response.status };
      }
    } catch (error) {
      addLog(`🚨 API call error: ${error.message}`);
      return { success: false, error: error.message, status: 500 };
    }
  };

  // Listen for messages from host apps
  useEffect(() => {
    const handleMessage = (event) => {
      // Handle auth status requests
      if (event.data.type === 'REQUEST_AUTH_STATUS') {
        addLog('🔑 Host requested auth status');
        shareAuthStatusWithHost(!!user, user);
        return;
      }

      // Handle API requests from host apps
      if (event.data?.type === 'API_REQUEST' && accessToken) {
        const { endpoint, options = {}, requestId } = event.data.payload;
        
        addLog(`📨 Received API request: ${endpoint} (ID: ${requestId})`);
        
        // Process API request
        makeSecureAPICall(endpoint, options).then(result => {
          const responsePayload = {
            type: 'API_RESPONSE',
            payload: { ...result, requestId }
          };

          // Send response back to host
          if (window.parent !== window) {
            window.parent.postMessage(responsePayload, '*');
          }
          
          window.postMessage(responsePayload, '*');
          
          addLog(`📤 API response sent (ID: ${requestId})`);
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [accessToken, user]);

  const login = async (username, password) => {
    addLog(`🔐 Attempting login for: ${username}`);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        addLog(`✅ Login successful for: ${data.user.username}`);

        setUser(data.user);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        // Share auth status (not tokens) with host apps
        shareAuthStatusWithHost(true, data.user);

        // Store refresh token securely
        localStorage.setItem('refreshToken', data.refreshToken);

        return { success: true, user: data.user };
      } else {
        addLog(`❌ Login failed: ${data.error}`);
        return { success: false, error: data.error };
      }
    } catch (error) {
      addLog(`🚨 Network error during login: ${error.message}`);
      return { success: false, error: 'Network error: ' + error.message };
    }
  };

  const logout = async () => {
    addLog('🚪 Logging out...');

    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      addLog(`❌ Logout error: ${error.message}`);
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      clearStorage();

      // Notify host apps of logout
      const logoutPayload = {
        type: 'AUTH_STATUS_UPDATE',
        payload: { 
          isAuthenticated: false, 
          user: null, 
          timestamp: Date.now() 
        }
      };

      if (window.parent !== window) {
        window.parent.postMessage(logoutPayload, '*');
      }

      window.postMessage(logoutPayload, '*');

      addLog('✅ Logout completed');
    }
  };

  const refreshAccessToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) return false;

    try {
      addLog('🔄 Refreshing access token...');
      
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Share updated auth status (not token) with host apps
        shareAuthStatusWithHost(true, user);
        addLog('✅ Token refresh successful');

        return true;
      } else {
        addLog('❌ Token refresh failed, logging out');
        logout();
        return false;
      }
    } catch (error) {
      addLog(`❌ Token refresh error: ${error.message}`);
      logout();
      return false;
    }
  };

  // Auto-refresh token before expiration
  useEffect(() => {
    if (accessToken) {
      addLog('⏰ Setting up token refresh timer');
      // JWT tokens expire in 15 minutes, refresh after 14 minutes
      const refreshInterval = setInterval(() => {
        addLog('🔄 Auto-refreshing token');
        refreshAccessToken();
      }, 14 * 60 * 1000);

      return () => clearInterval(refreshInterval);
    }
  }, [accessToken]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      addLog('🚀 Secure remote app initializing auth state');

      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (storedRefreshToken) {
        addLog('🔑 Found stored refresh token, attempting to refresh');

        try {
          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
          });

          const data = await response.json();

          if (response.ok) {
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            // Get user info using the NEW token
            try {
              const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
                headers: {
                  'Authorization': `Bearer ${data.accessToken}`,
                },
              });

              if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                setUser(profileData.user);
                shareAuthStatusWithHost(true, profileData.user);
                addLog(`✅ Auto-login successful for: ${profileData.user.username}`);
              }
            } catch (error) {
              addLog(`❌ Error fetching user profile: ${error.message}`);
            }
          } else {
            addLog('❌ Token refresh failed on init');
            logout();
          }
        } catch (error) {
          addLog(`❌ Init token refresh error: ${error.message}`);
          logout();
        }
      } else {
        addLog('📝 No stored tokens found');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const value = {
    user,
    accessToken: null, // Hidden from host apps for security
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    logs,
    clearLogs,
    addLog,
    makeSecureAPICall, // For internal remote app use only
    clearStorage: () => {
      clearStorage();
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;