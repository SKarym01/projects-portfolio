// Importing environment-specific variables (e.g. dev, prod)
import { environment } from '../environments/environment';

// Importing the KeycloakConfig type for strong typing support
import { KeycloakConfig } from 'keycloak-js';

// Creating the Keycloak configuration object using values from the environment file
const keycloakConfig: KeycloakConfig = {
  // URL of the Keycloak authentication server
  url: environment.keycloak.url,

  // Name of the realm to authenticate against
  realm: environment.keycloak.realm,

  // ID of the client application registered in Keycloak
  clientId: environment.keycloak.clientId,
};

// Exporting the configuration as the default export
export default keycloakConfig;
