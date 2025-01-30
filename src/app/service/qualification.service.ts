import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Qualification } from '../model/Qualification';
import Keycloak from 'keycloak-js';
import { Observable } from 'rxjs';
import { Employee } from '../model/Employee';
import { EmployeeService } from './employee.service';

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;

  constructor(
    private httpClient: HttpClient,
    private employeeService: EmployeeService
  ) {}

  /**
   * Retrieves a list of all qualifications.
   *
   * @returns An observable of a list of qualifications.
   */
  public getQualifications(): Observable<Qualification[]> {
    return this.httpClient.get<Qualification[]>(
      'http://localhost:8089/qualifications',
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
  }

  /**
   * Retrieves a single qualification by its ID.
   *
   * @param qualificationId - The ID of the qualification to retrieve.
   * @returns An observable of the qualification.
   */
  public getQualificationById(qualificationId: number) {
    return this.httpClient.get<Qualification>(
      `http://localhost:8089/qualifications/${qualificationId}`,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
  }

  /**
   * Creates a new qualification and adds it to the database.
   *
   * @param qualification - The qualification to add.
   * @returns An observable of the newly created qualification.
   */
  public addQualification(qualification: Qualification) {
    return this.httpClient.post<Qualification>(
      `http://localhost:8089/qualifications`,
      qualification,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
  }

  public updateQualification(qualification: Qualification) {}

  /**
   * Deletes a qualification from the database and removes it from all associated employees.
   *
   * This method first retrieves all employees associated with the given qualification.
   * If there are any employees with this qualification, it removes the qualification from each employee.
   * After a brief delay, it deletes the qualification from the database.
   *
   * @param qualification - The qualification to be deleted.
   */
  public deleteQualification(qualification: Qualification) {
    let qualificationEmployees$ =
      this.employeeService.getEmployeesByQualificationId(qualification.id);
    qualificationEmployees$.subscribe({
      next: (employeeCollection: Employee[]) => {
        if (employeeCollection.length == 0) {
          return;
        }
        employeeCollection.forEach((employee) => {
          this.deleteQualficationfromEmployee(qualification, employee);
        });
      },
    });
    return this.httpClient.delete<Qualification>(
      `http://localhost:8089/qualifications/${qualification.id}`,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
  }

  /**
   * Deletes a qualification from a specific employee.
   *
   * @param qualification - The qualification to delete from the employee.
   * @param employee - The employee from which to delete the qualification.
   * @returns An observable of the deleted qualification.
   */
  private deleteQualficationfromEmployee(
    qualification: Qualification,
    employee: Employee
  ) {
    return this.httpClient.delete<Qualification>(
      `http://localhost:8089/employees/${employee.id}/qualifications/${qualification.id}`,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
  }
}
