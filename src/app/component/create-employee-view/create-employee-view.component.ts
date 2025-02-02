import { Component, inject } from '@angular/core';
import { MainViewComponent } from '../main-view/main-view.component';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Qualification } from '../../model/Qualification';
import { AsyncPipe, NgForOf } from '@angular/common';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {
  MatOption,
  MatSelect,
  MatSelectModule,
} from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { PostEmployeeDTO } from '../../model/DTO/post-employee-dto';
import { EmployeeService } from '../../service/employee.service';
import { QualificationService } from '../../service/qualification.service';
import { Employee } from '../../model/Employee';
import { MessageService } from '../../service/message.service';
import { DrawerService } from '../../service/drawer.service';

@Component({
  selector: 'app-create-employee-view',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    MatFormField,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './create-employee-view.component.html',
  styleUrl: './create-employee-view.component.scss',
})
export class CreateEmployeeViewComponent {
  newEmployeeForm: FormGroup;
  qualifications$: Observable<Qualification[]>;

  selectedItems: number[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private messageService: MessageService,
    private drawerService: DrawerService
  ) {
    this.qualifications$ = this.qualificationService.getQualifications();

    this.newEmployeeForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      street: ['', Validators.required],
      postcode: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      skillSet: [this.selectedItems],
    });
  }

  onSelectionChange(event: any) {
    this.selectedItems = event.value;
    this.newEmployeeForm.patchValue({ skillSet: this.selectedItems });
  }

  saveEmployee() {
    if (this.newEmployeeForm.valid) {
      // Retrieve form data
      const formData: PostEmployeeDTO = this.newEmployeeForm.value;

      this.employeeService
        .addEmployee(formData)
        .subscribe((employee: Employee) => {
          this.messageService.showSuccess(
            `Mitarbeiter "${
              employee.firstName + ' ' + employee.lastName
            }"}" erfolgreich hinzugefügt!`,
            'Hinzufügen erfolgreich!'
          );
          this.employeeService.fetchEmployees();
          this.drawerService.close();
        });

      this.newEmployeeForm.reset();
    }
  }

  cancel() {
    this.drawerService.close();
  }
}
