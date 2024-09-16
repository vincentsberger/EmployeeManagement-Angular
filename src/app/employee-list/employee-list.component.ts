import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable, of} from "rxjs";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {Employee} from "../Employee";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE3MjYwNDg1OTgsImlhdCI6MTcyNjA0NDk5OCwianRpIjoiOTllY2U1ZTEtMTMzZi00OWVkLWEyMDgtMTJmNTVmNjYyNDkzIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiJlODYyMmQzNy1iZmJlLTQ3NzMtYWMzYi1hMDI5NDI4OGMxNWUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicHJvZHVjdF9vd25lciIsIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.DsLCU070WdBL2JawLeT6LVTm9WTbwrqPGJjCjd68mCPvKQC8FxgmbNjChsil_s-l0azf07VkBENYRlWWoM3tB1xWsJ2kIyDzA-dgL0JHa496Slw9EZVCrZtf90gzQgvoGqMANSkC6wx2a2jFecRJygVr0ozLpNNFHzvh8Q6dcnBw3GH1_giAzMdSNMa3wRnxoeF1q95T_QdBJVMg38hZIa6y9OOZDHchmXJIP0xGOur1mmDnqVy1W8gQ7kzVB5gXc_CsJsioQUR_QOMLQ879k-N9pKdV3_a97HnM25xSoj0Vw5n8mfReQoGTpjJZ9QFk5MVj4h4wt_mcBknL1mQ1JQ';
  employees$: Observable<Employee[]>;

  constructor(private http: HttpClient) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('/backend/employees', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
  }
}
