import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
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
import { map } from 'rxjs';

@Component({
  selector: 'app-new-qualification-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-qualification-view.component.html',
  styleUrl: './new-qualification-view.component.css',
})
export class NewQualificationViewComponent implements AfterViewInit {
  qualificationName: string = '';

  constructor(
    private qualificationService: QualificationService,
    private messageService: MessageService,
    private apiService: ApiService,
    private drawerService: DrawerService,
    private renderer: Renderer2
  ) {

  }

  ngAfterViewInit() {
    this.renderer.selectRootElement('#qualificationName').focus();
  }

  /**
   * Saves the new qualification by sending a POST request to the backend.
   *
   * Checks if the name of the qualification is not empty and not longer than 35 characters, and if it already exists.
   * If the qualification already exists, shows an error message and closes the drawer.
   * If the qualification does not exist already, sends a POST request to the backend with the new qualification information.
   * The response is expected to be a `Qualification` object, which is then logged to the console.
   * Finally, fetches the updated list of qualifications and closes the drawer.
   */
  saveQualification() {
    if (this.qualificationName.trim() === '') {
      alert('Der Name der Qualifikation darf nicht leer sein.');
      return;
    }
    if (this.qualificationName.length > 35) {
      alert('Der Name der Qualifikation ist zu lang');
      return;
    }
    // check if qualifcation already exists
    let qualificationExistsAlready = false;

    this.qualificationService
      .getQualifications()
      .pipe(
        map((qualifications: Qualification[]): boolean =>
          qualifications.some(
            (qualification): boolean =>
              qualification.skill === this.qualificationName
          )
        )
      )
      .subscribe((qualificationExists: boolean) => {
        if (qualificationExists) {
          qualificationExistsAlready = true;
          return;
        }
      });

    if (qualificationExistsAlready) {
      this.messageService.showError(
        `Qualifikation "${this.qualificationName}" existiert bereits!`,
        'Fehler beim Hinzufügen!'
      );
      this.drawerService.close();
      return;
    }

    const payload = { skill: this.qualificationName };

    this.qualificationService.addQualification(payload).subscribe({
      next: (qualification: Qualification) => {
        this.messageService.showSuccess(
          `Qualifikation "${qualification.skill}" erfolgreich hinzugefügt!`,
          'Hinzufügen erfolgreich!'
        );
        this.qualificationService.fetchQualifications();
        this.drawerService.close();
      },
    });
  }

  cancel() {
    this.drawerService.close();
  }
}
