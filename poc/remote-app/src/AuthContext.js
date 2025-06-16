// src/AuthContext.js - Remote App (with debug logs)
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

  // Secure token sharing with host apps
  const shareTokenWithHost = (token, user) => {
    console.log('🔄 Attempting to share token with host apps:', { token: token?.substring(0, 20) + '...', user });

    // Share with parent window (for iframe scenario)
    if (window.parent !== window) {
      console.log('📤 Sharing token via parent window (iframe mode)');
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
    console.log('📤 Sharing token via same window (module federation mode)');
    window.postMessage({
      type: 'AUTH_TOKEN_UPDATE',
      payload: {
        accessToken: token,
        user: user,
        timestamp: Date.now(),
        source: 'remoteCounter'
      }
    }, '*');
  };

  // Listen for token requests from host apps
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('📨 Received message in remote app:', event.data);

      if (event.data.type === 'REQUEST_AUTH_TOKEN' && accessToken) {
        console.log('🔑 Host requested token, sharing existing token');
        shareTokenWithHost(accessToken, user);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [accessToken, user]);

  const login = async (username, password) => {
    console.log('🔐 Attempting login for:', username);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('📡 Login response status:', response.status);
      const data = await response.json();
      console.log('📄 Login response data:', data);

      if (response.ok) {
        console.log('✅ Login successful, setting state and sharing token');

        setUser(data.user);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        // Share token with host apps
        shareTokenWithHost(data.accessToken, data.user);

        // Store refresh token securely
        localStorage.setItem('refreshToken', data.refreshToken);

        return { success: true, user: data.user };
      } else {
        console.log('❌ Login failed:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('🚨 Network error during login:', error);
      return { success: false, error: 'Network error: ' + error.message };
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out...');

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
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('refreshToken');

      // Notify host apps of logout
      console.log('📤 Notifying host apps of logout');

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
    }
  };

  const refreshAccessToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) return false;

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

        // Share new token with host apps
        shareTokenWithHost(data.accessToken, user);

        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
    }
  };

  // Auto-refresh token before expiration
  useEffect(() => {
    if (accessToken) {
      console.log('⏰ Setting up token refresh timer');
      // JWT tokens expire in 15 minutes, refresh after 14 minutes
      const refreshInterval = setInterval(() => {
        console.log('🔄 Auto-refreshing token');
        refreshAccessToken();
      }, 14 * 60 * 1000);

      return () => clearInterval(refreshInterval);
    }
  }, [accessToken]);

  // Initialize auth state on mount
  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      console.log('🚀 Initializing auth state');

      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (storedRefreshToken) {
        console.log('🔑 Found stored refresh token, attempting to refresh');

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
            console.log('✅ Token refresh successful:', data);
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
                console.log('✅ User profile fetched:', profileData.user);
                setUser(profileData.user);

                // Share token with user data
                shareTokenWithHost(data.accessToken, profileData.user);
              } else {
                console.error('❌ Failed to fetch user profile');
              }
            } catch (error) {
              console.error('❌ Error fetching user profile:', error);
            }
          } else {
            console.log('❌ Token refresh failed:', data);
            logout();
          }
        } catch (error) {
          console.error('❌ Token refresh error:', error);
          logout();
        }
      } else {
        console.log('📝 No stored refresh token found');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      // Token might be expired, try to refresh
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        headers['Authorization'] = `Bearer ${accessToken}`;
        return fetch(url, { ...options, headers });
      } else {
        logout();
        throw new Error('Authentication failed');
      }
    }

    return response;
  };

  const value = {
    user,
    accessToken,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    makeAuthenticatedRequest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;