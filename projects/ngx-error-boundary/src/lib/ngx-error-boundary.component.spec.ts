import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxErrorBoundaryComponent } from './ngx-error-boundary.component';

describe('NgxErrorBoundaryComponent', () => {
  let component: NgxErrorBoundaryComponent;
  let fixture: ComponentFixture<NgxErrorBoundaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxErrorBoundaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxErrorBoundaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
