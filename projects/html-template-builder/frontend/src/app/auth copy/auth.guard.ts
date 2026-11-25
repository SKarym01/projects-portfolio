// Importing Angular core and router modules
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

// Importing Keycloak guard base class and custom authentication service
import { KeycloakAuthGuard } from 'keycloak-angular';
import { AuthService } from './service/auth.service';

// Makes this guard injectable and available application-wide
@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  // Inject Angular's Router and the custom AuthService
  constructor(
    protected override readonly router: Router,
    protected readonly auth: AuthService
  ) {
    // Call parent constructor with router and Keycloak service instance
    super(router, auth.keycloakService);
  }

  /**
   * Method that decides whether the user can access a route
   */
  async isAccessAllowed(): Promise<boolean | UrlTree> {
    // Loads user profile and roles (non-blocking)
    this.auth.getUserDetails();

    // If the user is not authenticated, trigger login and redirect back to this page after login
    if (!this.authenticated) {
      await this.keycloakAngular.login({
        redirectUri: window.location.href,
      });
    }

    // TODO: Extend this logic for role-based permissions if needed
    // Example: restrict access to users with specific role(s)
    // const hasPermission = this.authenticated && this.auth.getRoles().includes('geschäftsstelle');

    const hasPermission = this.authenticated; // Currently just checks if user is logged in

    // If access is not allowed, redirect to the error page with a message
    if (!hasPermission) {
      return this.router.createUrlTree(['/error'], {
        queryParams: {
          errorMsg:
            'Sie haben leider keine Berechtigung, auf diesen Bereich zuzugreifen. Bitte wenden Sie sich an den Administrator, wenn Sie der Meinung sind, dass dies ein Fehler ist.',
        },
      });
    }

    // Otherwise, allow access to the route
    return true;
  }
}
