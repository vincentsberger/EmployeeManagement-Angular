import Keycloak from 'keycloak-js';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MainViewComponent } from '../main-view/main-view.component';
import { Qualification } from "../../model/Qualification";
import { Employee } from '../../Employee';
import { AsyncPipe, NgIf, NgForOf } from "@angular/common";
import { switchMap, map } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-employee-detail',
  imports: [MainViewComponent, NgIf, AsyncPipe, NgForOf, RouterLink],
  templateUrl: './employee-detail-view.component.html',
  styleUrls: ['./employee-detail-view.component.scss'],
})
export class EmployeeDetailViewComponent implements OnInit {
  private keycloak = inject(Keycloak);
  private bearer = this.keycloak.token;

  employee$: Observable<Employee | null>;
  qualifications$: Observable<Qualification[]>;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.employee$ = this.route.paramMap.pipe(
      switchMap(params => this.fetchEmployeeDetails(params.get('id')))
    );
    this.qualifications$ = this.route.paramMap.pipe(
      switchMap(params => this.fetchEmployeeQualifications(params.get('id')))
    );
  }

  ngOnInit(): void {}

  private createAuthHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.bearer}`);
  }

  private fetchEmployeeDetails(id: string | null): Observable<Employee | null> {
    if (!id) return of(null);
    return this.http.get<Employee>(`http://localhost:8089/employees/${id}`, {
      headers: this.createAuthHeaders(),
    });
  }

  private fetchEmployeeQualifications(id: string | null): Observable<Qualification[]> {
    if (!id) return of([]);
    return this.http.get<{ skillSet: Qualification[] }>(
      `http://localhost:8089/employees/${id}/qualifications`,
      { headers: this.createAuthHeaders() }
    ).pipe(map(response => response.skillSet));
  }
}
