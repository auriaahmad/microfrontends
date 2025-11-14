import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div style="font-family: Arial, sans-serif;">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #fafafa;
    }
  `]
})
export class App {
  static parameters = [Router];

  constructor(router) {
    this.router = router;
    this.currentPath = '/';

    // Listen to route changes to update Header
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.url;
        console.log('🔵 Angular: Route changed to:', this.currentPath);
      }
    });
  }
}
