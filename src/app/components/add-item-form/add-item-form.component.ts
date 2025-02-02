import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-add-item-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-item-form.component.html',
  styleUrl: './add-item-form.component.scss'
})
export class AddItemFormComponent {
  name: string = '';
  @Output() save = new EventEmitter<string>();

  onSubmit() {
    this.save.emit(this.name);
  }

}
