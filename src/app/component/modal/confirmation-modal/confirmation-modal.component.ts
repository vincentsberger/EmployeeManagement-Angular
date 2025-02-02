import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Qualification } from '../../../model/Qualification';
import { Employee } from '../../../model/Employee';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  imports: [MatDialogModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css',
})
export class ConfirmationModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      qualification?: Qualification;
      employee?: Employee;
    }
  ) {}
}
