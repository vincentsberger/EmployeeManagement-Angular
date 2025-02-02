import { Qualification } from './../../model/Qualification';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { MainViewComponent } from '../main-view/main-view.component';
import Keycloak from 'keycloak-js';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { QualificationService } from '../../service/qualification.service';
import { MessageService } from '../../service/message.service';
import { DrawerService } from '../../service/drawer.service';
import { AddItemFormComponent } from '../add-item-form/add-item-form.component';
import { DrawerPanelComponent } from "../drawer-panel/drawer-panel.component";
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
    DrawerPanelComponent
],
  templateUrl: './qualification-view.component.html',
  styleUrl: './qualification-view.component.scss',
})
export class QualificationViewComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
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
    this.filteredQualifications$ = this.qualificationService
      .getQualifications()
      .pipe(
        map((qualifications) =>
          qualifications.filter((qualification) =>
            qualification.skill
              ?.toLowerCase()
              .includes(this.searchQuery.toLowerCase())
          )
        )
      );
  }

  openDrawer() {
    this.drawerService.open(AddItemFormComponent, {
      title: 'Qualifikation hinzufügen',
      save: (value: string) => this.items.push(value)
    });
  }

  // updateView() {
  //   setTimeout(() => {
  //     this.isLoading = false;
  //   }, 500);
  // }

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
