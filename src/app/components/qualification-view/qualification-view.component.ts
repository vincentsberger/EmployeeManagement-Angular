import { Qualification } from './../../model/Qualification';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MainViewComponent } from '../main-view/main-view.component';
import Keycloak from 'keycloak-js';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { QualificationService } from '../../service/qualification.service';

@Component({
  selector: 'app-qualification-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MainViewComponent,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIcon,
  ],
  templateUrl: './qualification-view.component.html',
  styleUrl: './qualification-view.component.scss',
})
export class QualificationViewComponent {
  isLoading = true;
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  readonly dialog = inject(MatDialog);
  qualifications$: Observable<Qualification[]>;
  filteredQualifications$: Observable<Qualification[]>;
  searchQuery: string = '';

  constructor(
    private toastr: ToastrService,
    private qualificationService: QualificationService
  ) {
    this.qualifications$ = this.qualificationService.getQualifications();
    this.filteredQualifications$ = this.qualifications$;
    this.updateView();
  }

  /**
   * Filters the list of qualifications based on the current search query.
   *
   * This method updates `filteredQualifications$` with qualifications whose
   * `skill` property contains the search query, ignoring case differences.
   */
  searchQualification() {
    this.filteredQualifications$ = this.qualifications$.pipe(
      map((qualifications) =>
        qualifications.filter((qualification) =>
          qualification.skill
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        )
      )
    );
  }

  updateView() {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  /**
   * Opens a confirmation modal when deleting a qualification, and deletes the
   * qualification if the user confirms.
   *
   * @param qualification The qualification to be deleted.
   */
  openDeleteQualificationModal(qualification: Qualification) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        qualification,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result == true) {
        this.qualificationService
          .deleteQualification(qualification)
          .subscribe((result) => {});
        this.isLoading = true;
        this.updateView();
        this.toastr.success(
          `Qualifikation "${qualification.skill}" [ID: ${qualification.id}] wurde erfolgreich gelöscht. `,
          'Löschen erfolgreich!',
          {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-bottom-center',
          }
        );
      }
    });
  }
}
