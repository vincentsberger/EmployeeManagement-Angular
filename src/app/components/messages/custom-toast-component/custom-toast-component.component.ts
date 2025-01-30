import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-toast-component',
  imports: [CommonModule],
  templateUrl: './custom-toast-component.component.html',
  styleUrl: './custom-toast-component.component.scss'
})
export class CustomToastComponentComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {
    message: string;
    type: 'default'|'success'|'danger'|'warning'|'info'
  }) { }

}
