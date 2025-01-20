import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {KeycloakService} from 'keycloak-angular';
import {Employee} from '../Employee';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent {
    employees$: Observable<Employee[]>;

    constructor(private http: HttpClient, private keycloakService: KeycloakService) {
        this.employees$ = this.fetchData();
    }

    fetchData(): Observable<Employee[]> {
        return this.http.get<Employee[]>('http://localhost:8089/employees');
    }
}
