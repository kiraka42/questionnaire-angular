import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHomepageComponent } from './dashboard-homepage.component';

describe('DashboardHomepageComponent', () => {
  let component: DashboardHomepageComponent;
  let fixture: ComponentFixture<DashboardHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
