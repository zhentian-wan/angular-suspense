import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { NgxSuspenseService } from "./ngx-suspense.service";
import { LOADING_CONFIG_TOKEN } from "./ngx-suspense.config";

import { of, timer } from "rxjs";
import { delay, take, mapTo } from "rxjs/operators";

describe("NgxSuspenseService", () => {
  let service: NgxSuspenseService;

  beforeEach(() => {
    const mockConfigToken = {
      busyDelayMs: 0,
      busyMinDurationMs: 0,
    };

    TestBed.configureTestingModule({
      providers: [
        NgxSuspenseService,
        { provide: LOADING_CONFIG_TOKEN, useValue: mockConfigToken },
      ],
    });
    service = TestBed.inject(NgxSuspenseService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("showingFor should emit side effect to control loading", fakeAsync(() => {
    let isLoading;
    service.loading$.subscribe((b) => {
      isLoading = b;
    });
    expect(isLoading).toBe(
      false,
      "res$ not subscribe yet, loading should be false"
    );
    const source$ = of("data").pipe(delay(500), take(1));
    const res$ = service.showingFor(source$);
    res$.subscribe();
    tick(100); // 100ms
    expect(isLoading).toBe(
      true,
      "res$ subscribed after 100ms < 500ms, should show loading"
    );
    tick(200); // 300
    expect(isLoading).toBe(
      true,
      "res$ subscribed after 300ms < 500ms, should show loading"
    );

    tick(200); // 500
    expect(isLoading).toBe(
      false,
      "res$ subscribed after 500ms === 500ms, should NOT show loading"
    );
    tick(100); //600
    expect(isLoading).toBe(
      false,
      "res$ subscribed after 600ms > 500ms, should NOT show loading"
    );
  }));

  it("showingFor should return original observable data", fakeAsync(() => {
    let res;
    const source$ = of("data").pipe(delay(500), take(1));
    const res$ = service.showingFor(source$);
    expect(res).toBe(undefined);
    res$.subscribe((d) => (res = d));
    tick(500);
    expect(res).toBe("data");
  }));

  it("showLoadingStatus should trigger side effect to control spinner show / hide", fakeAsync(() => {
    const source$ = timer(500).pipe(
      mapTo("data"),
      service.showLoadingStatus(),
      take(1)
    );
    const showSpy = spyOn(service, "show");
    const hideSpy = spyOn(service, "hide");
    expect(showSpy).not.toHaveBeenCalled();
    source$.subscribe();
    expect(hideSpy).not.toHaveBeenCalled();
    tick(1);
    expect(showSpy).toHaveBeenCalled();
    tick(501);
    expect(hideSpy).toHaveBeenCalled();
  }));
});
