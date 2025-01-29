import {Component, inject} from '@angular/core';
import {MainViewComponent} from "../main-view/main-view.component";
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import Keycloak from "keycloak-js";

@Component({
  selector: 'app-create-employee-view',
  imports: [
    MainViewComponent,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './create-employee-view.component.html',
  styleUrl: './create-employee-view.component.scss'
})
export class CreateEmployeeViewComponent {
  keycloak = inject(Keycloak);
  bearer = this.keycloak.token;

  employeeForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.employeeForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      street: ['', Validators.required],
      postcode: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      skillSet:["", Validators.required]
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
}
