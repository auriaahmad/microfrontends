// src/AuthContext.js - Clean Remote App (Authentication Only)
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

  // Secure token sharing with host apps
  const shareTokenWithHost = (token, user) => {
    addLog(`🔄 Sharing token with host apps`);

    // Share with parent window (for iframe scenario)
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'AUTH_TOKEN_UPDATE',
        payload: {
          accessToken: token,
          user: user,
          timestamp: Date.now(),
          source: 'remoteCounter'
        }
      }, '*');
    }

    // Share with same window (for module federation scenario)
    window.postMessage({
      type: 'AUTH_TOKEN_UPDATE',
      payload: {
        accessToken: token,
        user: user,
        timestamp: Date.now(),
        source: 'remoteCounter'
      }
    }, '*');

    // Store in sessionStorage for host app access
    sessionStorage.setItem('jwt_token', token);
    sessionStorage.setItem('user_data', JSON.stringify(user));
  };

  // Enhanced storage management
  const clearStorage = () => {
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_data');
    addLog('🧹 All storage cleared');
  };

  // Listen for token requests from host apps
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'REQUEST_AUTH_TOKEN' && accessToken) {
        addLog('🔑 Host requested token, sharing existing token');
        shareTokenWithHost(accessToken, user);
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

        // Share token with host apps and store in session
        shareTokenWithHost(data.accessToken, data.user);

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
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'AUTH_LOGOUT',
          payload: { timestamp: Date.now() }
        }, '*');
      }

      window.postMessage({
        type: 'AUTH_LOGOUT',
        payload: { timestamp: Date.now() }
      }, '*');

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

        // Share new token with host apps
        shareTokenWithHost(data.accessToken, user);
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
      addLog('🚀 Remote app initializing auth state');

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
                shareTokenWithHost(data.accessToken, profileData.user);
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
    accessToken,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    logs,
    clearLogs,
    addLog,
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