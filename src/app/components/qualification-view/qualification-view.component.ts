import {Component, inject, Input} from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Qualification} from "../../model/Qualification";
import {RouterLink} from "@angular/router";
import {MainViewComponent} from "../main-view/main-view.component";
import Keycloak from "keycloak-js";

@Component({
  selector: 'app-qualification-view',
  standalone: true,
  imports: [
    MatListModule,
    NgForOf,
    NgIf,
    AsyncPipe,
    RouterLink,
    MainViewComponent
  ],
  templateUrl: './qualification-view.component.html',
  styleUrl: './qualification-view.component.css'
})
export class QualificationViewComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
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
