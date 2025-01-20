import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HomeViewComponent } from './components/home-view/home-view.component';
import {QualificationViewComponent} from "./components/qualification-view/qualification-view.component";
import {NewQualificationViewComponent} from "./components/new-qualification-view/new-qualification-view.component";
import { canActivateAuthRole } from './guards/auth-role.guard';
import { HomeServicesViewComponent } from './components/home-services-view/home-services-view.component';


export const routes: Routes = [
  { path: "", component: HomeServicesViewComponent},
  { path: "home", component: HomeViewComponent, canActivate: [canActivateAuthRole] },
  { path: "employees", component: EmployeeListComponent },
  { path: "qualifications", component: QualificationViewComponent},
  { path: "new-qualification", component: NewQualificationViewComponent},

];
