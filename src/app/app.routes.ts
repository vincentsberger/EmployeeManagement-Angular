import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent,
    canActivate: [AuthGuard],
  },

  { path: "", component: HomeViewComponent },
  { path: "employees", component: EmployeeListComponent },
  { path: "qualifications", component: EmployeeListComponent}
];
