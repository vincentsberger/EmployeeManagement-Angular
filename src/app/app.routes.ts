import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HomeViewComponent } from './components/home-view/home-view.component';

export const routes: Routes = [
  { path: "", component: HomeViewComponent },
  { path: "employees", component: EmployeeListComponent },
  { path: "qualifications", component: EmployeeListComponent}
];
