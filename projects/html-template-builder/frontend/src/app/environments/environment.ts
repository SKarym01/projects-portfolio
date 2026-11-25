// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentDTO } from '../environments/EnvironmentDTO';

export const environment: EnvironmentDTO = {
  production: false,
  nctIitPortfolioUrl: '',
  admin_mail: '',
  api_key: '',
  app_title: '',
  app_header: '',
  login_role: '',
  keycloak: {
    url: '',
    realm: '',
    clientId: '',
  },
};
