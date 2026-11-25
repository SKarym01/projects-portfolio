import { KeycloakService } from 'keycloak-angular';
import keycloakConfig from '../../environments/enviroment/keycloak.config';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: keycloakConfig,
      initOptions: {
        checkLoginIframe: false,
      },
    });
}
