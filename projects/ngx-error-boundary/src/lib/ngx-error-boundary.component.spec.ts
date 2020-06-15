import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { NgxErrorBoundaryService } from "./ngx-error-boundary.service";
import { of } from "rxjs";

let ErrorBoundaryServiceMock = {
  retryStatus$: of(),
  retryClick$: of(),
  errors$: of(),
  keys$: of(),
};
import { NgxErrorBoundaryComponent } from "./ngx-error-boundary.component";

describe("NgxErrorBoundaryComponent", () => {
  let component: NgxErrorBoundaryComponent;
  let fixture: ComponentFixture<NgxErrorBoundaryComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxErrorBoundaryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: NgxErrorBoundaryService,
          useValue: ErrorBoundaryServiceMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxErrorBoundaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
