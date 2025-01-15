import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MainViewComponent } from './components/main-view/main-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MainViewComponent, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EmployeeManagementService';
}
