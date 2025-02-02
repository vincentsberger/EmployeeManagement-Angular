import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQualificationFormDrawerComponent } from './add-qualification-form-drawer.component';

describe('AddQualificationFormDrawerComponent', () => {
  let component: AddQualificationFormDrawerComponent;
  let fixture: ComponentFixture<AddQualificationFormDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddQualificationFormDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQualificationFormDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
