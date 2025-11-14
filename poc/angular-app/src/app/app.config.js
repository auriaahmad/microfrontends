import { provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

export const appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    
  ]
};
