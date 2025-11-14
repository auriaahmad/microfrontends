import { Component } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * API Test Component - Angular native component for testing secure API calls
 * Only functional when user is authenticated
 */
@Component({
  selector: 'app-api-test',
  standalone: false,
  template: `
    <div style="border: 2px solid #ff5722; padding: 20px; margin: 20px 0; border-radius: 8px; background: #fff3e0;">
      <h3 style="color: #ff5722; margin-top: 0;">🧪 Angular Native API Testing (Secure Proxy)</h3>

      <!-- Auth Status Display -->
      <div [style.background]="authState.isAuthenticated ? '#d4edda' : '#ffebee'"
           style="padding: 10px; border-radius: 4px; margin-bottom: 15px;">
        <strong>Status:</strong>
        <span [style.color]="authState.isAuthenticated ? '#28a745' : '#dc3545'">
          {{ authState.isAuthenticated ? '🟢 Authenticated' : '🔴 Not Authenticated' }}
        </span>
        <br *ngIf="authState.isAuthenticated && authState.user">
        <small *ngIf="authState.isAuthenticated && authState.user">
          <strong>User:</strong> {{ authState.user.username }} |
          <strong>Role:</strong> {{ authState.user.role }}
        </small>
      </div>

      <!-- Security Notice -->
      <div style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; color: #1976d2;">
        🔒 <strong>Security:</strong> All API calls are proxied through the remote app.
        No direct backend access from Angular. Tokens never leave the remote app.
      </div>

      <!-- API Test Button -->
      <button
        (click)="testSecureAPI()"
        [disabled]="!authState.isAuthenticated || isTesting"
        [style.background]="authState.isAuthenticated && !isTesting ? '#28a745' : '#ccc'"
        [style.cursor]="authState.isAuthenticated && !isTesting ? 'pointer' : 'not-allowed'"
        style="color: white; border: none; padding: 12px 24px; border-radius: 4px; font-size: 16px; font-weight: bold;">
        {{ isTesting ? 'Testing via Remote...' : 'Test API via Remote Proxy' }}
        <span *ngIf="isTesting" class="loading-spinner"></span>
      </button>

      <!-- API Response Display -->
      <div *ngIf="apiResponse" style="margin-top: 15px;">
        <h4 [style.color]="apiResponse.success ? '#28a745' : '#dc3545'">
          {{ apiResponse.success ? '✅ Secure API Response (via Remote Proxy):' : '❌ API Error:' }}
        </h4>

        <div *ngIf="apiResponse.success"
             style="background: #e8f5e8; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; color: #2e7d32;">
          🔒 <strong>Security Notice:</strong> This data was retrieved through the remote app proxy.
          No tokens were exposed to Angular.
        </div>

        <div *ngIf="!apiResponse.success"
             style="background: #f8d7da; padding: 10px; border-radius: 4px; margin-bottom: 15px; color: #721c24;">
          {{ apiResponse.error }}
        </div>

        <pre *ngIf="apiResponse.success"
             style="background: #f8f9fa; padding: 15px; border-radius: 4px; overflow: auto; border: 1px solid #e0e0e0; font-size: 12px;">{{ apiResponse.data }}</pre>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-left: 10px;
      vertical-align: middle;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class ApiTestComponent {
  static parameters = [AuthService];

  authState = {
    isAuthenticated: false,
    user: null,
    isLoading: true
  };

  isTesting = false;
  apiResponse = null;
  authSubscription = null;

  constructor(authService) {
    this.authService = authService;
  }

  ngOnInit() {
    console.log('🔵 Angular ApiTestComponent: Initializing...');

    // Subscribe to auth state changes
    this.authSubscription = this.authService.authState$.subscribe(state => {
      console.log('🔵 Angular ApiTestComponent: Auth state updated:', state);
      this.authState = state;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async testSecureAPI() {
    console.log('🧪 Angular ApiTestComponent: Testing API via remote proxy...');

    this.isTesting = true;
    this.apiResponse = null;

    try {
      const response = await this.authService.makeSecureAPIRequest('http://localhost:3002/api/user/profile');

      if (response.ok) {
        const data = await response.json();

        this.apiResponse = {
          success: true,
          data: JSON.stringify(data, null, 2)
        };

        console.log('✅ Angular ApiTestComponent: API test successful');
      } else {
        throw new Error(`API returned status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Angular ApiTestComponent: API test failed:', error);

      this.apiResponse = {
        success: false,
        error: error.message
      };
    } finally {
      this.isTesting = false;
    }
  }
}
