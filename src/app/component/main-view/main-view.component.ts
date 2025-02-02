import Keycloak from 'keycloak-js';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DrawerPanelComponent } from "../drawer-panel/drawer-panel.component";

@Component({
  selector: 'app-main-view',
  imports: [RouterLink, MatIconModule, MatSlideToggleModule, DrawerPanelComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss',
  standalone: true,
})
export class MainViewComponent {
  isDarkMode: boolean = true;
  isLoading: boolean = true;

  private keycloak = inject(Keycloak);

  logout() {
    this.keycloak.logout({
      redirectUri: window.location.origin + '/',
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }
}
