import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationViewComponent } from './qualification-view.component';

describe('QualificationViewComponent', () => {
  let component: QualificationViewComponent;
  let fixture: ComponentFixture<QualificationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualificationViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
