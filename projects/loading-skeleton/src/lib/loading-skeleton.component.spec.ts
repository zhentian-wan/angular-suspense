import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
} from "@angular/core/testing";

import { LoadingSkeletonComponent } from "./loading-skeleton.component";
import { LoadingSkeletonService } from "./loading-skeleton.service";

import { ViewChild, Component, DebugElement } from "@angular/core";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

const theme = {
  light: { backgroundColor: "grey", fontColor: "black" },
  dark: { backgroundColor: "black", fontColor: "white" },
};

@Component({
  template: `
    <ng-template #loadingTmp><p>loading...</p></ng-template>
    <loading-skeleton [fallback]="loadingTmp"></loading-skeleton>
  `,
})
class WrapperComponent {
  @ViewChild(LoadingSkeletonComponent)
  loadingComponentRef: LoadingSkeletonComponent;
}

let loadingServiceSpy = {
  loading$: of(true),
  theme$: of(theme.light),
  get config() {
    return { showContent: false, theme };
  },
  changeMode() {},
};

describe("LoadingSkeletonComponent", () => {
  let component: LoadingSkeletonComponent;
  let wrapperComponent: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let el: DebugElement;
  let service: LoadingSkeletonService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WrapperComponent, LoadingSkeletonComponent],
      providers: [
        { provide: LoadingSkeletonService, useValue: loadingServiceSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    service = TestBed.inject(LoadingSkeletonService);
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
