import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RemoteLoaderService {
  constructor() {
    this.loadedScripts = new Map();
  }

  /**
   * Load a remote Module Federation entry
   * @param {string} remoteUrl - URL to remoteEntry.js
   * @param {string} scope - The remote scope name (e.g., 'remoteCounter')
   * @returns {Promise<any>} The remote container
   */
  async loadRemoteEntry(remoteUrl, scope) {
    // Return cached if already loaded
    if (this.loadedScripts.has(scope)) {
      return window[scope];
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = remoteUrl;
      script.type = 'text/javascript';
      script.async = true;

      script.onload = () => {
        // Initialize the container
        if (window[scope]) {
          this.loadedScripts.set(scope, true);
          resolve(window[scope]);
        } else {
          reject(new Error(`Remote container ${scope} not found`));
        }
      };

      script.onerror = () => {
        reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Load a specific module from a remote container
   * @param {string} remoteUrl - URL to remoteEntry.js
   * @param {string} scope - The remote scope name
   * @param {string} module - The module path (e.g., './Counter')
   * @returns {Promise<any>} The loaded module
   */
  async loadRemoteModule(remoteUrl, scope, module) {
    try {
      // Load the remote container
      const container = await this.loadRemoteEntry(remoteUrl, scope);

      // Initialize the container if needed
      await container.init(__webpack_share_scopes__.default);

      // Load the specific module
      const factory = await container.get(module);
      const Module = factory();

      return Module;
    } catch (error) {
      console.error('Error loading remote module:', error);
      throw error;
    }
  }

  /**
   * Simplified loader that uses global webpack share scopes
   * @param {string} remoteUrl - URL to remoteEntry.js
   * @param {string} scope - The remote scope name
   * @param {string} module - The module path
   * @returns {Promise<any>} The loaded module
   */
  async loadRemote(remoteUrl, scope, module) {
    try {
      const container = await this.loadRemoteEntry(remoteUrl, scope);

      // For non-webpack hosts, we need to provide a shared scope with React
      if (typeof window.__webpack_share_scopes__ === 'undefined') {
        window.__webpack_share_scopes__ = { default: {} };
      }

      // Ensure shared scope has React and ReactDOM from Angular's imports
      const sharedScope = window.__webpack_share_scopes__.default;

      // Import React dynamically if not in shared scope
      if (!sharedScope.react) {
        const reactModule = await import('react');
        const reactDomModule = await import('react-dom');

        sharedScope.react = {
          '19.2.0': {
            get: () => Promise.resolve(() => reactModule),
            loaded: true,
            from: 'angular-app'
          }
        };

        sharedScope['react-dom'] = {
          '19.2.0': {
            get: () => Promise.resolve(() => reactDomModule),
            loaded: true,
            from: 'angular-app'
          }
        };

        console.log('📦 RemoteLoader: Added React to shared scope from Angular app');
      }

      await container.init(sharedScope);
      const factory = await container.get(module);
      const Module = factory();

      return Module;
    } catch (error) {
      console.error('Failed to load remote:', error);
      throw error;
    }
  }
}
