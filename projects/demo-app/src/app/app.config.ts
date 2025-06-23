import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { ADDRESS_AUTOCOMPLETE_CONFIG } from 'hls-address';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    {
      provide: ADDRESS_AUTOCOMPLETE_CONFIG,
      useValue: {
        apiKey: environment.apiKey,
        countryCode: 'us',
        type: 'street',
        limit: 5,
        bias: 'proximity:-74.0059,40.7128',
        lang: 'en',
      },
    },
  ]
};
