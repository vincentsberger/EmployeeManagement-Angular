import { Component, Input } from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Qualification} from "../../model/Qualification";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-qualification-view',
  standalone: true,
  imports: [
    MatListModule,
    NgForOf,
    NgIf,
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './qualification-view.component.html',
  styleUrl: './qualification-view.component.css'
})
export class QualificationViewComponent {
  bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE3MzczNzI4MDMsImlhdCI6MTczNzM2OTIwMywianRpIjoiNGVjMTlhN2UtNjYzNC00YTgzLWI1MWYtZTg2N2Q1NmNjMWNjIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiJmZTAzNTg3ZS0wM2RlLTQ2Y2UtOGU2Yy04NzcwNWE2NDBjNDAiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicHJvZHVjdF9vd25lciIsIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.UOCoeO7NqfhnDEl9gUVwpIu0kM7mFIUW0X7bvosL4YrAQVI6McA5Ix0Hp31-kf1hj5_fmG8XOCQoG_0txgyZGsjD4eu2eFlh-YfzI1DBnbnUK2TVpvcUqLNw7im9-8TYRsUOZemcSALide7WnT7YTwXlvsupO2OXtTYY2qe2KNnlcnDUeCo-zQrSPMiXCGy8I1JjZpwRIcQJLsQLgEw9MAUggLNAo-vuvxW9s-A57UGKIbIPKjI2tpii8hiemjxOhOtKWWx814iSP8o51mSAA5znp8GPkJb8W9e02k7e43LpC0fFSp1m6QeRwhOd-wVNHBuifzCMPc6jB3EegfbQ-g';
  qualifications$: Observable<Qualification[]>;

  constructor(private http: HttpClient) {
    this.qualifications$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.qualifications$ = this.http.get<Qualification[]>('http://localhost:8089/qualifications', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
  }

  deleteQualification(id: number) {
    this.http.delete(`http://localhost:8089/qualifications/${id}`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    }).subscribe({
      next: () => {
        this.fetchData();
      },
      error: (err) => {
        console.error('Fehler beim Löschen der Qualifikation:', err);
      }
    });
  }
}
