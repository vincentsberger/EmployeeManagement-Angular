import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-main-view',
  imports: [RouterOutlet, RouterLink, MatIconModule, MatSlideToggleModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss',
  standalone: true,
})
export class MainViewComponent {
  isDarkMode: boolean = true;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }
}
