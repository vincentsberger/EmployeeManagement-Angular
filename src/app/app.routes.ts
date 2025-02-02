import { Routes } from '@angular/router';
import { EmployeeListComponent } from './component/employee-list/employee-list.component';
import { HomeViewComponent } from './component/home-view/home-view.component';
import {QualificationViewComponent} from "./component/qualification-view/qualification-view.component";
import {NewQualificationViewComponent} from "./component/new-qualification-view/new-qualification-view.component";
import { canActivateAuthRole } from './guards/auth-role.guard';
import { HomeServicesViewComponent } from './component/home-services-view/home-services-view.component';
import {EmployeeDetailViewComponent} from "./component/employee-detail-view/employee-detail-view.component";
import {CreateEmployeeViewComponent} from "./component/create-employee-view/create-employee-view.component";
import {EmployeeEditViewComponent} from "./component/employee-edit-view/employee-edit-view.component";

export const routes: Routes = [
  { path: "", component: HomeServicesViewComponent},
  { path: "home", component: HomeViewComponent, canActivate: [canActivateAuthRole] },
  { path: "employees", component: EmployeeListComponent,canActivate: [canActivateAuthRole] },
  { path: "employees/:id", component: EmployeeDetailViewComponent,canActivate: [canActivateAuthRole] },
  { path: "employees/:id/edit", component: EmployeeEditViewComponent,canActivate: [canActivateAuthRole] },
  { path: "qualifications", component: QualificationViewComponent, canActivate: [canActivateAuthRole] },
  { path: "new-qualification", component: NewQualificationViewComponent, canActivate: [canActivateAuthRole] },
  { path: "create-employee", component: CreateEmployeeViewComponent, canActivate: [canActivateAuthRole] },
];
