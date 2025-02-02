import Keycloak from 'keycloak-js';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from '../../model/Employee';
import { MainViewComponent } from '../main-view/main-view.component';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { EmployeeService } from '../../service/employee.service';
import { DrawerService } from '../../service/drawer.service';
import { CreateEmployeeViewComponent } from '../create-employee-view/create-employee-view.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { QualificationService } from '../../service/qualification.service';
import { MessageService } from '../../service/message.service';

@Component({
  standalone: true,
  selector: 'app-employee-list',
  imports: [CommonModule, MainViewComponent, FormsModule, RouterLink, MatIcon],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  employees$: Observable<Employee[]>;
  filteredEmployees$: Observable<Employee[]>;
  searchQuery: string = '';

  readonly dialog = inject(MatDialog);

  sortStatus = {
    firstName: 0,
    lastName: 0,
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private employeeService: EmployeeService,
    private drawerService: DrawerService,
    private qualificationService: QualificationService,
    private messageService: MessageService
  ) {
    this.employees$ = this.employeeService.getEmployees();
    this.filteredEmployees$ = this.employees$;
  }

  /**
   * Opens a drawer component to add a new employee.
   * Utilizes the DrawerService to open the CreateEmployeeViewComponent.
   * The drawer is titled 'Mitarbeiter hinzufügen'.
   */
  openAddEmployeeDrawer() {
    this.drawerService.open(CreateEmployeeViewComponent, {
      title: 'Mitarbeiter hinzufügen',
    });
  }

  searchEmployees() {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredEmployees$ = this.employees$.pipe(
      map((employees) =>
        employees.filter((employee) => {
          const fullName = `${employee.firstName ?? ''} ${
            employee.lastName ?? ''
          }`.toLowerCase();
          return fullName.includes(query);
        })
      )
    );
  }

  onSearchChange() {
    this.searchEmployees();
  }

  openDeleteQualificationModal(employee: Employee) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        employee: employee,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.employeeService.deleteEmployee(employee).subscribe({
          next: () => {
            this.messageService.showSuccess(
              `Mitarbeiter "${employee.firstName} ${employee.lastName}" wurde erfolgreich gelöscht!`,
              'Löschen erfolgreich!'
            );
            this.employeeService.fetchEmployees();
          },
        });
      }
    });
  }

  toggleSortByFirstName(firstName: string) {
    this.sortStatus.firstName = this.getNextSortOrder(
      this.sortStatus.firstName
    );
    this.sortEmployees();
  }

  toggleSortByLastName(lastName: string) {
    this.sortStatus.lastName = this.getNextSortOrder(this.sortStatus.lastName);
    this.sortEmployees();
  }

  private getNextSortOrder(currentSortOrder: number): number {
    switch (currentSortOrder) {
      case 0:
        return 1;
      case 1:
        return -1;
      default:
        return 0;
    }
  }

  private sortEmployees() {
    this.filteredEmployees$ = this.employees$.pipe(
      map((employees) => {
        return [...employees].sort((a, b) => {
          let compareResult = 0;

          if (this.sortStatus.firstName !== 0) {
            compareResult =
              (a.firstName ?? '').localeCompare(b.firstName ?? '') *
              this.sortStatus.firstName;
          }

          if (compareResult === 0 && this.sortStatus.lastName !== 0) {
            compareResult =
              (a.lastName ?? '').localeCompare(b.lastName ?? '') *
              this.sortStatus.lastName;
          }

          return compareResult;
        });
      })
    );
  }

  getSortIcon(field: 'firstName' | 'lastName'): string {
    switch (this.sortStatus[field]) {
      case 1:
        return 'bi-chevron-down';
      case -1:
        return 'bi-chevron-up';
      default:
        return '';
    }
  }
}
