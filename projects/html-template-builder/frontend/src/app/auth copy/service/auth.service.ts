// Angular core imports
import { inject, Injectable } from '@angular/core';

// Keycloak types and services
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';

// RxJS imports for state management
import { BehaviorSubject, Observable } from 'rxjs';

// import { LogService } from '../../components/utils/log-service/log.service'; // (optional logging service)

// Mark this service as injectable and available globally
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Inject the Keycloak service used for authentication
  keycloakService: KeycloakService = inject(KeycloakService);

  // Subjects to manage and emit user details and roles
  private userDetailsSubject: BehaviorSubject<KeycloakProfile> =
    new BehaviorSubject<KeycloakProfile>({});
  private userRolesSubject = new BehaviorSubject<string[]>([]);

  // Public observables for other components to subscribe to
  public userDetails$: Observable<KeycloakProfile> =
    this.userDetailsSubject.asObservable();
  public userRoles$: Observable<string[]> = this.userRolesSubject.asObservable();

  // Optional logger initialization
  // protected logger = inject(LogService).getLogger('AuthService');

  /**
   * Loads user profile and roles if the user is logged in,
   * then updates the relevant subjects.
   */
  public async getUserDetails() {
    if (await this.keycloakService.isLoggedIn()) {
      const userDetails = await this.loadUserProfile();
      this.userDetailsSubject.next(userDetails);
      this.userRolesSubject.next(this.keycloakService.getUserRoles());
    }
  }

  /**
   * Returns whether the user is currently logged in.
   */
  public isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  /**
   * Loads the Keycloak user profile (e.g. name, email).
   */
  public loadUserProfile(): Promise<KeycloakProfile> {
    return this.keycloakService.loadUserProfile();
  }

  /**
   * Initiates the login process via Keycloak.
   */
  public login(): void {
    this.keycloakService.login();
  }

  /**
   * Initiates the logout process and redirects the user to the home page.
   */
  public logout(): void {
    this.keycloakService.logout(window.location.origin);
  }

  /**
   * Retrieves the current user roles from Keycloak.
   */
  public getRoles() {
    return this.keycloakService.getUserRoles();
  }

  /**
   * Checks if the user has the 'geschäftsstelle' role.
   */
  public isGS(): boolean {
    return this.getRoles().includes('geschäftsstelle');
  }

  /**
   * Checks if the user has the 'admin' role based on the reactive role state.
   */
  public isAdmin(): boolean {
    return this.userRolesSubject.getValue().includes('admin');
  }
}
