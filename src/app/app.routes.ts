import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component:  },
  {
    path: '',
    component: ,
    canActivate: [AuthGuard],
  },
];
