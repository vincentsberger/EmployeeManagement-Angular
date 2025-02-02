import { Component } from '@angular/core';
import { DrawerComponent } from '../drawer/drawer.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-qualification-form-drawer',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    DrawerComponent
  ],
  templateUrl: './add-qualification-form-drawer.component.html',
  styleUrl: './add-qualification-form-drawer.component.scss'
})
export class AddQualificationFormDrawerComponent {
  items: { name: string }[] = [];
  newItem: { name: string } = { name: '' };

  addItem() {
    if (this.newItem.name.trim()) {
      this.items.push({ ...this.newItem });
      this.newItem.name = '';
    }
  }
}
