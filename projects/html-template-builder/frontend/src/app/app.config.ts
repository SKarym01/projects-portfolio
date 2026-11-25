// Angular core and HTTP/router setup
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Application routes
import { routes } from './app.routes';

// Keycloak integration
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthService } from './auth copy/service/auth.service';
import { initializeKeycloak } from './auth copy/keycloak-initializer';

// Main application configuration for standalone app bootstrap
export const appConfig: ApplicationConfig = {
  providers: [
    // Custom authentication service
    AuthService,

    // Provide Angular router with app-specific routes
    provideRouter(routes),

    // Provide HTTP client with dependency-injected interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // Import Keycloak module for dependency injection
    importProvidersFrom(KeycloakAngularModule),

    // Initialize Keycloak before the app starts
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak, // Function that runs on app init
      deps: [KeycloakService], // Dependencies injected into the factory
      multi: true, // Allows multiple initializers
    },

    // Register KeycloakService for DI
    KeycloakService,
  ],
};
