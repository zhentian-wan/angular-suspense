import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush
} from "@angular/core/testing";

import { LoadingPlaceholderComponent } from "./loading-placeholder.component";
import { LoadingSkeletonService } from "../loading-skeleton.service";
import { of } from "rxjs";
import {
  DebugElement,
  Component,
  ChangeDetectionStrategy
} from "@angular/core";
import { By } from "@angular/platform-browser";
import { ILoadingConfigTheme, ITheme } from "../loading-skeleton.config";

const theme: ILoadingConfigTheme = {
  light: { backgroundColor: "rgb(129, 129, 129)", fontColor: "rgb(0, 0, 0)" },
  dark: { backgroundColor: "rgb(0, 0, 0)", fontColor: "rgb(129, 129, 129)" }
};

describe("LoadingPlaceholderComponent", () => {
  let component: LoadingPlaceholderComponent;
  let fixture: ComponentFixture<LoadingPlaceholderComponent>;
  let el: DebugElement;
  let loadingService: LoadingSkeletonService;
  let loadingServiceSpy = {
    loading$: of(true),
    theme$: of(theme.light),
    get config() {
      return {
        showContent: false,
        theme: theme.light,
        duration: "0.9s"
      };
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingPlaceholderComponent],
      providers: [
        { provide: LoadingSkeletonService, useValue: loadingServiceSpy }
      ]
    })
      .overrideComponent(LoadingPlaceholderComponent, {
        set: new Component({
          templateUrl: "./loading-placeholder.component.html",
          changeDetection: ChangeDetectionStrategy.Default
        })
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingPlaceholderComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    loadingService = TestBed.inject(LoadingSkeletonService);
    fixture.detectChanges();
  });

  describe("bindings", () => {
    it("should create", () => {
      expect(component).toBeDefined();
    });

    it("should compose getType() function based on Input: type", () => {
      const type = "text";
      component.type = type;
      fixture.detectChanges();
      const expected = `loading-placeholder__${type}`;
      expect(component.getType()).toBe(
        expected,
        "faild to compose text placeholder"
      );

      const wrongType = "unknown";
      component.type = wrongType;
      fixture.detectChanges();
      const expected2 = ``;
      expect(component.getType()).toBe(
        expected2,
        "faild to return empty class"
      );
    });

    it("should compose getType() function based on Input: size & type", () => {
      const sizes = ["s", "m", "l", "f", "small", "medium", "large", "full"];
      sizes.forEach(size => {
        component.size = size;
        component.type = "text";
        fixture.detectChanges();
        const expected = `loading-placeholder__text--${size}`;
        expect(component.getType()).toBe(
          expected,
          `faild to compose class based on size: ${size} and type: text`
        );
      });

      const wrongSize = "unknow";
      component.size = wrongSize;
      component.type = "text";
      fixture.detectChanges();
      const expected = `loading-placeholder__text`;
      expect(component.getType()).toBe(
        expected,
        `faild to return class with just type, not size`
      );
    });
  });

  describe("template", () => {
    it("should has correct className", () => {
      component.size = "m";
      component.type = "headline";
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.extraClass).toBe(
        "loading-placeholder__headline--m",
        "extraClass has wrong value"
      );

      expect(
        el.query(By.css(".loading-placeholder")).nativeElement.classList
      ).toContain("loading-placeholder__headline--m", "ngClass doesn't work");
    });

    it("theme should be set correctly: light mode", fakeAsync(() => {
      fixture.detectChanges();
      loadingService.theme$.subscribe((theme: ITheme) => {
        expect(theme.backgroundColor).toBe("rgb(129, 129, 129)");
        expect(theme.fontColor).toBe("rgb(0, 0, 0)");
      });
      flush();
      expect(component.backgroundColor).toBe("rgb(129, 129, 129)");
      expect(component.fontColor).toBe("rgb(0, 0, 0)");
    }));

    it("style should be set correctly: light mode", fakeAsync(() => {
      fixture.detectChanges();
      loadingService.theme$.subscribe((theme: ITheme) => {
        expect(theme.backgroundColor).toBe("rgb(129, 129, 129)");
        expect(theme.fontColor).toBe("rgb(0, 0, 0)");
      });
      flush();
      fixture.whenStable().then(() => {
        expect(
          getComputedStyle(
            el.query(By.css(".loading-placeholder")).nativeElement
          ).backgroundColor
        ).toBe("rgb(129, 129, 129)");

        expect(
          getComputedStyle(
            el.query(By.css(".loading-placeholder")).nativeElement
          ).color
        ).toBe("rgb(0, 0, 0)");
      });
    }));
  });
});
