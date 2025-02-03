import { inject, Injectable } from '@angular/core';
import { Employee } from '../model/Employee';
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
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  readonly employees$ = this.employeesSubject.asObservable();
  protected logger$ = inject(LoggingService);

  constructor(private apiService: ApiService) {
    this.fetchEmployees();
  }

  /**
   * Fetches the list of all employees from the backend.
   *
   * This method sends a GET request to the backend, and updates the
   * `employees$` observable with the response. The response is expected
   * to be an array of `Employee` objects.
   */
  public fetchEmployees(): void {
    this.apiService
      .sendGetRequest<Employee[]>(ApiRoutes.EMPLOYEES)
      .subscribe((data: Employee[]): void => {
        this.employeesSubject.next(data);
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
   * Retrieves an employee by their ID.
   *
   * @param employeeId - The ID of the employee to retrieve.
   * @returns An observable of the retrieved employee.
   */
  public getEmployeeById(employeeId: number): Observable<Employee> {
    return this.apiService.sendGetRequest<Employee>(
      `${ApiRoutes.EMPLOYEES}/${employeeId}`
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
   * Adds a new employee.
   *
   * @param newEmployee - The employee data to add.
   * @returns An observable of the newly added employee.
   */
  public addEmployee(newEmployee: PostEmployeeDTO): Observable<Employee> {
    return this.apiService
      .sendPostRequest<Employee>(ApiRoutes.EMPLOYEES, newEmployee)
      .pipe(
        tap((employee: Employee): void => {
          this.logger$.debug('Mitarbeiter hinzugefügt!', employee);
        })
      );
  }

  /**
   * Checks if an employee already exists in the database.
   * @param employee The employee to be checked.
   * @returns An observable of a boolean indicating whether the employee already exists.
   */
  public isExistingEmployee(employee: PostEmployeeDTO) {
    return this.employees$.pipe(
      map((employeeCollection: Employee[]): boolean =>
        employeeCollection.some(
          (employeeEntry: Employee) =>
            employeeEntry.firstName === employee.firstName &&
            employeeEntry.lastName === employee.lastName
        )
      )
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
    return this.apiService
      .sendDeleteRequest<never>(`${ApiRoutes.EMPLOYEES}/${employee.id}`)
      .pipe(
        tap((): void => {
          this.logger$.debug('Mitarbeiter gelöscht', employee);
        })
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
        `${ApiRoutes.EMPLOYEES}/${employee.id}/${ApiRoutes.QUALIFICATIONS}/${qualification.id}`
      )
      .pipe(
        tap(() =>
          this.logger$.debug(`Qualifikation aus Mitarbeiter entfernt.`, {
            qualification,
            employee,
          })
        )
      );
  }
}
