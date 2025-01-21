import Keycloak from 'keycloak-js';
import {Component, inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Employee} from '../../Employee';
import {MainViewComponent} from '../main-view/main-view.component';
import {Qualification} from "../../model/Qualification";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {map} from "rxjs/operators";

@Component({
    standalone: true,
    selector: 'app-employee-detail',
    imports: [MainViewComponent, NgIf, AsyncPipe, NgForOf, RouterLink],
    templateUrl: './employee-detail-view.component.html',
    styleUrls: ['./employee-detail-view.component.scss'],
})
export class EmployeeDetailViewComponent implements OnInit {
    keycloak = inject(Keycloak);
    bearer = this.keycloak.token;
    employee$: Observable<Employee | null> = of(null);
    qualifications$: Observable<Qualification[]> = of([]);

    constructor(private http: HttpClient, private route: ActivatedRoute) {
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchEmployeeDetails(id);
            this.fetchEmployeeQualifications(id);
        }
    }

    fetchEmployeeDetails(id: string): void {
        this.employee$ = this.http.get<Employee>(`http://localhost:8089/employees/${id}`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer}`),
        });
    }

    fetchEmployeeQualifications(id: string): void {
        this.qualifications$ = this.http.get<{ skillSet: Qualification[] }>(
            `http://localhost:8089/employees/${id}/qualifications`,
            {
                headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer}`),
            }
        ).pipe(
            map(response => response.skillSet)
        );
    }

}
