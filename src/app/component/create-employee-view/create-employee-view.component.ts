import { Component } from '@angular/core';
import {
  FormControl,
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
import { map, Observable, of } from 'rxjs';
import { PostEmployeeDTO } from '../../model/DTO/post-employee-dto';
import { EmployeeService } from '../../service/employee.service';
import { QualificationService } from '../../service/qualification.service';
import { Employee } from '../../model/Employee';
import { MessageService } from '../../service/message.service';
import { DrawerService } from '../../service/drawer.service';
import { PostQualificationDTO } from '../../model/DTO/post-qualification-dto';

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
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private messageService: MessageService,
    private drawerService: DrawerService
  ) {
    this.qualifications$ = this.qualificationService.getQualifications();

    this.newEmployeeForm = new FormGroup({
      firstName: new FormControl<string>('', [Validators.required]),
      lastName: new FormControl<string>('', [Validators.required]),
      street: new FormControl<string>('', [Validators.required]),
      postcode: new FormControl<string>('', [
        Validators.required,
        Validators.pattern('^[0-9]{5}$'),
      ]),
      city: new FormControl<string>('', [Validators.required]),
      phone: new FormControl<string>('', [Validators.required]),
      skillSet: new FormControl<number[]>([]),
    });
  }

  public addNewQualification(skill: string) {
    const newQualification: PostQualificationDTO = {
      skill: skill.trim(),
    } as PostQualificationDTO;
    this.qualificationService
      .isExistingQualification(newQualification)
      .subscribe((isExisting: boolean): void => {
        if (isExisting) {
          this.messageService.showError(
            'Qualifikation existiert bereits!',
            'Fehler!'
          );
          this.newEmployeeForm.get('newSkill')?.reset();
        } else {
          this.qualificationService
            .addQualification(newQualification)
            .subscribe((qualification: Qualification) => {
              this.qualificationService.fetchQualifications();
            });
        }
      });
    const newSkillValue = this.newEmployeeForm.get('newSkill')?.value.trim();
  }

  /**
   * When a qualification is selected or deselected in the select component,
   * this function is called. It takes the selected qualifications and updates
   * the form value for the skillSet.
   * @param event A MatSelectChange event containing the selected values.
   */
  onSelectionChange(event: any) {
    this.selectedItems = event.value;
    this.newEmployeeForm.patchValue({ skillSet: this.selectedItems });
  }

  /**
   * Saves the new employee.
   *
   * Checks if the employee already exists with the same first name, last name, street, postcode, city, and phone number.
   * If the employee already exists, shows an error message and closes the drawer.
   * If the employee does not exist already, sends a POST request to the backend with the new employee information.
   * The response is expected to be an `Employee` object, which is then logged to the console.
   * Finally, fetches the updated list of employees and closes the drawer.
   */
  saveEmployee() {
    if (this.newEmployeeForm.valid) {
      // Retrieve form data
      const formData: PostEmployeeDTO = this.newEmployeeForm.value;

      // check if qualifcation already exists
      const employeeAlreadyExists =
        this.employeeService.isExistingEmployee(formData);

      if (employeeAlreadyExists) {
        this.messageService.showError(
          `Mitarbeiter "${
            formData.firstName + ' ' + formData.lastName
          }" existiert bereits!`,
          'Fehler beim Hinzufügen!'
        );
        this.newEmployeeForm.reset();
        // this.drawerService.close();
        return;
      }

      this.employeeService
        .addEmployee(formData)
        .subscribe((employee: Employee) => {
          this.messageService.showSuccess(
            `Mitarbeiter "${
              employee.firstName + ' ' + employee.lastName
            }" wurde erfolgreich hinzugefügt!`,
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
