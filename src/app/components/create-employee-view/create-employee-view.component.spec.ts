import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeViewComponent } from './create-employee-view.component';

describe('CreateEmployeeViewComponent', () => {
  let component: CreateEmployeeViewComponent;
  let fixture: ComponentFixture<CreateEmployeeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEmployeeViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEmployeeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
