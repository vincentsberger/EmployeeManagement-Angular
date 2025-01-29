import { Qualification } from './../../model/Qualification';
import { Component, inject, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MainViewComponent } from '../main-view/main-view.component';
import Keycloak from 'keycloak-js';
import { Employee } from '../../model/Employee';
import { QualificationEmployeesDTO } from '../../model/DTO/qualification-employees-dto';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomToastComponentComponent } from '../messages/custom-toast-component/custom-toast-component.component';

@Component({
  selector: 'app-qualification-view',
  standalone: true,
  imports: [
    MatListModule,
    NgForOf,
    NgIf,
    AsyncPipe,
    RouterLink,
    MainViewComponent,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './qualification-view.component.html',
  styleUrl: './qualification-view.component.scss',
})
export class QualificationViewComponent {
  isLoading = true;
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  readonly dialog = inject(MatDialog);
  qualifications$: Observable<Qualification[]>;
  private snackbar = inject(MatSnackBar);

  constructor(private http: HttpClient) {
    this.qualifications$ = this.fetchData();
    this.updateView();
  }

  fetchData() {
    return this.http.get<Qualification[]>(
      'http://localhost:8089/qualifications',
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
  }

  updateView() {
    this.fetchData();
    console.log();
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  // TODO: refactor request chain with concatMap or similar function https://www.learnrxjs.io/learn-rxjs/operators/transformation/concatmap

  deleteQualification(qualification: Qualification) {
    // 1. alle Mitarbeiter mit dieser Qualifikation holen
    this.getEmployeesByQualification(qualification).subscribe({
      next: (data: QualificationEmployeesDTO) => {
        let employeeCollection = data.employees;
        employeeCollection.forEach((employee) => {
          this.deleteQualificationFromEmployee(employee, qualification);
        });
        setTimeout(() => {
          this.deleteQualificationEntity(qualification);
        }, 200);
      },
      error: (error: any) => {},
    });

    // 2. Durch die Mitarbeiter iterieren und die Zuordnung der Qualifikation zum Mitarbeiter entfernen
    // this.employeesToProcess.forEach((employee) => {
    // this.deleteQualificationFromEmployee(employee.id, qid)
    // });
    // 3. Qualifikation löschen
    // this.employeesToProcess = [];
  }

  /**
   * Retrieves a list of employees associated with a specific qualification.
   *
   * @param qualification - The qualification for which to retrieve associated employees.
   * @returns An observable of QualificationEmployeesDTO containing the qualification and the list of associated employees.
   */
  getEmployeesByQualification(qualification: Qualification) {
    let response$ = this.http.get<QualificationEmployeesDTO>(
      `http://localhost:8089/qualifications/${qualification.id}/employees`,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
    return response$;
  }

  deleteQualificationFromEmployee(
    employee: Employee,
    qualification: Qualification
  ) {
    let response = this.http
      .delete(
        `http://localhost:8089/employees/${employee.id}/qualifications/${qualification.id}`,
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${this.bearer}`),
        }
      )
      .subscribe({
        next: (response) => {
          console.log(
            `Deleted qualification "${qualification.skill}" [ID: ${qualification.id}] from employee "${employee.lastName}, ${employee.firstName}" [ID: ${employee.id}] `
          );
        },
        error: (response) => {
          console.error(
            `Could not delete qualification "${qualification.skill}" [ID: ${qualification.id}] from employee "${employee.lastName}, ${employee.firstName}" [ID: ${employee.id}]`
          );
        },
      });
    return response;
  }

  deleteQualificationEntity(qualification: Qualification) {
    this.http
      .delete(`http://localhost:8089/qualifications/${qualification.id}`, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      })
      .subscribe({
        next: (data) => {
          console.log(
            `Deleted qualification "${qualification.skill}" [ID: ${qualification.id}]`
          );
        },
        error: (err) => {
          console.error(
            `Could not delete qualification id "${qualification.skill}" [ID: ${qualification.id}]. Maybe it is assigned to an employee?`
          );
        },
      });
  }

  openDeleteQualificationModal(qualification: Qualification) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        qualification,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result == true) {
        this.deleteQualification(qualification);
        this.isLoading = true;
        this.fetchData();
        this.updateView();
        this.openSnackbar(
          `Qualifikation "${qualification.skill}" [ID: ${qualification.id}] erfolgreich gelöscht.`
        );
      }
    });
  }

  openSnackbar(message: string, type: string = 'default') {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      verticalPosition: 'bottom',
      data: {
        message: message,
        type,
      },
    });
  }
}
