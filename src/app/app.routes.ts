import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';

export const routes: Routes = [
  { path: "", component: EmployeeListComponent },
  { path: "employees", component: EmployeeListComponent },
  { path: "qualifications", component: EmployeeListComponent}
];
