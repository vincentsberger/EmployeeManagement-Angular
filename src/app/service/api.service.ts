import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { ApiRoutes } from '../enums/api-routes';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { catchError, map, retry, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;

  constructor(
    private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  /**
   * Creates a new HttpHeaders instance with the following headers:
   *   - Content-Type: application/json
   *   - Authorization: Bearer <token>
   * The token is retrieved from the Keycloak instance.
   *
   * @returns A HttpHeaders instance with the specified headers.
   */
  public getRequestHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.bearer}`,
    });
  }

  /**
   * Sends a GET request to the specified API endpoint.
   *
   * @template T - The expected response type.
   * @param apiPath - The relative path of the API endpoint.
   * @returns An observable of the HTTP response with the specified type.
   */
  public sendGetRequest<T>(apiPath: string): Observable<T> {
    return this.httpClient
      .get<T>(ApiRoutes.BASE_URL + apiPath, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      })
      .pipe(
        retry({
          count: 3,
          delay: 100,
        }),
        catchError<T, Observable<T>>(
          this.errorHandlerService.handleError<T>("getRequest")
        )
      );
  }

  /**
   * Sends a POST request to the specified API endpoint.
   *
   * @template T - The expected response type.
   * @param apiPath - The relative path of the API endpoint.
   * @param postBody - The JSON payload to send in the request body.
   * @returns An observable of the HTTP response with the specified type.
   */
  public sendPostRequest<T>(
    apiPath: string,
    postBody: any
  ): Observable<T> {
    return this.httpClient
      .post<T>(ApiRoutes.BASE_URL + apiPath, postBody, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      })
      .pipe(
        retry({
          count: 3,
          delay: 100,
        }),
        catchError<T, Observable<T>>(
          this.errorHandlerService.handleError<T>("postRequest")
        )
      );
  }

  /**
   * Send a PUT request to the API.
   *
   * @param apiPath the relative path of the API endpoint
   * @example `/employees/1`, `/qualifications/1/employees`
   * @returns the response of the API
   */
  public sendPutRequest<T>(apiPath: string): Observable<T | never[]> {
    return this.httpClient.put<T>(ApiRoutes.BASE_URL + apiPath, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`),
    });
  }

  /**
   * Sends a DELETE request to the API.
   *
   * @param apiPath - The relative path of the API endpoint.
   * @example `/employees/1`, `/qualifications/1/employees`
   * @returns The response of the API as an observable of type `T`.
   */

  public sendDeleteRequest<T>(apiPath: string): Observable<T> {
    return this.httpClient
      .delete<T>(ApiRoutes.BASE_URL + apiPath, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this.bearer}`),
      })
      .pipe(
        retry({
          count: 3,
          delay: 100,
        }),
        catchError<T, Observable<T>>(
          this.errorHandlerService.handleError<T>("deleteRequest")
        )
      );
  }
}
