import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MainViewComponent } from './components/main-view/main-view.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        MainViewComponent,
        MatIconModule,
        RouterOutlet,
        RouterLinkActive,
        RouterLink,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: true,
})
export class AppComponent {
  title = 'EmployeeManagementService';
}
