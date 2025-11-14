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
      // Load both AuthProvider and LoginComponent
      const authModule = await this.remoteLoader.loadRemote(
        'http://localhost:3001/remoteEntry.js',
        'remoteCounter',
        './AuthProvider'
      );

      const loginModule = await this.remoteLoader.loadRemote(
        'http://localhost:3001/remoteEntry.js',
        'remoteCounter',
        './LoginComponent'
      );

      const AuthProvider = authModule.default || authModule.AuthProvider || authModule;
      const LoginComponent = loginModule.default || loginModule;

      // Get the container element
      const container = this.elementRef.nativeElement.firstChild;

      // Create React root and render LoginComponent wrapped in AuthProvider
      this.reactRoot = ReactDOM.createRoot(container);
      this.reactRoot.render(
        React.createElement(
          AuthProvider,
          null,
          React.createElement(LoginComponent)
        )
      );

    } catch (error) {
      console.error('Failed to load remote LoginComponent:', error);
      const container = this.elementRef.nativeElement.firstChild;
      container.innerHTML = `<div style="color: red; padding: 20px;">
        Error loading LoginComponent: ${error.message}
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
