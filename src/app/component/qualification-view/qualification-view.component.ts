import { Qualification } from '../../model/Qualification';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { MainViewComponent } from '../main-view/main-view.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { QualificationService } from '../../service/qualification.service';
import { MessageService } from '../../service/message.service';
import { DrawerService } from '../../service/drawer.service';
import { NewQualificationViewComponent } from '../new-qualification-view/new-qualification-view.component';

@Component({
  selector: 'app-qualification-view',
  standalone: true,
  imports: [
    CommonModule,
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
  readonly dialog = inject(MatDialog);
  qualifications$: Observable<Qualification[]>;
  filteredQualifications$: Observable<Qualification[]>;
  searchQuery: string = '';

  // test
  items: string[] = [];

  constructor(
    protected qualificationService: QualificationService,
    protected messageService: MessageService,
    protected drawerService: DrawerService
  ) {
    this.qualifications$ = this.qualificationService.getQualifications();
    this.filteredQualifications$ = this.qualifications$;
  }

  /**
   * Filters the list of qualifications based on the current search query.
   *
   * This method updates `filteredQualifications$` with qualifications whose
   * `skill` property contains the search query, ignoring case differences.
   */
  searchQualification() {
    this.filteredQualifications$ = this.qualificationService.getQualifications()
      .pipe(
        map((qualifications) =>
          qualifications.filter((qualification) =>
            qualification.skill
              ?.toLowerCase()
              .includes(this.searchQuery.toLowerCase())
          )
        )
      )
  }

  /**
   * Opens a drawer to add a new qualification.
   *
   * This method uses the DrawerService to open a new drawer
   * with the NewQualificationViewComponent, providing a title
   * for the drawer.
   */

  openAddQualificationDrawer() {
    this.drawerService.open(NewQualificationViewComponent, {
      title: 'Qualifikation hinzufügen',
    });
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
      if (result == true) {
        this.qualificationService.deleteQualification(qualification).subscribe({
          next: () => {
            this.messageService.showSuccess(
              `Qualifikation "${qualification.skill}" wurde erfolgreich gelöscht!`,
              'Löschen erfolgreich!'
            );
          },
        });
        this.qualificationService.fetchQualifications();
      }
    });
  }
}
