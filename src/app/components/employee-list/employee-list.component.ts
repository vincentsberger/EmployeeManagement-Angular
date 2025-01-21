import Keycloak from 'keycloak-js';
import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Employee} from '../../Employee';
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
    this.filteredEmployees$ = this.employees$.pipe(
      map(employees =>
        employees.filter(employee =>
          `${employee.firstName} ${employee.lastName}`
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        )
      )
    );
  }

  onSearchChange() {
    this.searchEmployees();
  }

  deleteEmployee(employeeId: number) {
    const confirmDelete = window.confirm('Möchten Sie diesen Mitarbeiter wirklich löschen?');

    if (confirmDelete) {
      this.http.delete(`http://localhost:8089/employees/${employeeId}`, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }).subscribe(
        () => {
          this.fetchData();
        },
        (error) => {
          console.error('Fehler beim Löschen des Mitarbeiters', error);
        }
      );
    }
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
    if (currentSortOrder === 0) {
      return 1;
    } else if (currentSortOrder === 1) {
      return -1;
    } else {
      return 0;
    }
  }

  private sortEmployees() {
    this.filteredEmployees$ = this.employees$.pipe(
      map((employees) => {
        let sortedEmployees = [...employees];

        if (this.sortStatus.firstName !== 0) {
          sortedEmployees.sort((a, b) => {
            const compareResult = (a.firstName ?? '').localeCompare(b.firstName ?? '');
            return this.sortStatus.firstName === 1 ? compareResult : -compareResult;
          });
        }

        if (this.sortStatus.lastName !== 0) {
          sortedEmployees.sort((a, b) => {
            const compareResult = (a.lastName ?? '').localeCompare(b.lastName ?? '');
            return this.sortStatus.lastName === 1 ? compareResult : -compareResult;
          });
        }

        return sortedEmployees;
      })
    );
  }

  getSortIcon(field: 'firstName' | 'lastName'): string {
    if (this.sortStatus[field] === 1) {
      return 'bi-chevron-down';
    } else if (this.sortStatus[field] === -1) {
      return 'bi-chevron-up';
    }
    return '';
  }
}
