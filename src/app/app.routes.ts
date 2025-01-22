import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { HomeViewComponent } from './components/home-view/home-view.component';
import {QualificationViewComponent} from "./components/qualification-view/qualification-view.component";
import {NewQualificationViewComponent} from "./components/new-qualification-view/new-qualification-view.component";
import { canActivateAuthRole } from './guards/auth-role.guard';
import { HomeServicesViewComponent } from './components/home-services-view/home-services-view.component';
import {EmployeeDetailViewComponent} from "./components/employee-detail-view/employee-detail-view.component";
import {CreateEmployeeViewComponent} from "./components/create-employee-view/create-employee-view.component";

export const routes: Routes = [
  { path: "", component: HomeServicesViewComponent},
  { path: "home", component: HomeViewComponent, canActivate: [canActivateAuthRole] },
  { path: "employees", component: EmployeeListComponent,canActivate: [canActivateAuthRole] },
  { path: "employees/:id", component: EmployeeDetailViewComponent,canActivate: [canActivateAuthRole] },
  { path: "qualifications", component: QualificationViewComponent, canActivate: [canActivateAuthRole] },
  { path: "new-qualification", component: NewQualificationViewComponent, canActivate: [canActivateAuthRole] },
  { path: "create-employee", component: CreateEmployeeViewComponent, canActivate: [canActivateAuthRole] },
];
