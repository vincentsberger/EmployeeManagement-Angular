import { inject, Injectable } from '@angular/core';
import { Employee } from '../model/Employee';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { QualificationEmployeesDTO } from '../model/DTO/qualification-employees-dto';
import { Qualification } from '../model/Qualification';
import { map, Observable } from 'rxjs';
import { PostEmployeeDTO } from '../model/DTO/post-employee-dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;

  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieves a list of all employees.
   *
   * @returns An observable of a list of employees.
   */
  public getEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`http://localhost:8089/employees`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`),
    });
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
    let qualificationEmployees = this.httpClient.get<QualificationEmployeesDTO>(
      `http://localhost:8089/qualifications/${qualificationId}/employees`,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      }
    );
    return qualificationEmployees.pipe(
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
}
