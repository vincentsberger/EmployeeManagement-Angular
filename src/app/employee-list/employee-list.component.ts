import Keycloak from 'keycloak-js';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from '../Employee';
import { MainViewComponent } from '../components/main-view/main-view.component';
import { includeBearerTokenInterceptor } from 'keycloak-angular';

@Component({
  standalone: true,
  selector: 'app-employee-list',
  imports: [CommonModule, MainViewComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  employees$: Observable<Employee[]>;

  constructor(private http: HttpClient) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>(
      'http://localhost:8089/employees',
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
  }
}
