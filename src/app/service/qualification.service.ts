import { inject, Injectable } from '@angular/core';
import { Qualification } from '../model/Qualification';
import {
  BehaviorSubject,
  finalize,
  forkJoin,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { Employee } from '../model/Employee';
import { EmployeeService } from './employee.service';
import { ApiService } from './api.service';
import { ApiRoutes } from '../enums/api-routes';
import { LoggingService } from './logging.service';
import { PostQualificationDTO } from '../model/DTO/post-qualification-dto';
import { QualificationEmployeesDTO } from '../model/DTO/qualification-employees-dto';
import { EmployeeQualitificationsDTO } from '../model/DTO/employee-qualifications-dto';

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
 * Retrieves the list of qualifications associated with a specific employee.
 *
 * This method sends a GET request to the backend to fetch qualifications
 * linked to the given employee ID. The response is expected to be an
 * `EmployeeQualitificationsDTO` object, and the `skillSet` is mapped
 * to an array of `Qualification` objects.
 *
 * @param employeeId - The ID of the employee for whom to retrieve qualifications.
 * @returns An observable of an array of `Qualification` objects associated with the employee.
 */
  public getQualificationsByEmployeeId(employeeId: number|string): Observable<Qualification[]> {
    return this.apiService.sendGetRequest<EmployeeQualitificationsDTO>(`${ApiRoutes.EMPLOYEES}/${employeeId}/${ApiRoutes.QUALIFICATIONS}`)
          .pipe(
            map((data: EmployeeQualitificationsDTO): Qualification[] => data.skillSet)
          );
  }


  /**
   * Adds a new qualification to the backend.
   *
   * This method sends a POST request to the backend with the new qualification
   * information. The response is expected to be a `Qualification` object, which
   * is then logged to the console.
   *
   * @param newQualification - The `PostQualificationDTO` object containing the
   * information for the new qualification.
   * @returns An observable of the added `Qualification`.
   */
  public addQualification(
    newQualification: PostQualificationDTO
  ): Observable<Qualification> {
    return this.apiService
      .sendPostRequest<Qualification>(
        ApiRoutes.QUALIFICATIONS,
        newQualification
      )
      .pipe(
        tap((qualification: Qualification): void => {
          this.logger$.debug('Qualifikation hinzugefügt!', qualification);
        })
      );
  }

/**
 * Checks if a qualification with the same skill already exists in the current collection.
 *
 * The function takes a `Qualification` object and maps over the current collection of qualifications
 * to determine if any qualification contains the same skill as the provided one.
 *
 * @param qualification - The `Qualification` object to check against the existing collection.
 * @returns An observable boolean indicating whether a qualification with the same skill exists.
 */

  public isExistingQualification(postQualificationDTO: PostQualificationDTO) {
    return this.qualifications$.pipe(
      map((qualificationCollection: Qualification[]): boolean =>
        qualificationCollection.some(
          (qualificationEntry: Qualification): boolean => qualificationEntry.skill === postQualificationDTO.skill
        )
      )
    )
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
  ): Observable<Qualification> {
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
                    `Qualifikation erfolgreich gelöscht!`,
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
