import { Component } from '@angular/core';
import {
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, forkJoin, map, Observable, of } from 'rxjs';
import { MainViewComponent } from '../main-view/main-view.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../../service/employee.service';
import { QualificationService } from '../../service/qualification.service';
import { MessageService } from '../../service/message.service';
import { Employee } from '../../model/Employee';
import { Qualification } from '../../model/Qualification';
import { PostEmployeeDTO } from '../../model/DTO/post-employee-dto';
import { AddQualificationToEmployeeDTO } from '../../model/DTO/add-qualification-to-employee-dto';
import { PostQualificationDTO } from '../../model/DTO/post-qualification-dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit-view.component.html',
  styleUrls: ['./employee-edit-view.component.scss'],
  imports: [
    CommonModule,
    MainViewComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class EmployeeEditViewComponent {
  employeeForm: FormGroup;
  employee: Employee = {} as Employee;
  currentEmployee$: Observable<Employee>;
  currentEmployeeQualifications$: Observable<Qualification[]>;
  employeeId: string | number = '';
  newQualificationDto: PostQualificationDTO = {} as PostQualificationDTO;
  selectedItems: number[] = [];
  qualifications$: Observable<Qualification[]>;
  availableQualifications$: Observable<Qualification[]> = of([]);

  // deletedSkills: { id: number; skill: string }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private messageService: MessageService
  ) {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.currentEmployee$ = this.employeeService.getEmployeeById(
      this.employeeId
    );
    this.currentEmployee$.subscribe((employee: Employee) => {
      this.employee = employee;
    });
    this.currentEmployeeQualifications$ =
      this.qualificationService.getQualificationsByEmployeeId(this.employeeId);
    this.employeeForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{5}$'),
      ]),
      city: new FormControl('', [Validators.required]),
      qualifications: new FormArray([]),
      newSkill: new FormControl(''),
    });
    this.currentEmployee$.subscribe((employee: Employee) => {
      this.employeeForm.patchValue(employee);
    });
    this.currentEmployeeQualifications$.subscribe(
      (quals: Qualification[]) => {}
    );
    this.qualifications$ = this.qualificationService.getQualifications();
    this.updateAvailableQualifications();
  }

  /**
   * Updates the list of available qualifications by removing the qualifications
   * that are already linked to the current employee.
   *
   * This method uses the `combineLatest` operator to subscribe to both the list
   * of all qualifications and the list of qualifications linked to the current
   * employee. It then uses the `map` operator to create a new array of
   * qualifications that are not already linked to the current employee.
   *
   * The result is an observable of the updated list of available qualifications.
   */
  public updateAvailableQualifications() {
    this.availableQualifications$ = combineLatest([
      this.qualifications$,
      this.currentEmployeeQualifications$,
    ]).pipe(
      map(([allQualifications, currentEmployeeQualifications]) => {
        // save just IDs
        const currentEmployeeQualificationsIds: number[] =
          currentEmployeeQualifications.map(
            (qual: Qualification): number => qual.id
          );

        // if contain then add result
        return allQualifications.filter(
          (qual: Qualification) =>
            !currentEmployeeQualificationsIds.includes(qual.id)
        );
      })
    );
  }

  public onSelectionChange(event: any) {
    this.selectedItems = event.value;
    this.employeeForm.patchValue({ qualifications: this.selectedItems });
  }

  public refreshEmployeeQualifications(): void {
    this.currentEmployeeQualifications$ =
      this.qualificationService.getQualificationsByEmployeeId(this.employeeId);
  }

  /**
   * Adds a new qualification to the current employee.
   *
   * This method checks if the qualification already exists in the backend.
   * If it does, it shows an error message.
   * If not, it sends a POST request to the backend to create a new qualification,
   * and then adds the qualification to the current employee.
   *
   * @param newQualification - The name of the new qualification to add.
   */
  public addQualificationToEmployee(newQualification: string): void {
    // check if qualification already exists
    let qualificationExistsAlready = false;

    this.newQualificationDto.skill = newQualification.trim();

    this.qualificationService
      .getQualifications()
      .subscribe((qualifications: Qualification[]) => {
        qualifications.map((qualification) => {
          if (qualification.skill.trim() == this.newQualificationDto.skill) {
            qualificationExistsAlready = true;
          }
        });

        if (qualificationExistsAlready) {
          this.messageService.showError(
            'Diese Qualifikation ist bereits vorhanden.',
            'Fehler'
          );
        } else {
          this.qualificationService
            .addQualification(this.newQualificationDto)
            .subscribe({
              next: (qualification: Qualification) => {
                this.messageService.showSuccess(
                  `Qualifikation "${qualification.skill}" [${qualification.id}] erfolgreich erstellt.`,
                  'Erfolg'
                );
                this.employeeService
                  .addQualificationToEmployee(qualification, this.employee)
                  .subscribe({
                    next: (employeeResult: Employee) => {
                      this.messageService.showSuccess(
                        `Qualifikation "${
                          this.newQualificationDto.skill
                        }" erfolgreich zu Mitarbeiter "${
                          employeeResult.firstName +
                          ' ' +
                          employeeResult.lastName
                        }" hinzugefügt.`,
                        'Erfolg'
                      );
                      this.refreshEmployeeQualifications();
                      this.employeeForm.get('newSkill')?.reset();
                    },
                    error: (error: any) => {
                      this.messageService.showError(
                        `Fehler beim Hinzufügen der Qualifikation "${this.newQualificationDto.skill}" zum Mitarbeiter "${this.employee.firstName} ${this.employee.lastName}".`,
                        'Fehler'
                      );
                    },
                  });
              },
            });
        }
      });
  }

  /**
   * Removes a qualification from the current employee.
   *
   * This method uses the employee service to delete a specific qualification
   * from the current employee. Upon successful deletion, it displays a success
   * message and refreshes the list of qualifications associated with the
   * employee. If an error occurs during the process, an error message is shown.
   *
   * @param qualification - The qualification object to be removed from the employee.
   */
  public deleteQualificationFromEmployee(qualification: Qualification): void {
    this.employeeService
      .removeQualificationFromEmployee(qualification, this.employee)
      .subscribe({
        next: (employeeResult: Employee) => {
          this.messageService.showSuccess(
            `Qualifikation "${
              qualification.skill
            }" erfolgreich von Mitarbeiter "${
              employeeResult.firstName + ' ' + employeeResult.lastName
            }" entfernt.`,
            'Erfolg'
          );
          this.refreshEmployeeQualifications();
        },
        error: (error: any) => {
          this.messageService.showError(
            `Fehler beim Entfernen der Qualifikation "${
              qualification.skill
            }" vom Mitarbeiter "${
              this.employee.firstName + ' ' + this.employee.lastName
            }".`,
            'Fehler'
          );
        },
      });

    // const skillControl = this.qualifications.controls.find(control => control.value.skill === skill);
    // if (!skillControl) return;

    // this.deletedSkills.push(skillControl.value);

    // const skillIndex = this.qualifications.controls.findIndex(control => control.value.skill === skill);
    // if (skillIndex !== -1) {
    //   this.qualifications.removeAt(skillIndex);
    // }
  }

  public fetchEmployeeQualifications(): void {
    this.currentEmployeeQualifications$.subscribe((quals: Qualification[]) => {
      this.employeeForm.get('qualifications')?.patchValue(quals);
    });
  }

  public saveEmployee() {
    if (this.employeeForm.valid) {
      // Retrieve form data
      let formData: PostEmployeeDTO = this.prepareFormData(
        this.employeeForm.value
      );
      this.currentEmployee$.subscribe((employee: Employee) => {
        this.employee = employee;
      })
      this.employeeService
        .updateEmployee(formData, this.employee)
        .subscribe((employee: Employee) => {
          this.messageService.showSuccess(
            `Mitarbeiter "${
              employee.firstName + ' ' + employee.lastName
            }" wurde erfolgreich aktualisiert!`,
            'Aktualisieren erfolgreich!'
          );
          this.employeeService.fetchEmployees();
        });
    }
  }

  private prepareFormData(formData: PostEmployeeDTO): PostEmployeeDTO {
    formData.lastName = formData.lastName?.trim();
    formData.street = formData.street;
    formData.postcode = formData.postcode?.trim();
    formData.city = formData.city?.trim();
    formData.phone = formData.phone;
    formData.skillSet = formData.skillSet;
    return formData;
  }
  // const skillSet = this.qualifications.controls.map(control => control.value.id);
  // const updatedEmployee = { ...this.employeeForm.value, skillSet };

  // try {
  //   for (const skill of this.deletedSkills) {
  //     const skillControl = this.qualifications.controls.find(control => control.value.skill === skill);
  //     if (skillControl) {
  //       await firstValueFrom(this.http.delete(
  //         `http://localhost:8089/employees/${this.employeeId}/qualifications/${skillControl.value.id}`,
  //         { headers: this.headers }
  //       ));
  //     }
  //   }

  //   await firstValueFrom(this.http.put<any>(
  //     `http://localhost:8089/employees/${this.employeeId}`,
  //     updatedEmployee,
  //     { headers: this.headers }
  //   ));
  //   this.messageService.showSuccess('Mitarbeiterdaten von wurden erfolgreich gespeichert.', 'Erfolg');
  //   this.router.navigate(['/employees']);
  // } catch (error) {
  //   this.messageService.showError('Fehler beim Speichern des Mitarbeiters. Bitte versuchen Sie es erneut.', 'Speicherfehler');
  // }

  cancel() {
    this.router.navigate(['/employees']);
  }

  // private get headers(): HttpHeaders {
  //   return new HttpHeaders().set('Authorization', `Bearer ${this.bearer}`);
  // }
}
