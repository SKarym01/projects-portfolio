export interface EnvironmentDTO {
  [x: string]: unknown;
  //Is this a production environment
  production: boolean;
  //API-Key for communication with other SUDO systems
  api_key: string;
  //Titel of the application
  app_title: string;
  //Header for main component
  app_header: string;
  //Role needed to login the application
  login_role: string;
  //Optional external studies overview link
  nctIitPortfolioUrl: string;
  //Keycloak configurations
  keycloak: KeycloaktDTO;
  //admin mail for error messages, shown to the user
  admin_mail: string;
}
export interface KeycloaktDTO {
  url: string;
  realm: string;
  clientId: string;
}
