import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div style="font-family: Arial, sans-serif;">
      <div style="text-align: center; padding: 20px; background: #f5f5f5;">
        <h1 style="color: #1976d2; margin: 0;">Welcome to {{ title }}!</h1>
      </div>

      <!-- Remote Header from React App -->
      <app-remote-header></app-remote-header>

      <div style="text-align: center; padding: 50px;">
        <div style="margin-top: 40px; padding: 20px; border: 2px solid #1976d2; border-radius: 8px;">
          <h2>Remote React Login Component</h2>
          <p style="color: #666;">Login component from http://localhost:3001</p>
          <app-remote-login></app-remote-login>
        </div>

        <div style="margin-top: 40px; padding: 20px; border: 2px solid #1976d2; border-radius: 8px;">
          <h2>Remote React Counter Component</h2>
          <p style="color: #666;">Counter from http://localhost:3001</p>
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
      margin-bottom: 10px;
    }
    h2 {
      color: #424242;
    }
    ul li {
      padding: 8px;
      margin: 5px 0;
      font-size: 1.1em;
    }
  `]
})
export class App {
  title = 'angular-app';
}
