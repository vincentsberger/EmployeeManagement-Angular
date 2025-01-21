import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { RouterOutlet, RouterLink } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatIconModule,
    RouterOutlet
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = 'EmployeeManagementService';

}
