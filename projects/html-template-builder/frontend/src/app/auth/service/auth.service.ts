import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { environment } from '../../../environments/enviroment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public keycloakService: KeycloakService) {}

  public getLoggedUser(): KeycloakTokenParsed | undefined {
    try {
      return this.keycloakService.getKeycloakInstance().idTokenParsed;
    } catch (e) {
      console.error("can't get logged user", e);
      return undefined;
    }
  }

  public isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  public loadUserProfile(): Promise<KeycloakProfile> {
    return this.keycloakService.loadUserProfile();
  }

  public login(): void {
    this.keycloakService.login();
  }

  public logout(): void {
    this.keycloakService.logout(window.location.origin);
  }

  public getRoles() {
    return this.keycloakService.getUserRoles();
  }

  public loginAllowed(): boolean {
    return this.getRoles().includes(environment.login_role);
  }
}
