import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import Keycloak from 'keycloak-js';
import {Qualification} from '../../model/Qualification';
import {BehaviorSubject, Observable} from 'rxjs';
import {MainViewComponent} from '../main-view/main-view.component';
import {MatOption, MatFormField, MatSelect} from '@angular/material/select';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-create-employee-view',
  templateUrl: './create-employee-view.component.html',
  imports: [
    MatOption,
    MatSelect,
    MatFormField,
    AsyncPipe,
    NgForOf,
    ReactiveFormsModule,
    MainViewComponent,
    NgIf
  ],
  styleUrls: ['./create-employee-view.component.scss']
})
export class CreateEmployeeViewComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  employeeForm: FormGroup;
  selectedItems: number[] = [];
  qualificationsSubject = new BehaviorSubject<Qualification[]>([]);
  options$: Observable<Qualification[]> = this.qualificationsSubject.asObservable();

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      street: [''],
      postcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      city: [''],
      skillSet: [this.selectedItems],
      newSkill: ['']
    });

    this.fetchData();
  }

  private fetchData() {
    this.http.get<Qualification[]>('http://localhost:8089/qualifications', {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer}`)
    }).subscribe(qualifications => this.qualificationsSubject.next(qualifications));
  }

  async addSkill() {
    const newSkillValue = this.employeeForm.get('newSkill')?.value.trim();
    if (newSkillValue) {
      await this.checkIfQualificationExists(newSkillValue);
    } else {
      this.resetNewSkill();
    }
  }

  private async checkIfQualificationExists(skill: string): Promise<void> {
    const qualifications = this.qualificationsSubject.getValue();
    const existingQualification = qualifications.find(q => q.skill!.toLowerCase() === skill.toLowerCase());

    if (existingQualification) {
      this.addExistingQualificationToEmployee(existingQualification.id!);
    } else {
      await this.addQualificationToEmployee(skill);
    }
  }

  private addExistingQualificationToEmployee(qualificationId: number): void {
    this.selectedItems.push(qualificationId);
    this.updateSkillSet();
    this.resetNewSkill();
  }

  private async addQualificationToEmployee(skill: string): Promise<void> {
    try {
      const newQualification = await this.http
        .post<Qualification>('http://localhost:8089/qualifications', {skill: skill.trim()}, {
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer}`)
        })
        .toPromise();

      if (newQualification?.id) {
        this.qualificationsSubject.next([...this.qualificationsSubject.getValue(), newQualification]);
        this.selectedItems.push(newQualification.id);
        this.updateSkillSet();
      }
    } catch (error) {
      this.handleError('Fehler beim Erstellen der Qualifikation.');
    } finally {
      this.resetNewSkill();
    }
  }

  private updateSkillSet() {
    this.employeeForm.patchValue({skillSet: this.selectedItems});
  }

  private resetNewSkill() {
    this.employeeForm.get('newSkill')?.setValue('');
  }

  onSelectionChange(event: any) {
    this.selectedItems = event.value;
    this.updateSkillSet();
  }

  async onSubmit() {
    if (this.employeeForm.valid) {
      try {
        await this.http
          .post('http://localhost:8089/employees', this.employeeForm.value, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer}`)
          })
          .toPromise();
        alert('Mitarbeiter erfolgreich gespeichert!');
        this.router.navigate(['/employees']);
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.handleError(err.message || 'Unbekannter Fehler aufgetreten');
        } else {
          this.handleError('Unbekannter Fehler aufgetreten');
        }
      }
    } else {
      alert('Bitte alle Felder korrekt ausfüllen.');
    }
  }

  onCancel() {
    this.router.navigate(['/employees']);
  }

  private handleError(message: string) {
    alert(message);
  }
}
