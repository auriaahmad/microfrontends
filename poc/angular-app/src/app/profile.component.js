import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  template: `
    <div style="font-family: Arial, sans-serif;">
      <!-- Remote Header from React App -->
      <app-remote-header></app-remote-header>

      <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1976d2; margin-bottom: 30px;">User Profile</h1>

        <!-- Loading State -->
        <div *ngIf="authState.isLoading" style="text-align: center; padding: 50px;">
          <div style="font-size: 18px; color: #666; margin-bottom: 10px;">
            🔄 Checking authentication status...
          </div>
          <div class="loading-spinner"></div>
        </div>

        <!-- Authenticated Profile -->
        <div *ngIf="!authState.isLoading && authState.isAuthenticated && authState.user"
             style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #424242; margin-bottom: 20px;">👤 Profile Information</h2>

          <div style="background: #e8f5e8; padding: 10px; border-radius: 4px; margin-bottom: 20px; font-size: 12px; color: #2e7d32;">
            🔒 <strong>Security Notice:</strong> Profile data retrieved securely through remote authentication system.
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="display: block; margin-bottom: 5px; color: #666;">Username:</strong>
            <p style="margin: 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">{{ authState.user.username }}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="display: block; margin-bottom: 5px; color: #666;">Email:</strong>
            <p style="margin: 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">{{ authState.user.email }}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="display: block; margin-bottom: 5px; color: #666;">Role:</strong>
            <p style="margin: 0; padding: 10px; border-radius: 4px;"
               [style.background]="authState.user.role === 'admin' ? '#ff5722' : '#2196F3'"
               [style.color]="'white'"
               [style.display]="'inline-block'"
               [style.padding]="'8px 16px'">
              {{ authState.user.role }}
            </p>
          </div>

          <div style="margin-top: 30px; display: flex; gap: 15px;">
            <button (click)="goToDashboard()"
                    style="background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
              🏠 Back to Dashboard
            </button>
          </div>
        </div>

        <!-- Unauthorized State -->
        <div *ngIf="!authState.isLoading && !authState.isAuthenticated"
             style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; border: 2px solid #f44336;">
          <div style="font-size: 64px; margin-bottom: 20px;">🔐</div>
          <h2 style="color: #f44336;">Unauthorized Access</h2>
          <p style="color: #666; margin: 20px 0;">
            <strong>User is not authenticated.</strong><br>
            You need to be authenticated to access this profile page.
          </p>

          <div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin: 20px 0; font-size: 12px; color: #856404;">
            💡 <strong>Tip:</strong> Please login through the dashboard first, then return to this page.
          </div>

          <div style="display: flex; gap: 15px; justify-content: center;">
            <button (click)="goToDashboard()"
                    style="background: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">
              🏠 Go to Dashboard
            </button>
            <button (click)="refresh()"
                    style="background: #ff9800; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    h1 {
      color: #1976d2;
    }
    h2 {
      color: #424242;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2196F3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: inline-block;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class ProfileComponent {
  static parameters = [AuthService, Router];

  authState = {
    isAuthenticated: false,
    user: null,
    isLoading: true
  };

  authSubscription = null;

  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }

  ngOnInit() {
    console.log('🔵 Angular ProfileComponent: Initializing...');

    // Subscribe to auth state changes
    this.authSubscription = this.authService.authState$.subscribe(state => {
      console.log('🔵 Angular ProfileComponent: Auth state updated:', state);
      this.authState = state;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  goToDashboard() {
    this.router.navigate(['/']);
  }

  refresh() {
    window.location.reload();
  }
}
