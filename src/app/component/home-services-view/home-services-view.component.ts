import Keycloak from 'keycloak-js';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home-services-view',
  imports: [MatCardModule, MatButtonModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './home-services-view.component.html',
  styleUrl: './home-services-view.component.css',
})
export class HomeServicesViewComponent {
  protected isLoading: boolean = false;
  private keycloak = inject(Keycloak);
  private router = inject(Router);

  startEMS() {
    if (this.keycloak.authenticated) {
      this.router.navigate(["/home"]);
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.keycloak.login({
        redirectUri: window.location.origin + '/home',
      });
      this.isLoading = false;
    }, 1000);
  }
}
