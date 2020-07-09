import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadBandComponent } from './head-band.component';

describe('HeadBandComponent', () => {
  let component: HeadBandComponent;
  let fixture: ComponentFixture<HeadBandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadBandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
