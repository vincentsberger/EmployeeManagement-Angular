import Keycloak from 'keycloak-js';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MainViewComponent } from '../main-view/main-view.component';
import { Qualification } from '../../model/Qualification';
import { Employee } from '../../model/Employee';
import { AsyncPipe, NgIf, NgForOf } from '@angular/common';
import { switchMap, map } from 'rxjs/operators';
import { EmployeeService } from '../../service/employee.service';
import { QualificationService } from '../../service/qualification.service';

@Component({
  standalone: true,
  selector: 'app-employee-detail',
  imports: [MainViewComponent, NgIf, AsyncPipe, NgForOf, RouterLink],
  templateUrl: './employee-detail-view.component.html',
  styleUrls: ['./employee-detail-view.component.scss'],
})
export class EmployeeDetailViewComponent {
  private keycloak = inject(Keycloak);
  private bearer = this.keycloak.token;

  employee$: Observable<Employee>;
  qualifications$: Observable<Qualification[]>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private qualificationService: QualificationService
  ) {
    this.employee$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.employeeService.getEmployeeById(Number(params.get('id')))
      )
    );
    this.qualifications$ = this.route.paramMap.pipe(
      switchMap(
        (params): Observable<Qualification[]> =>
          this.qualificationService.getQualificationsByEmployeeId(
            Number(params.get('id'))
          )
      )
    );
  }
}
