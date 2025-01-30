import { Injectable } from '@angular/core';
import { Toast } from '../model/toast';
import { ToastType } from '../enums/toast-type';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[];

  constructor() {
    this.toasts = [];
  }

  addMessage(message: string, type: ToastType = ToastType.INFO, duration: number = 3000) {
    this.toasts.push({ message, type, duration });
    setTimeout(() => {
      this.removeMessage(0);
    }, duration);
  }

  removeMessage(index: number) {
    this.toasts.splice(index, 1);
  }
}
