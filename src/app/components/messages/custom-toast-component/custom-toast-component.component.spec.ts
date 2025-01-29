import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomToastComponentComponent } from './custom-toast-component.component';

describe('CustomToastComponentComponent', () => {
  let component: CustomToastComponentComponent;
  let fixture: ComponentFixture<CustomToastComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomToastComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomToastComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
