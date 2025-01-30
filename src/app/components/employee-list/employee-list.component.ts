import Keycloak from 'keycloak-js';
import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Employee} from '../../model/Employee';
import {MainViewComponent} from '../main-view/main-view.component';
import {FormsModule} from "@angular/forms";
import {map} from 'rxjs/operators';
import {Router, RouterLink} from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-employee-list',
  imports: [CommonModule, MainViewComponent, FormsModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  employees$: Observable<Employee[]>;
  filteredEmployees$: Observable<Employee[]>;
  searchQuery: string = '';

  sortStatus = {
    firstName: 0,
    lastName: 0,
  };

  constructor(private http: HttpClient, private router: Router) {
    this.employees$ = of([]);
    this.filteredEmployees$ = this.employees$;
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
    this.filteredEmployees$ = this.employees$;
  }

  searchEmployees() {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredEmployees$ = this.employees$.pipe(
      map(employees =>
        employees.filter(employee => {
          const fullName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.toLowerCase();
          return fullName.includes(query);
        })
      )
    );
  }

  onSearchChange() {
    this.searchEmployees();
  }

  deleteEmployee(employeeId: number): void {
    if (!window.confirm('Möchten Sie diesen Mitarbeiter wirklich löschen?')) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.bearer}`,
    });

    this.http.delete(`http://localhost:8089/employees/${employeeId}`, { headers })
      .subscribe({
        next: () => this.fetchData(),
        error: (err) => console.error('Fehler beim Löschen des Mitarbeiters:', err),
      });
  }

  toggleSortByFirstName(firstName: string) {
    this.sortStatus.firstName = this.getNextSortOrder(this.sortStatus.firstName);
    this.sortEmployees();
  }

  toggleSortByLastName(lastName: string) {
    this.sortStatus.lastName = this.getNextSortOrder(this.sortStatus.lastName);
    this.sortEmployees();
  }

  private getNextSortOrder(currentSortOrder: number): number {
    switch (currentSortOrder) {
      case 0: return 1;
      case 1: return -1;
      default: return 0;
    }
  }

  private sortEmployees() {
    this.filteredEmployees$ = this.employees$.pipe(
      map((employees) => {
        return [...employees].sort((a, b) => {
          let compareResult = 0;

          if (this.sortStatus.firstName !== 0) {
            compareResult = (a.firstName ?? '').localeCompare(b.firstName ?? '') * this.sortStatus.firstName;
          }

          if (compareResult === 0 && this.sortStatus.lastName !== 0) {
            compareResult = (a.lastName ?? '').localeCompare(b.lastName ?? '') * this.sortStatus.lastName;
          }

          return compareResult;
        });
      })
    );
  }

  getSortIcon(field: 'firstName' | 'lastName'): string {
    switch (this.sortStatus[field]) {
      case 1: return 'bi-chevron-down';
      case -1: return 'bi-chevron-up';
      default: return '';
    }
  }
}
