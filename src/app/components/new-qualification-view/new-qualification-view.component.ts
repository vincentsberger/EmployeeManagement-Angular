import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Keycloak from 'keycloak-js';
import { MainViewComponent } from '../main-view/main-view.component';
import { QualificationService } from '../../service/qualification.service';
import { MessageService } from '../../service/message.service';
import { LoggingService } from '../../service/logging.service';
import { Qualification } from '../../model/Qualification';
import { ApiRoutes } from '../../enums/api-routes';
import { ApiService } from '../../service/api.service';
import { NEVER } from 'rxjs';

@Component({
  selector: 'app-new-qualification-view',
  standalone: true,
  imports: [FormsModule, MainViewComponent],
  templateUrl: './new-qualification-view.component.html',
  styleUrl: './new-qualification-view.component.css',
})
export class NewQualificationViewComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  qualificationName: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private qualificationService: QualificationService,
    private messageService: MessageService,
    private loggingService: LoggingService,
    private apiService: ApiService
  ) {}

  saveQualification() {
    if (this.qualificationName.trim() === '') {
      alert('Der Name der Qualifikation darf nicht leer sein.');
      return;
    }
    if (this.qualificationName.length > 35) {
      alert('Der Name der Qualifikation ist zu lang');
      return;
    }

    console.debug("Qualifikation:", this.qualificationName);

    const payload = { skill: this.qualificationName };

    this.apiService.sendPostRequest<Qualification>(
      ApiRoutes.QUALIFICATIONS, payload)
      .subscribe({
        next: (qualification: Qualification) => {
          this.messageService.showSuccess(`Qualifikation "${qualification.skill}" erfolgreich hinzugefügt!`, "Hinzufügen erfolgreich!");
          this.qualificationService.fetchQualifications();
          this.router.navigate(['/qualifications']);
        },
      });
  }

  cancel() {
    this.router.navigate(['/qualifications']);
  }
}
