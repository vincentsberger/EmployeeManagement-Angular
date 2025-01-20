import {Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {HomeViewComponent} from "./components/home-view/home-view.component";
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {LoginViewComponent} from "./components/login-view/login-view.component";
//import {QualificationViewComponent} from "./components/qualification-view-component";

export const routes: Routes = [
  {path: '', component: LoginViewComponent},
  {path: "home", component: HomeViewComponent, canActivate: [AuthGuard],},
  {path: "employees", component: EmployeeListComponent, canActivate: [AuthGuard],},
  //{path: "qualifications", component: QualificationViewComponent, canActivate: [AuthGuard],},
  {path: "**", redirectTo: ""}
];
