import { inject, Injectable } from '@angular/core';
import { Employee } from '../model/Employee';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { QualificationEmployeesDTO } from '../model/DTO/qualification-employees-dto';
import { Qualification } from '../model/Qualification';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { PostEmployeeDTO } from '../model/DTO/post-employee-dto';
import { ApiService } from './api.service';
import { ApiRoutes } from '../enums/api-routes';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  private _employeesSubject = new BehaviorSubject<Employee[]>([]);
  readonly employees$ = this._employeesSubject.asObservable();
  protected logger$ = inject(LoggingService);

  constructor(
    private httpClient: HttpClient,
    private apiService: ApiService,
    private loggingService: LoggingService
  ) {}

  /**
   * Retrieves a list of all employees.
   *
   * @returns An observable of a list of employees.
   */
  public fetchEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`http://localhost:8089/employees`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`),
    });
  }

  /**
   * Returns an observable of a list of all employees.
   * This method simply returns the internal state of the service, which is
   * populated by the fetchEmployees method when the service is constructed.
   *
   * @returns An observable of a list of employees.
   */
  public getEmployees(): Observable<Employee[]> {
    return this.employees$;
  }

  /**
   * Retrieves a single employee by their ID.
   *
   * @param employeeId - The ID of the employee to retrieve.
   * @returns An observable of the employee.
   */
  public getEmployeeById(employeeId: number): Observable<Employee> {
    return this.httpClient.get<Employee>(
      `http://localhost:8089/employees/${employeeId}`,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
  }

  /**
   * Retrieves a list of all employees associated with a specific qualification.
   *
   * @param qualificationId - The ID of the qualification for which to retrieve associated employees.
   * @returns An observable of a list of employees associated with the qualification.
   */
  public getEmployeesByQualificationId(
    qualificationId: number
  ): Observable<Employee[]> {
    return this.apiService
      .sendGetRequest<QualificationEmployeesDTO>(
        `${ApiRoutes.QUALIFICATIONS}/${qualificationId}/employees`
      )
      .pipe(
        map((data: QualificationEmployeesDTO): Employee[] => data.employees)
      );
  }

  /**
   * Creates a new employee in the database.
   *
   * @param employeeDTO - The data transfer object of the employee to add.
   * @returns An observable of the newly created employee.
   */
  public addEmployee(employeeDTO: PostEmployeeDTO) {
    return this.httpClient.post<PostEmployeeDTO>(
      `http://localhost:8089/employees`,
      employeeDTO,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
  }

  // PUT
  public updateEmployee(employee: Employee) {}

  /**
   * Deletes a single employee from the database.
   *
   * @param employee - The employee to delete.
   * @returns An observable of the deleted employee.
   */
  public deleteEmployee(employee: Employee) {
    return this.httpClient.delete<Qualification>(
      `http://localhost:8089/employees/${employee.id}`,
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
  public removeQualificationFromEmployee(
    qualification: Qualification,
    employee: Employee
  ): Observable<Employee> {
    return this.apiService
      .sendDeleteRequest<Employee>(
        `${ApiRoutes.EMPLOYEES}/${employee.id}/qualifications/${qualification.id}`
      )
      .pipe(
        tap(() =>
          this.logger$.debug(`Qualifikation aus Mitarbeiter entfernt.`, {qualification, employee})
        )
      );
  }
}
