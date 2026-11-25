// Importing necessary modules from Angular core and router
import { Injectable } from '@angular/core';
import { UrlTree, Router } from '@angular/router';

// Importing Keycloak's authentication guard and custom AuthService
import { KeycloakAuthGuard } from 'keycloak-angular';
import { AuthService } from './service/auth.service';

// This decorator marks the class as injectable and available application-wide
@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  // Constructor that initializes the router and custom AuthService
  constructor(
    protected override readonly router: Router,
    protected readonly auth: AuthService
  ) {
    // Calls the parent KeycloakAuthGuard constructor, passing the router and Keycloak service from AuthService
    super(router, auth.keycloakService);
  }

  // Method to check if access to a route is allowed
  async isAccessAllowed(): Promise<boolean | UrlTree> {
    // If the user is not authenticated, trigger Keycloak login and redirect back to current page after login
    if (!this.authenticated) {
      await this.keycloakAngular.login({
        redirectUri: window.location.href,
      });
    }

    // Determine if user has permission: they must be authenticated and have custom loginAllowed logic fulfilled
    const hasPermission = this.authenticated && this.auth.loginAllowed();

    // If the user does not have permission, redirect to an error page with a descriptive message
    if (!hasPermission) {
      return this.router.createUrlTree(['/error'], {
        queryParams: {
          errorMsg:
            'Sie haben leider keine Berechtigung, auf diesen Bereich zuzugreifen. Bitte wenden Sie sich an den Administrator, wenn Sie der Meinung sind, dass dies ein Fehler ist.',
        },
      });
    }

    // If all checks pass, grant access to the route
    return true;
  }
}
