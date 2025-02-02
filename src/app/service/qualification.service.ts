import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Qualification } from '../model/Qualification';
import Keycloak from 'keycloak-js';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  count,
  finalize,
  forkJoin,
  from,
  Observable,
  retry,
  switchMap,
  tap,
} from 'rxjs';
import { Employee } from '../model/Employee';
import { EmployeeService } from './employee.service';
import { ApiService } from './api.service';
import { ApiRoutes } from '../enums/api-routes';
import { ErrorHandlerService } from './error-handler.service';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  private qualificationsSubject = new BehaviorSubject<Qualification[]>([]);
  public qualifications$ = this.qualificationsSubject.asObservable();
  protected logger$ = inject(LoggingService);

  constructor(
    private employeeService: EmployeeService,
    private apiService: ApiService
  ) {
    this.fetchQualifications();
  }

  /**
   * Fetches the list of all qualifications from the backend.
   *
   * This method sends a GET request to the backend, and updates the
   * `qualifications$` observable with the response. The response is expected
   * to be an array of `Qualification` objects.
   */
  public fetchQualifications(): void {
    this.apiService
      .sendGetRequest<Qualification[]>(ApiRoutes.QUALIFICATIONS)
      .subscribe((data: Qualification[]): void => {
        this.qualificationsSubject.next(data);
      });
  }

  public getQualifications(): Observable<Qualification[]> {
    return this.qualifications$;
  }

  /**
   * Retrieves a single qualification by its ID.
   *
   * @param qualificationId - The ID of the qualification to retrieve.
   * @returns An observable of the retrieved qualification.
   */
  public getQualificationById(
    qualificationId: number
  ): Observable<Qualification> {
    return this.apiService.sendGetRequest<Qualification>(
      `${ApiRoutes.QUALIFICATIONS}/${qualificationId}`
    );
  }

  /**
   * Adds a new qualification to the backend.
   *
   * This method sends a POST request to the backend with the provided
   * `postBody`, and updates the `qualifications$` observable with the
   * response. The response is expected to be a single `Qualification`
   * object.
   *
   * @param newQualification - The `Qualification` object that should be added.
   * @param postBody - The body of the POST request.
   */
  public addQualification(newQualification: Qualification): void {
    this.apiService
      .sendPostRequest<Qualification>(
        ApiRoutes.QUALIFICATIONS,
        newQualification
      )
      .subscribe((qualification: Qualification): void => {
        this.logger$.debug(
          'Qualifikation erfolgreich hinzugefügt!',
          qualification
        );
        this.fetchQualifications();
      });
  }

  public updateQualification(qualification: Qualification) {}


  /**
   * Deletes a qualification from the backend.
   *
   * This method first checks if the qualification is associated with any
   * employees. If it is not, the qualification is deleted directly. If it is,
   * the method first removes the qualification from all associated employees,
   * and then deletes the qualification.
   *
   * @param qualification - The `Qualification` object that should be deleted.
   * @returns An observable of the deleted `Qualification`.
   */
  public deleteQualification(
    qualification: Qualification
  ): Observable<Qualification> | any {
    // Schritt 1: Überprüfen, ob die Qualifikation Mitarbeitern zugeordnet ist
    return this.employeeService
      .getEmployeesByQualificationId(qualification.id)
      .pipe(
        switchMap((employees: Employee[]): Observable<Qualification> => {
          if (employees.length === 0) {
            // Keine zugeordneten Mitarbeiter → Direkt löschen
            return this.apiService
              .sendDeleteRequest<Qualification>(
                `${ApiRoutes.QUALIFICATIONS}/${qualification.id}`
              )
              .pipe(
                tap((): void =>
                  this.logger$.debug(
                    `Qualifikation ${qualification.skill}[${qualification.id}] erfolgreich gelöscht!`,
                    qualification
                  )
                )
              );
          } else {
            // Mitarbeiter-Qualifikationen zuerst entfernen
            const deleteRequests = employees.map(
              (employee): Observable<Employee> =>
                this.employeeService.removeQualificationFromEmployee(
                  qualification,
                  employee
                )
            );
            // Schritt 2: Nachdem alle Mitarbeiter aktualisiert wurden → Qualifikation löschen
            return forkJoin(deleteRequests).pipe(
              switchMap(
                (): Observable<Qualification> =>
                  this.apiService
                    .sendDeleteRequest<Qualification>(
                      `${ApiRoutes.QUALIFICATIONS}/${qualification.id}`
                    )
                    .pipe(
                      tap((): void =>
                        this.logger$.debug(
                          `Qualifikation erfolgreich gelöscht!`,
                          qualification
                        )
                      )
                    )
              )
            );
          }
        }),
        finalize(() => this.fetchQualifications())
      );
  }
}
