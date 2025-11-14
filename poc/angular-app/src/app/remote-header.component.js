import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RemoteLoaderService } from './remote-loader.service';

@Component({
  selector: 'app-remote-header',
  standalone: false,
  template: '<div></div>',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RemoteHeaderComponent {
  static parameters = [ElementRef, RemoteLoaderService, Router];

  reactRoot = null;

  constructor(elementRef, remoteLoader, router) {
    this.elementRef = elementRef;
    this.remoteLoader = remoteLoader;
    this.router = router;
  }

  async ngOnInit() {
    try {
      // Load the remote Header component
      const module = await this.remoteLoader.loadRemote(
        'http://localhost:3001/remoteEntry.js',
        'remoteCounter',
        './Header'
      );

      const ReactComponent = module.default || module;

      // Get the container element
      const container = this.elementRef.nativeElement.firstChild;

      // Determine current page based on route
      const currentPath = this.router.url;
      const currentPage = currentPath === '/profile' ? 'profile' : 'dashboard';

      // Navigation handler
      const handleNavigate = (page) => {
        console.log('🔵 Angular: Header navigation clicked:', page);
        if (page === 'dashboard') {
          this.router.navigate(['/']);
        } else if (page === 'profile') {
          this.router.navigate(['/profile']);
        }
      };

      // Create React root and render with props
      this.reactRoot = ReactDOM.createRoot(container);
      this.reactRoot.render(
        React.createElement(ReactComponent, {
          currentPage: currentPage,
          onNavigate: handleNavigate
        })
      );

      console.log('🔵 Angular: Header rendered with currentPage:', currentPage);

    } catch (error) {
      console.error('Failed to load remote Header component:', error);
      const container = this.elementRef.nativeElement.firstChild;
      container.innerHTML = `<div style="color: red; padding: 20px;">
        Error loading Header: ${error.message}
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
