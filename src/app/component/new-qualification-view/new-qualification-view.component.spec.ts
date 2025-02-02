import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQualificationViewComponent } from './new-qualification-view.component';

describe('NewQualificationViewComponent', () => {
  let component: NewQualificationViewComponent;
  let fixture: ComponentFixture<NewQualificationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewQualificationViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQualificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
