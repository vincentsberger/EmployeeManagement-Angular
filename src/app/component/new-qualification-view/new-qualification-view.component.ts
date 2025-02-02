import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QualificationService } from '../../service/qualification.service';
import { MessageService } from '../../service/message.service';
import { LoggingService } from '../../service/logging.service';
import { Qualification } from '../../model/Qualification';
import { ApiRoutes } from '../../enums/api-routes';
import { ApiService } from '../../service/api.service';
import { DrawerService } from '../../service/drawer.service';
import { PostQualificationDTO } from '../../model/DTO/post-qualification-dto';

@Component({
  selector: 'app-new-qualification-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-qualification-view.component.html',
  styleUrl: './new-qualification-view.component.css',
})
export class NewQualificationViewComponent {
  qualificationName: string = '';

  constructor(
    private qualificationService: QualificationService,
    private messageService: MessageService,
    private apiService: ApiService,
    private drawerService: DrawerService
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

    const payload = { skill: this.qualificationName };

    this.qualificationService
      .addQualification(payload)
      .subscribe((qualification: Qualification) => {
        this.messageService.showSuccess(
          `Qualifikation "${qualification.skill}" erfolgreich hinzugefügt!`,
          'Hinzufügen erfolgreich!'
        );
        this.qualificationService.fetchQualifications();
        this.drawerService.close();
      });
  }

  cancel() {
    this.drawerService.close();
  }
}
