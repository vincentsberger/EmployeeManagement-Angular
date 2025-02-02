import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, OperatorFunction, throwError } from 'rxjs';
import { catchError, retryWhen, scan, delay, retry } from 'rxjs/operators';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  protected logger$ = inject(LoggingService);
  constructor() {}

  /**
   * Handles HTTP errors and returns an observable that emits an error.
   *
   * This function logs the error message to the console and transforms the
   * error response into a user-friendly error message using `getErrorMessage`.
   *
   * @template T - The type of the result expected by the operation.
   * @param operation - The name of the operation that failed.
   * @param result - Optional result to return as the observable result in case of an error.
   * @returns A function that takes an `HttpErrorResponse` and returns an observable that emits the error message.
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // log the error
      this.logger$.error(error.message);
      return throwError(() => new Error(this.getErrorMessage(error)));
    };
  }

  /**
   * Creates an error message from an {@link HttpErrorResponse}.
   *
   * @param error - The error to create the message from.
   * @returns The error message.
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Client-Fehler: ${error.error.message}`;
    } else {
      return `Server-Fehler (${error.status}): ${error.message}`;
    }
  }
}
