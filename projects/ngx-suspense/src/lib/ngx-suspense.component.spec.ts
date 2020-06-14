import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
} from "@angular/core/testing";

import { NgxSuspenseComponent } from "./ngx-suspense.component";
import { NgxSuspenseService } from "./ngx-suspense.service";

import { ViewChild, Component, DebugElement } from "@angular/core";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

@Component({
  template: `
    <ng-template #loadingTmp><p>loading...</p></ng-template>
    <Suspense [fallback]="loadingTmp"></Suspense>
  `,
})
class WrapperComponent {
  @ViewChild(NgxSuspenseComponent)
  loadingComponentRef: NgxSuspenseComponent;
}

let loadingServiceSpy = {
  loading$: of(true),
  get config() {
    return {};
  },
};

describe("NgxSuspenseComponent", () => {
  let component: NgxSuspenseComponent;
  let wrapperComponent: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let el: DebugElement;
  let service: NgxSuspenseService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WrapperComponent, NgxSuspenseComponent],
      providers: [{ provide: NgxSuspenseService, useValue: loadingServiceSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    service = TestBed.inject(NgxSuspenseService);
    wrapperComponent = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    component = wrapperComponent.loadingComponentRef;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(wrapperComponent).toBeDefined();
    expect(component).toBeDefined();
  });

  it("should use has p tag with text loading...", fakeAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const p = el.queryAll(By.css("p"));
      expect(p.length).toBe(1);
      expect(p[0].nativeElement.textContent).toBe("loading...");
    });
  }));
});
