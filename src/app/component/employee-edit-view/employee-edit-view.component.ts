import {Component, OnInit, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import Keycloak from 'keycloak-js';
import {firstValueFrom} from 'rxjs';
import {MainViewComponent} from "../main-view/main-view.component";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {EmployeeService} from "../../service/employee.service";
import {QualificationService} from "../../service/qualification.service";
import {MessageService} from "../../service/message.service";

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit-view.component.html',
  styleUrls: ['./employee-edit-view.component.scss'],
  imports: [
    CommonModule,
    MainViewComponent,
    ReactiveFormsModule,
    MatIconModule,
  ]
})
export class EmployeeEditViewComponent implements OnInit {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;

  employeeForm: FormGroup;
  employeeId: string | null = null;

  deletedSkills: { id: number; skill: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private messageService: MessageService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      street: [''],
      postcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      city: [''],
      qualifications: this.fb.array([]),
      newSkill: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.loadEmployeeData(this.employeeId);
      this.loadQualifications(this.employeeId);
    }
  }

  get qualifications() {
    return this.employeeForm.get('qualifications') as FormArray;
  }

  private loadEmployeeData(id: string): void {
    const numericId = Number(id);
    this.employeeService.getEmployeeById(numericId).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue(employee);
      },
      error: (error) => {
        this.messageService.showError('Fehler beim Laden der Mitarbeiterdaten. Bitte versuchen Sie es erneut.', 'Ladefehler');
      }
    });
  }


  private loadQualifications(id: string): void {
    const numericId = Number(id);
    this.qualificationService.getQualificationsByEmployeeId(numericId).subscribe({
      next: (qualifications) => {
        const skillsArray = this.fb.array(
          qualifications.map(skill => this.fb.group({id: skill.id, skill: skill.skill}))
        );
        this.employeeForm.setControl('qualifications', skillsArray);
      },
      error: (error) => {
        this.messageService.showError('Fehler beim Laden der Qualifikationen. Bitte versuchen Sie es erneut.', 'Ladefehler');
      }
    });
  }

  addSkill() {
    const newSkillValue = this.employeeForm.get('newSkill')?.value.trim();
    if (!newSkillValue) {
      this.messageService.showError('Der Name der Qualifikation darf nicht leer sein.', 'Fehler');
      return;
    }

    const deletedSkillIndex = this.deletedSkills.findIndex(q => q.skill.toLowerCase() === newSkillValue.toLowerCase());

    if (deletedSkillIndex !== -1) {
      const restoredSkill = this.deletedSkills[deletedSkillIndex];
      this.qualifications.push(this.fb.group({id: restoredSkill.id, skill: restoredSkill.skill}));
      this.deletedSkills.splice(deletedSkillIndex, 1);
    } else {
      this.checkIfQualificationExists(newSkillValue);
    }

    this.employeeForm.get('newSkill')?.setValue('');
  }

  private async checkIfQualificationExists(skill: string): Promise<void> {
    try {
      const qualifications = await firstValueFrom(this.qualificationService.getQualifications());
      const existingQualification = qualifications.find(q => q.skill.toLowerCase() === skill.toLowerCase());

      if (existingQualification) {
        await this.addExistingQualificationToEmployee(existingQualification.id, existingQualification.skill);
      } else {
        await this.addQualificationToEmployee(skill);
      }
    } catch (error) {
      this.messageService.showError('Fehler beim Laden der Qualifikationen. Bitte versuchen Sie es erneut.', 'Fehler');
    } finally {
      this.employeeForm.get('newSkill')?.setValue('');
    }
  }

  private async addExistingQualificationToEmployee(qualificationId: number, skill: string): Promise<void> {
    try {
      const qualificationToAdd = { id: qualificationId, skill };
      await firstValueFrom(this.http.post<any>(
        `http://localhost:8089/employees/${this.employeeId}/qualifications`,
        qualificationToAdd,
        { headers: this.headers }
      ));

      const newSkillFormGroup = this.fb.group({ id: qualificationId, skill });
      this.qualifications.push(newSkillFormGroup);
      this.messageService.showSuccess(`Qualifikation "${skill}" erfolgreich hinzugefügt.`, 'Erfolg');
    } catch (error) {
      this.messageService.showError('Der Mitarbeiter besitzt bereits diese Qualifikation.', 'Fehler');
    } finally {
      this.employeeForm.get('newSkill')?.setValue('');
    }
  }


  private async addQualificationToEmployee(skill: string): Promise<void> {
    if (this.qualifications.controls.some(control => control.value.skill === skill)) {
      this.messageService.showError('Diese Qualifikation ist bereits vorhanden.', 'Fehler');
      return;
    }

    try {
      const response = await firstValueFrom(this.http.post<any>(
        `http://localhost:8089/qualifications`,
        { skill: skill.trim() },
        { headers: this.headers }
      ));

      const qualificationToAdd = { id: response.id, skill: response.skill };

      await firstValueFrom(this.http.post<any>(
        `http://localhost:8089/employees/${this.employeeId}/qualifications`,
        qualificationToAdd,
        { headers: this.headers }
      ));

      const newSkillFormGroup = this.fb.group({ id: response.id, skill });
      this.qualifications.push(newSkillFormGroup);
      this.messageService.showSuccess(`Qualifikation "${skill}" erfolgreich erstellt und hinzugefügt.`, 'Erfolg');
    } catch (error) {
      this.messageService.showError('Fehler beim Erstellen der Qualifikation. Der Mitarbeiter hat möglicherweise bereits diese Qualifikation.', 'Fehler');
    } finally {
      this.employeeForm.get('newSkill')?.setValue('');
    }
  }

  deleteQualification(skill: string): void {
    const skillControl = this.qualifications.controls.find(control => control.value.skill === skill);
    if (!skillControl) return;

    this.deletedSkills.push(skillControl.value);

    const skillIndex = this.qualifications.controls.findIndex(control => control.value.skill === skill);
    if (skillIndex !== -1) {
      this.qualifications.removeAt(skillIndex);
    }
  }

  async save(): Promise<void> {
    const skillSet = this.qualifications.controls.map(control => control.value.id);
    const updatedEmployee = { ...this.employeeForm.value, skillSet };

    try {
      for (const skill of this.deletedSkills) {
        const skillControl = this.qualifications.controls.find(control => control.value.skill === skill);
        if (skillControl) {
          await firstValueFrom(this.http.delete(
            `http://localhost:8089/employees/${this.employeeId}/qualifications/${skillControl.value.id}`,
            { headers: this.headers }
          ));
        }
      }

      await firstValueFrom(this.http.put<any>(
        `http://localhost:8089/employees/${this.employeeId}`,
        updatedEmployee,
        { headers: this.headers }
      ));
      this.messageService.showSuccess('Mitarbeiterdaten von wurden erfolgreich gespeichert.', 'Erfolg');
      this.router.navigate(['/employees']);
    } catch (error) {
      this.messageService.showError('Fehler beim Speichern des Mitarbeiters. Bitte versuchen Sie es erneut.', 'Speicherfehler');
    }
  }

  cancel() {
    this.router.navigate(['/employees']);
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.bearer}`);
  }
}
