import {Component, inject} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import Keycloak from "keycloak-js";

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
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
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
