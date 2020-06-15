import { TestBed, async } from "@angular/core/testing";
import { NgxErrorRetryDirective } from "./ngx-error-retry.directive";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";
import { NgxErrorBoundaryService } from "./ngx-error-boundary.service";
import { NgxErrorBoundaryModule } from "./ngx-error-boundary.module";

@Component({
  template: `
    <button errorRetry>
      Retry
    </button>
  `,
  providers: [NgxErrorBoundaryService],
})
class TestComponent {}

describe("Error Retry directive", () => {
  let fixture, directive, button, el, component, directiveCtrl;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NgxErrorBoundaryModule],
      providers: [NgxErrorBoundaryService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
    directive = el.query(By.directive(ErrorRetryDirective));
    directiveCtrl = directive.injector.get(
      ErrorRetryDirective
    ) as NgxErrorRetryDirective;
    button = el.query(By.css("button"));
    fixture.detectChanges();
  });

  it("should be defined", () => {
    expect(directive).toBeTruthy();
    expect(directiveCtrl).toBeTruthy();
  });

  it("should have default Input setup", () => {
    expect(directiveCtrl.maxRetry).toEqual(3);
    expect(directiveCtrl.applyStyling).toEqual(true);
  });
});
