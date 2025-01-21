import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { LoginViewComponent } from './components/login-view/login-view.component';
import { MainViewComponent } from './components/main-view/main-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginViewComponent, MainViewComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'lf10StarterNew';
  isLoggedIn = false;

  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();

    if (this.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }
}
