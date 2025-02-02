import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {

  /**
   * Logs an info message in the browser console.
   * You could also establish a connection to an external monitoring tool
   * here to log the info messages.
   * @param message The info message to be logged.
   */
  public log(message: string, data?: any): void {
    console.log('LoggingService[Info]:\n', message, data);
  }

  /**
   * Logs a debug message in the browser console.
   * You could also establish a connection to an external monitoring tool
   * here to log the debug messages.
   * @param message The debug message to be logged.
   */
  public debug(message: string, data?: any): void {
    console.debug('LoggingService[Debug]:\n', message, data);
  }


  /**
   * Logs an error message in the browser console.
   * You could also establish a connection to an external monitoring tool
   * here to log the error messages.
   * @param errorMessage The error message to be logged.
   * @param data Optional data to be logged.
   */
  error(errorMessage: string, data?: any): void {
    // Hier könnte man z. B. Fehler an ein externes Monitoring-Tool senden
    console.error('LoggingService[Error]:\n', errorMessage, data);
  }


  /**
   * Logs a warning message in the browser console.
   * You could also establish a connection to an external monitoring tool
   * here to log the warning messages.
   * @param errorMessage The warning message to be logged.
   * @param data Optional data to be logged.
   */
  warning(errorMessage: string, data?: any): void {
    // Hier könnte man z. B. Fehler an ein externes Monitoring-Tool senden
    console.warn('LoggingService[Warning]:\n', errorMessage, data);
  }
}
