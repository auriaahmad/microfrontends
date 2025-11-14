import { Component, ElementRef } from '@angular/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RemoteLoaderService } from './remote-loader.service';

@Component({
  selector: 'app-remote-login',
  standalone: false,
  template: '<div></div>',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RemoteLoginComponent {
  static parameters = [ElementRef, RemoteLoaderService];

  reactRoot = null;

  constructor(elementRef, remoteLoader) {
    this.elementRef = elementRef;
    this.remoteLoader = remoteLoader;
  }

  async ngOnInit() {
    try {
      console.log('🔵 Angular: Starting to load LoginComponent and AuthProvider');

      // Load both AuthProvider and LoginComponent from remote
      const authModule = await this.remoteLoader.loadRemote(
        'http://localhost:3001/remoteEntry.js',
        'remoteCounter',
        './AuthProvider'
      );

      console.log('🔵 Angular: AuthProvider module loaded:', authModule);

      const loginModule = await this.remoteLoader.loadRemote(
        'http://localhost:3001/remoteEntry.js',
        'remoteCounter',
        './LoginComponent'
      );

      console.log('🔵 Angular: LoginComponent module loaded:', loginModule);

      // Extract the actual components
      const AuthProvider = authModule.default || authModule.AuthProvider || authModule;
      const LoginComponent = loginModule.default || loginModule;

      console.log('🔵 Angular: AuthProvider type:', typeof AuthProvider);
      console.log('🔵 Angular: LoginComponent type:', typeof LoginComponent);

      if (!AuthProvider || typeof AuthProvider !== 'function') {
        throw new Error('AuthProvider is not a valid React component');
      }

      if (!LoginComponent || typeof LoginComponent !== 'function') {
        throw new Error('LoginComponent is not a valid React component');
      }

      // Get the container element
      const containerElement = this.elementRef.nativeElement.firstChild;

      console.log('🔵 Angular: Creating React root and rendering...');

      // Create React root and render LoginComponent wrapped in AuthProvider
      this.reactRoot = ReactDOM.createRoot(containerElement);
      this.reactRoot.render(
        React.createElement(
          AuthProvider,
          null,
          React.createElement(LoginComponent)
        )
      );

      console.log('🔵 Angular: LoginComponent rendered successfully!');

    } catch (error) {
      console.error('❌ Angular: Failed to load remote LoginComponent:', error);
      console.error('❌ Angular: Error stack:', error.stack);
      const containerElement = this.elementRef.nativeElement.firstChild;
      containerElement.innerHTML = `<div style="color: red; padding: 20px; border: 2px solid red; border-radius: 8px;">
        <h3>Error loading LoginComponent</h3>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Check the browser console for more details.</strong></p>
      </div>`;
    }
  }

  ngOnDestroy() {
    // Unmount React component
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }
}
