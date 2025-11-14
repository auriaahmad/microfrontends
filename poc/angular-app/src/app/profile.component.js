import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: false,
  template: `
    <div style="font-family: Arial, sans-serif;">
      <!-- Remote Header from React App -->
      <app-remote-header></app-remote-header>

      <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1976d2; margin-bottom: 30px;">User Profile</h1>

        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #424242; margin-bottom: 20px;">Profile Information</h2>

          <div style="margin-bottom: 20px;">
            <strong style="display: block; margin-bottom: 5px; color: #666;">Username:</strong>
            <p style="margin: 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">admin</p>
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="display: block; margin-bottom: 5px; color: #666;">Email:</strong>
            <p style="margin: 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">admin@example.com</p>
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="display: block; margin-bottom: 5px; color: #666;">Role:</strong>
            <p style="margin: 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">Administrator</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 4px;">
            <p style="margin: 0; color: #1976d2; font-size: 14px;">
              <strong>Note:</strong> This is a profile page rendered in the Angular app.
              In a real application, this would fetch user data from the authenticated session.
            </p>
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
  `]
})
export class ProfileComponent {
  constructor() {}
}
