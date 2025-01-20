import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-login-view',
  standalone: true,
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css'],
})
export class LoginViewComponent {
  constructor(private keycloakService: KeycloakService) {}

  login(): void {
    this.keycloakService.login({
      redirectUri: window.location.origin + '/home-view',
    });
  }
}
