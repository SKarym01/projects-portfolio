// Import the Keycloak service from the keycloak-angular package
import { KeycloakService } from 'keycloak-angular';

// Import the Keycloak configuration (usually includes realm, clientId, URL)
import keycloakConfig from './keycloak.config';

/**
 * Function to initialize Keycloak during Angular app startup
 * This function is typically provided in the `APP_INITIALIZER` in app.module.ts
 *
 * @param keycloak - an instance of the KeycloakService
 * @returns a function that returns a Promise, indicating whether initialization succeeded
 */
export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
    keycloak.init({
      // Keycloak configuration: realm, clientId, and Keycloak server URL
      config: keycloakConfig,
      initOptions: {
        // Disables the periodic login status check via hidden iframe
        checkLoginIframe: false,
      },
      // Automatically adds the access token to HTTP requests via interceptor
      enableBearerInterceptor: true,
    });
}
