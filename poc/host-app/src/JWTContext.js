// src/JWTContext.js - Next.js Host App (No Polling Version)
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const JWTContext = createContext();

export const JWTProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  
  // Refs to track current state without causing re-renders
  const currentTokenRef = useRef(null);
  const initializingRef = useRef(false);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`🏠 Host JWT: ${message}`);
  };

  // Load authentication from storage
  const loadFromStorage = () => {
    try {
      const storedToken = sessionStorage.getItem('jwt_token');
      const storedUser = sessionStorage.getItem('user_data');
      
      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        currentTokenRef.current = storedToken;
        addLog('✅ Authentication data loaded from storage');
        return true;
      } else {
        // Clear state if no stored data
        if (currentTokenRef.current) {
          setToken(null);
          setUser(null);
          currentTokenRef.current = null;
          addLog('🧹 Cleared authentication state');
        }
        return false;
      }
    } catch (error) {
      addLog(`❌ Error loading from storage: ${error.message}`);
      return false;
    }
  };

  // Setup event-driven authentication detection
  useEffect(() => {
    if (initializingRef.current) return;
    initializingRef.current = true;

    addLog('🏠 Host JWT Context initializing...');

    // 1. Load initial state
    loadFromStorage();
    setIsLoading(false);

    // 2. Listen for storage events (cross-tab changes)
    const handleStorageChange = (e) => {
      if (e.key === 'jwt_token' || e.key === 'user_data') {
        addLog(`📦 Storage event detected: ${e.key}`);
        loadFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Listen for PostMessage events (same-tab communication)
    const handleMessage = (event) => {
      if (event.data?.type === 'AUTH_TOKEN_UPDATE') {
        const { accessToken, user } = event.data.payload;
        addLog('📨 Received auth update via PostMessage');
        
        // Update storage first
        sessionStorage.setItem('jwt_token', accessToken);
        sessionStorage.setItem('user_data', JSON.stringify(user));
        
        // Update state
        setToken(accessToken);
        setUser(user);
        currentTokenRef.current = accessToken;
      } else if (event.data?.type === 'AUTH_LOGOUT') {
        addLog('📨 Received logout via PostMessage');
        logout();
      }
    };
    window.addEventListener('message', handleMessage);

    // 4. Listen for page visibility changes (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        addLog('👁️ Tab became visible, checking auth state...');
        
        // Only check if we might have missed an update
        const storedToken = sessionStorage.getItem('jwt_token');
        if (storedToken !== currentTokenRef.current) {
          addLog('🔄 Auth state changed while tab was hidden');
          loadFromStorage();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 5. Listen for window focus (additional safety)
    const handleFocus = () => {
      const storedToken = sessionStorage.getItem('jwt_token');
      if (storedToken !== currentTokenRef.current) {
        addLog('🎯 Focus: Auth state changed');
        loadFromStorage();
      }
    };
    window.addEventListener('focus', handleFocus);

    // 6. Custom authentication events
    const handleCustomAuthEvent = (event) => {
      addLog('🔔 Custom auth event received');
      loadFromStorage();
    };
    window.addEventListener('auth-change', handleCustomAuthEvent);

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('auth-change', handleCustomAuthEvent);
      addLog('🧹 Event listeners cleaned up');
    };
  }, []);

  // Function to make authenticated requests
  const makeAuthenticatedRequest = async (url, options = {}) => {
    const currentToken = token || sessionStorage.getItem('jwt_token');
    
    if (!currentToken) {
      throw new Error('No authentication token available');
    }

    const authHeaders = {
      'Authorization': `Bearer ${currentToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      addLog(`🔄 Making authenticated request to ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: authHeaders,
      });

      if (response.status === 401) {
        addLog('❌ Token expired, clearing authentication');
        logout();
        throw new Error('Authentication token expired');
      }

      return response;
    } catch (error) {
      addLog(`❌ Request failed: ${error.message}`);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    addLog('🚪 Logging out...');
    
    // Clear storage
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_data');
    
    // Clear state
    setToken(null);
    setUser(null);
    currentTokenRef.current = null;
    
    // Notify other components
    window.postMessage({
      type: 'AUTH_LOGOUT',
      payload: { timestamp: Date.now() }
    }, '*');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('auth-change', {
      detail: { type: 'logout' }
    }));
  };

  // Manual login function (for testing)
  const login = (newToken, newUser) => {
    addLog('🔑 Manual login called');
    sessionStorage.setItem('jwt_token', newToken);
    sessionStorage.setItem('user_data', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    currentTokenRef.current = newToken;
    
    // Notify other components
    window.postMessage({
      type: 'AUTH_TOKEN_UPDATE',
      payload: { accessToken: newToken, user: newUser }
    }, '*');
  };

  const value = {
    token,
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    accessToken: token, // Alias for ProfilePage compatibility
    makeAuthenticatedRequest,
    addLog,
    logs
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

// 🚀 Enhanced version with RxJS (optional)
export class NextJSAuthService {
  constructor() {
    // Only load RxJS if available
    if (typeof window !== 'undefined' && window.rxjs) {
      this.setupRxJSAuth();
    } else {
      console.log('RxJS not available, using event-based approach');
    }
  }

  setupRxJSAuth() {
    const { BehaviorSubject, fromEvent, merge } = window.rxjs;
    const { map, filter, distinctUntilChanged, debounceTime } = window.rxjs.operators;

    // Main auth state stream
    this.authState$ = new BehaviorSubject(this.getInitialState());

    // Storage change stream
    const storageChanges$ = fromEvent(window, 'storage').pipe(
      filter(event => event.key === 'jwt_token' || event.key === 'user_data'),
      map(() => this.getInitialState())
    );

    // PostMessage stream
    const messageStream$ = fromEvent(window, 'message').pipe(
      filter(event => 
        event.data?.type === 'AUTH_TOKEN_UPDATE' || 
        event.data?.type === 'AUTH_LOGOUT'
      ),
      map(event => this.mapMessageToState(event.data))
    );

    // Visibility change stream
    const visibilityChange$ = fromEvent(document, 'visibilitychange').pipe(
      filter(() => !document.hidden),
      debounceTime(100),
      map(() => this.getInitialState())
    );

    // Merge all streams
    const allEvents$ = merge(
      storageChanges$,
      messageStream$,
      visibilityChange$
    ).pipe(
      distinctUntilChanged((prev, curr) => 
        prev.token === curr.token && 
        prev.user?.username === curr.user?.username
      )
    );

    // Subscribe to updates
    allEvents$.subscribe(newState => {
      this.authState$.next(newState);
    });

    console.log('🔥 NextJS RxJS Auth Service initialized');
  }

  getInitialState() {
    if (typeof window === 'undefined') return { isAuthenticated: false, user: null, token: null };
    
    const token = sessionStorage.getItem('jwt_token');
    const userData = sessionStorage.getItem('user_data');
    
    return {
      isAuthenticated: !!(token && userData),
      user: userData ? JSON.parse(userData) : null,
      token
    };
  }

  mapMessageToState(data) {
    if (data.type === 'AUTH_TOKEN_UPDATE') {
      return {
        isAuthenticated: true,
        user: data.payload.user,
        token: data.payload.accessToken
      };
    } else if (data.type === 'AUTH_LOGOUT') {
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    }
    return this.getInitialState();
  }

  // Subscribe to auth changes
  subscribe(callback) {
    if (this.authState$) {
      return this.authState$.subscribe(callback);
    } else {
      // Fallback for non-RxJS environment
      const handler = () => callback(this.getInitialState());
      window.addEventListener('storage', handler);
      window.addEventListener('message', handler);
      return () => {
        window.removeEventListener('storage', handler);
        window.removeEventListener('message', handler);
      };
    }
  }
}

// Example usage in Next.js pages
export const useNextJSAuth = () => {
  const [authState, setAuthState] = useState(() => {
    if (typeof window === 'undefined') return { isAuthenticated: false, user: null, token: null };
    
    const token = sessionStorage.getItem('jwt_token');
    const userData = sessionStorage.getItem('user_data');
    
    return {
      isAuthenticated: !!(token && userData),
      user: userData ? JSON.parse(userData) : null,
      token
    };
  });

  useEffect(() => {
    const authService = new NextJSAuthService();
    
    const subscription = authService.subscribe((newState) => {
      setAuthState(newState);
    });

    return () => {
      if (typeof subscription === 'function') {
        subscription();
      } else {
        subscription.unsubscribe();
      }
    };
  }, []);

  return authState;
};