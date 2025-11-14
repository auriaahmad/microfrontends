import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * AuthService - Manages authentication state via postMessage API
 * Mirrors the TYPO3 implementation's secure authentication pattern
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
    // Auth state tracking (NO TOKEN STORAGE - tokens stay in remote app)
    this.authStateSubject = new BehaviorSubject({
      isAuthenticated: false,
      user: null,
      isLoading: true
    });

    // Observable for components to subscribe to
    this.authState$ = this.authStateSubject.asObservable();

    // Pending API requests map
    this.pendingRequests = new Map();

    console.log('🔐 Angular AuthService: Initializing...');
    this.initializeAuthListener();
    this.requestInitialAuthStatus();
  }

  /**
   * Get current auth state value
   */
  getCurrentAuthState() {
    return this.authStateSubject.value;
  }

  /**
   * Initialize postMessage listener for auth updates
   */
  initializeAuthListener() {
    window.addEventListener('message', (event) => {
      // Security: Validate origin (in production, use specific origins)
      const allowedOrigins = [
        'http://localhost:3001',
        'http://localhost:3000',
        window.location.origin
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn('⚠️ Angular AuthService: Message from unknown origin:', event.origin);
        return;
      }

      // Handle AUTH_STATUS_UPDATE from remote app
      if (event.data?.type === 'AUTH_STATUS_UPDATE') {
        const { isAuthenticated, user } = event.data.payload;

        console.log('📨 Angular AuthService: Auth status update -',
          isAuthenticated ? 'authenticated' : 'not authenticated');

        // Update auth state (NO TOKEN STORAGE)
        this.authStateSubject.next({
          isAuthenticated,
          user,
          isLoading: false
        });
      }

      // Handle API_RESPONSE from remote app
      else if (event.data?.type === 'API_RESPONSE') {
        this.handleApiResponse(event.data.payload);
      }
    });

    console.log('✅ Angular AuthService: postMessage listener initialized');
  }

  /**
   * Request initial auth status from remote app
   */
  requestInitialAuthStatus() {
    setTimeout(() => {
      console.log('🔍 Angular AuthService: Requesting initial auth status...');

      window.postMessage({
        type: 'REQUEST_AUTH_STATUS',
        payload: { timestamp: Date.now() }
      }, '*');

      // Timeout fallback
      setTimeout(() => {
        const currentState = this.authStateSubject.value;
        if (currentState.isLoading) {
          console.log('⚠️ Angular AuthService: Auth check timeout, marking as not loading');
          this.authStateSubject.next({
            ...currentState,
            isLoading: false
          });
        }
      }, 3000);
    }, 500);
  }

  /**
   * Make secure API request through remote app proxy
   * @param endpoint - API endpoint path
   * @param options - Fetch options (method, body, headers)
   */
  makeSecureAPIRequest(endpoint, options = {}) {
    const currentState = this.authStateSubject.value;

    if (!currentState.isAuthenticated) {
      return Promise.reject(new Error('Not authenticated - please login first'));
    }

    const requestId = this.generateRequestId();
    console.log(`📤 Angular AuthService: Requesting API call: ${endpoint} (ID: ${requestId})`);

    return new Promise((resolve, reject) => {
      // Store request handlers
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error('API request timeout - remote app may not be responding'));
      }, 10000);

      this.pendingRequests.set(requestId, {
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      });

      // Send API request to remote app via postMessage
      const apiRequest = {
        type: 'API_REQUEST',
        payload: {
          endpoint: endpoint.replace('http://localhost:3002/api', ''), // Strip base URL
          options: {
            method: options.method || 'GET',
            body: options.body,
            headers: options.headers
          },
          requestId
        }
      };

      window.postMessage(apiRequest, '*');
      console.log(`📨 Angular AuthService: API request sent (ID: ${requestId})`);
    });
  }

  /**
   * Handle API response from remote app
   */
  handleApiResponse(payload) {
    const { requestId, success, data, error, status } = payload;

    console.log(`📥 Angular AuthService: API response received (ID: ${requestId})`);

    const pendingRequest = this.pendingRequests.get(requestId);
    if (pendingRequest) {
      this.pendingRequests.delete(requestId);

      if (success) {
        // Create Response-like object
        const response = {
          ok: status < 400,
          status,
          json: () => Promise.resolve(data),
          text: () => Promise.resolve(JSON.stringify(data)),
          data // Direct access to data
        };
        pendingRequest.resolve(response);
      } else {
        pendingRequest.reject(new Error(error || 'API request failed'));
      }
    }
  }

  /**
   * Generate unique request ID
   */
  generateRequestId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.authStateSubject.value.isAuthenticated;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.authStateSubject.value.user;
  }
}
