import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailViewComponent } from './employee-detail-view.component';

describe('EmployeeDetailViewComponent', () => {
  let component: EmployeeDetailViewComponent;
  let fixture: ComponentFixture<EmployeeDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDetailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
