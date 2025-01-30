import { Component, OnInit, inject } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import Keycloak from 'keycloak-js';
import { firstValueFrom } from 'rxjs';
import { MainViewComponent } from "../main-view/main-view.component";
import {CommonModule} from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      street: [''],
      postcode: [''],
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

  private get headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.bearer}`);
  }

  private async loadEmployeeData(id: string): Promise<void> {
    try {
      const employee = await firstValueFrom(this.http
        .get<any>(`http://localhost:8089/employees/${id}`, { headers: this.headers })
      );
      this.employeeForm.patchValue(employee);
    } catch (error) {
      console.error('Fehler beim Laden der Mitarbeiterdaten:', error);
    }
  }

  private async loadQualifications(id: string): Promise<void> {
    try {
      const response = await firstValueFrom(this.http
        .get<{ skillSet: { id: number; skill: string }[] }>(`http://localhost:8089/employees/${id}/qualifications`, { headers: this.headers })
      );

      const skillsArray = this.fb.array(
        response.skillSet.map(skill => this.fb.group({ id: skill.id, skill: skill.skill }))
      );
      this.employeeForm.setControl('qualifications', skillsArray);
    } catch (error) {
      console.error('Fehler beim Laden der Qualifikationen:', error);
    }
  }

  get qualifications() {
    return this.employeeForm.get('qualifications') as FormArray;
  }

  addSkill() {
    const newSkillValue = this.employeeForm.get('newSkill')?.value.trim();
    if (!newSkillValue) {
      alert('Der Name der Qualifikation darf nicht leer sein.');
      return;
    }
    this.checkIfQualificationExists(newSkillValue);
  }

  private async checkIfQualificationExists(skill: string): Promise<void> {
    try {
      const qualifications = await firstValueFrom(this.http
        .get<any[]>(`http://localhost:8089/qualifications`, { headers: this.headers })
      );

      const existingQualification = qualifications.find(q => q.skill.toLowerCase() === skill.toLowerCase());

      if (existingQualification) {
        await this.addExistingQualificationToEmployee(existingQualification.id, existingQualification.skill);
      } else {
        await this.addQualificationToEmployee(skill);
      }
    } catch (error) {
      alert('Fehler beim Abrufen der Qualifikationen. Bitte versuchen Sie es später erneut.');
    } finally {
      this.employeeForm.get('newSkill')?.setValue('');
    }
  }

  private async addExistingQualificationToEmployee(qualificationId: number, skill: string): Promise<void> {
    try {
      const qualificationToAdd = { id: qualificationId, skill };
      await firstValueFrom(this.http
        .post<any>(`http://localhost:8089/employees/${this.employeeId}/qualifications`, qualificationToAdd, { headers: this.headers })
      );

      const newSkillFormGroup = this.fb.group({ id: qualificationId, skill });
      this.qualifications.push(newSkillFormGroup);
    } catch (error) {
      alert('Fehler beim Hinzufügen der Qualifikation. Der Mitarbeiter besitzt bereits diese Qualifikation.');
    } finally {
      this.employeeForm.get('newSkill')?.setValue('');
    }
  }

  private async addQualificationToEmployee(skill: string): Promise<void> {
    if (this.qualifications.controls.some(control => control.value.skill === skill)) {
      alert('Diese Qualifikation ist bereits vorhanden.');
      return;
    }

    try {
      const response = await firstValueFrom(this.http
        .post<any>(`http://localhost:8089/qualifications`, { skill: skill.trim() }, { headers: this.headers })
      );

      const qualificationToAdd = { id: response.id, skill: response.skill };

      await firstValueFrom(this.http
        .post<any>(`http://localhost:8089/employees/${this.employeeId}/qualifications`, qualificationToAdd, { headers: this.headers })
      );

      const newSkillFormGroup = this.fb.group({ id: response.id, skill });
      this.qualifications.push(newSkillFormGroup);
    } catch (error) {
      alert('Fehler beim Erstellen der Qualifikation. Der Mitarbeiter hat bereits die Qualifikation.');
    } finally {
      this.employeeForm.get('newSkill')?.setValue('');
    }
  }

  async deleteQualification(skill: string): Promise<void> {
    const skillControl = this.qualifications.controls.find(control => control.value.skill === skill);
    if (!skillControl) return;

    try {
      await firstValueFrom(this.http
        .delete(`http://localhost:8089/employees/${this.employeeId}/qualifications/${skillControl.value.id}`, { headers: this.headers })
      );

      const skillIndex = this.qualifications.controls.findIndex(control => control.value.skill === skill);
      if (skillIndex !== -1) {
        this.qualifications.removeAt(skillIndex);
      }
    } catch (error) {
      console.error('Fehler beim Löschen der Qualifikation:', error);
    }
  }

  async save(): Promise<void> {
    const skillSet = this.qualifications.controls.map(control => control.value.id);
    const updatedEmployee = { ...this.employeeForm.value, skillSet };

    try {
      await firstValueFrom(this.http
        .put<any>(`http://localhost:8089/employees/${this.employeeId}`, updatedEmployee, { headers: this.headers })
      );
      this.router.navigate(['/employees']);
    } catch (error) {
      console.error('Fehler beim Speichern des Mitarbeiters:', error);
    }
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
