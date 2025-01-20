import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-new-qualification-view',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './new-qualification-view.component.html',
  styleUrl: './new-qualification-view.component.css'
})
export class NewQualificationViewComponent {
  bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE3MzczNzI4MDMsImlhdCI6MTczNzM2OTIwMywianRpIjoiNGVjMTlhN2UtNjYzNC00YTgzLWI1MWYtZTg2N2Q1NmNjMWNjIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiJmZTAzNTg3ZS0wM2RlLTQ2Y2UtOGU2Yy04NzcwNWE2NDBjNDAiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicHJvZHVjdF9vd25lciIsIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.UOCoeO7NqfhnDEl9gUVwpIu0kM7mFIUW0X7bvosL4YrAQVI6McA5Ix0Hp31-kf1hj5_fmG8XOCQoG_0txgyZGsjD4eu2eFlh-YfzI1DBnbnUK2TVpvcUqLNw7im9-8TYRsUOZemcSALide7WnT7YTwXlvsupO2OXtTYY2qe2KNnlcnDUeCo-zQrSPMiXCGy8I1JjZpwRIcQJLsQLgEw9MAUggLNAo-vuvxW9s-A57UGKIbIPKjI2tpii8hiemjxOhOtKWWx814iSP8o51mSAA5znp8GPkJb8W9e02k7e43LpC0fFSp1m6QeRwhOd-wVNHBuifzCMPc6jB3EegfbQ-g';
  qualificationName: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  saveQualification() {
    if (this.qualificationName.trim() === '') {
      alert('Der Name der Qualifikation darf nicht leer sein.');
      return;
  }

    const payload = { skill: this.qualificationName };

    this.http.post('http://localhost:8089/qualifications', payload, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    }).subscribe({
      next: () => {
        alert('Qualifikation erfolgreich hinzugefügt!');
        this.router.navigate(['/qualifications']);
      },
      error: (err) => {
        console.error('Fehler beim Hinzufügen der Qualifikation:', err);
        alert('Fehler beim Hinzufügen der Qualifikation.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/qualifications']);
  }
}
