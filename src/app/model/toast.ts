import { ToastType } from '../enums/toast-type';

export interface Toast {
  message: string;
  duration: number;
  type: ToastType;
}

const TOAST_TYPE_SUCCESS = 'success';
const TOAST_TYPE_DANGER = 'danger';
const TOAST_TYPE_INFO = 'info';
const TOAST_TYPE_WARNING = 'warning';
