import { Component, ElementRef } from '@angular/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RemoteLoaderService } from './remote-loader.service';

@Component({
  selector: 'app-react-wrapper',
  standalone: false,
  template: '<div #reactContainer></div>',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ReactWrapperComponent {
  static parameters = [ElementRef, RemoteLoaderService];

  reactRoot = null;

  constructor(elementRef, remoteLoader) {
    this.elementRef = elementRef;
    this.remoteLoader = remoteLoader;
  }

  async ngOnInit() {
    try {
      // Load the remote counter component
      const module = await this.remoteLoader.loadRemote(
        'http://localhost:3001/remoteEntry.js',
        'remoteCounter',
        './UnsyncedCounter'
      );

      const ReactComponent = module.default || module;

      // Get the container element
      const container = this.elementRef.nativeElement.querySelector('[reactcontainer]') ||
                       this.elementRef.nativeElement.firstChild;

      // Create React root and render
      this.reactRoot = ReactDOM.createRoot(container);
      this.reactRoot.render(React.createElement(ReactComponent));

    } catch (error) {
      console.error('Failed to load remote React component:', error);
      const container = this.elementRef.nativeElement.firstChild;
      container.innerHTML = `<div style="color: red; padding: 20px;">
        Error loading remote component: ${error.message}
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
