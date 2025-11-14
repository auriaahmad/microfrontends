import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div style="font-family: Arial, sans-serif;">
      <!-- Remote Header from React App -->
      <app-remote-header></app-remote-header>

      <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1976d2; margin-bottom: 30px;">Dashboard</h1>

        <!-- Login Component -->
        <div style="margin-bottom: 40px; padding: 20px; border: 2px solid #1976d2; border-radius: 8px; background: white;">
          <h2 style="color: #424242; margin-bottom: 15px;">Authentication</h2>
          <p style="color: #666; margin-bottom: 20px;">Login component from http://localhost:3001</p>
          <app-remote-login></app-remote-login>
        </div>

        <!-- Counter Component -->
        <div style="padding: 20px; border: 2px solid #4CAF50; border-radius: 8px; background: white;">
          <h2 style="color: #424242; margin-bottom: 15px;">Remote React Counter Component</h2>
          <p style="color: #666; margin-bottom: 20px;">Counter from http://localhost:3001</p>
          <app-react-wrapper></app-react-wrapper>
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
export class DashboardComponent {
  constructor() {}
}
