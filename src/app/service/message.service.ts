import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private toastOptions: IndividualConfig = {
    timeOut: 3000,
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-bottom-center',
    easing: 'ease-in-out',
    disableTimeOut: false,
    extendedTimeOut: 1000,
    progressAnimation: 'decreasing',
    enableHtml: false,
    toastClass: 'ngx-toastr',
    titleClass: 'toast-title',
    messageClass: 'toast-message',
    easeTime: 500,
    tapToDismiss: true,
    onActivateTick: false,
    newestOnTop: true,
  };

  constructor(private toastrService: ToastrService) {}

  /**
   * Show a success message toast.
   *
   * @param message The message to be shown to the user.
   * @param title The title of the message.
   */
  showSuccess(message: string, title: string) {
    this.toastrService.success(message, title, this.toastOptions);
  }

  /**
   * Show an error message toast.
   *
   * @param message The message to be shown to the user.
   * @param title The title of the message.
   */
  showError(message: string, title: string) {
    this.toastrService.error(message, title, this.toastOptions);
  }

  /**
   * Show an informational message toast.
   *
   * @param message The message to be displayed to the user.
   * @param title The title of the informational message.
   */

  showInfo(message: string, title: string) {
    this.toastrService.info(message, title, this.toastOptions);
  }

  /**
   * Show a warning message toast.
   *
   * @param message The message to be displayed to the user.
   * @param title The title of the warning message.
   */
  showWarning(message: string, title: string) {
    this.toastrService.warning(message, title, this.toastOptions);
  }
}
