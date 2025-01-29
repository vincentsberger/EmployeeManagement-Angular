import {Component, inject} from '@angular/core';
import {MainViewComponent} from "../main-view/main-view.component";
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import Keycloak from "keycloak-js";
import {QualificationViewComponent} from "../qualification-view/qualification-view.component";
import {Qualification} from "../../model/Qualification";
import {AsyncPipe, NgForOf} from "@angular/common";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-create-employee-view',
  imports: [
    MainViewComponent,
    RouterLink,
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
    AsyncPipe
  ],
  templateUrl: './create-employee-view.component.html',
  styleUrl: './create-employee-view.component.scss'
})


export class CreateEmployeeViewComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;
  employeeForm: FormGroup;
  options$: Observable<Qualification[]>;

  selectedItems: string[] = [];
  searchQuery: string = '';

  // filterOptions() {
  //   this.filteredOptions = this.options.filter(option =>
  //     option.toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.employeeForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      street: ['', Validators.required],
      postcode: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      skillSet: [0, Validators.required],
    });
    this.options$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.options$ = this.http.get<Qualification[]>('http://localhost:8089/qualifications', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      // Retrieve form data
      const formData = this.employeeForm.value;

      // Send the data to the API
      this.http.post('http://localhost:8089/employees', {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${this.bearer}`),
        }
        , formData)
        .subscribe({
          next: (response) => {
            console.log('Employee data saved successfully!', response);
          },
          error: (err) => {
            console.error('Error saving employee data', err);
          }
        });
    } else {
      console.warn('Form is invalid. Please check the fields.');
    }
  }

  protected readonly QualificationViewComponent = QualificationViewComponent;
  protected readonly Qualification = Qualification;
}
