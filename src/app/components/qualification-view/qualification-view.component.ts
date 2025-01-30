import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Qualification} from "../../model/Qualification";
import {RouterLink} from "@angular/router";
import {MainViewComponent} from "../main-view/main-view.component";
import Keycloak from "keycloak-js";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-qualification-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MainViewComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './qualification-view.component.html',
  styleUrl: './qualification-view.component.css'
})
export class QualificationViewComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  qualifications$: Observable<Qualification[]>;
  filteredQualifications$: Observable<Qualification[]>;
  searchQuery: string = '';

  constructor(private http: HttpClient) {
    this.qualifications$ = of([]);
    this.filteredQualifications$ = this.qualifications$;
    this.fetchData();
  }

  fetchData() {
    this.qualifications$ = this.http.get<Qualification[]>('http://localhost:8089/qualifications', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
    this.filteredQualifications$ = this.qualifications$;
  }

  searchQualification() {
    this.filteredQualifications$ = this.qualifications$.pipe(
      map(qualifications =>
        qualifications.filter(qualification =>
          qualification.skill?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      )
    );
  }

  deleteQualification(id: number) {
    this.http.delete(`http://localhost:8089/qualifications/${id}`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    }).subscribe({
      next: () => {
        alert('Qualifikation erfolgreich gelöscht!');
        this.fetchData();
      },
      error: (err) => {
        console.error('Fehler beim Löschen der Qualifikation:', err);
      }
    });
  }
}
