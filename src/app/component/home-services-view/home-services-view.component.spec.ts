import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeServicesViewComponent } from './home-services-view.component';

describe('HomeServicesViewComponent', () => {
  let component: HomeServicesViewComponent;
  let fixture: ComponentFixture<HomeServicesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeServicesViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeServicesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
