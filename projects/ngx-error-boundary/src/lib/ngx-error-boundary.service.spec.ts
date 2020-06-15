import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { timer, throwError, of } from "rxjs";
import { mapTo, switchMap, map, exhaustMap } from "rxjs/operators";
import { NgxErrorBoundaryService } from "./ngx-error-boundary.service";

describe("NgxErrorBoundaryService", () => {
  let service: NgxErrorBoundaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxErrorBoundaryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("handleExpection: should return the orginal observable if no error", fakeAsync(() => {
    let result;
    const mockData = "this is mocked data";
    const obs = timer(100).pipe(mapTo(mockData));
    const newObs = service.handleExpection(obs, "error message", "someKey");
    newObs.subscribe((data) => (result = data));
    expect(result).toBeUndefined();
    tick(100);
    expect(result).toBe(mockData);
  }));

  it("handleExpection: should handle error when it happens and use readable message", fakeAsync(() => {
    let result, errors, keys;
    let k = "someKey";
    let e = "error message";
    const obs = timer(100).pipe(switchMap(() => throwError("ERROR")));
    const newObs = service.handleExpection(obs, e, k);
    newObs.subscribe((data) => (result = data));
    service.errors$.subscribe((err) => {
      errors = err;
    });
    service.keys$.subscribe((key) => {
      keys = key;
    });
    tick(100);
    expect(result).toBeUndefined();
    expect(errors).toEqual({ [k]: e });
    expect(keys).toEqual({ [k]: true });
  }));

  it("handleExpection: should handle error when it happens and use default messages", fakeAsync(() => {
    let result, errors, keys;
    const obs = timer(100).pipe(switchMap(() => throwError("ERROR")));
    const newObs = service.handleExpection(obs);
    newObs.subscribe((data) => (result = data));
    service.errors$.subscribe((err) => {
      errors = err;
    });
    service.keys$.subscribe((key) => {
      keys = key;
    });
    tick(100);
    expect(result).toBeUndefined();
    expect(errors).toEqual({
      _$ngx_error_boundary_global_error$_: JSON.stringify("ERROR"),
    });
    expect(keys).toEqual({ _$ngx_error_boundary_global_error$_: true });
  }));

  it("handleExpection: should able to retry N times when click$ observable triggered to get sucessful data", fakeAsync(() => {
    let result, errors;
    service.retryMaxTimes = 3;
    let memo = 0;

    const cleanup = () => {
      result = undefined;
      errors = undefined;
    };

    const obs = timer(100).pipe(
      map(() => {
        memo += 1;
        return memo;
      }),
      exhaustMap((times) => {
        if (times < 3) {
          return throwError("ERROR");
        } else {
          return of("SUCCESS");
        }
      })
    );
    const newObs = service.handleExpection(obs, "readable message", "someKey");
    newObs.subscribe((data) => (result = data));
    service.errors$.subscribe((err) => {
      errors = err;
    });
    tick(100);
    expect(result).toBeUndefined();
    expect(errors).toEqual({ someKey: "readable message" }, "init try fail");
    // retry 1
    service.doRetry();
    tick(600); //contains 500ms delay
    expect(result).toBeUndefined();
    expect(errors).toEqual({ someKey: "readable message" }, "first retry fail");
    cleanup();

    // retry 2
    service.doRetry();
    tick(600);
    expect(result).toBe("SUCCESS", "seoncd retry result faild");
    expect(errors).toBeUndefined();
    cleanup();
  }));

  it("handleExpection: should able to retry 2 times when click$ observable triggered, 3th times get error data when exceed the limits", fakeAsync(() => {
    let result, errors, completed;
    service.retryMaxTimes = 2;
    const cleanup = () => {
      result = undefined;
      errors = undefined;
      completed = undefined;
    };
    const obs = timer(100).pipe(switchMap(() => throwError("ERROR")));
    const newObs = service.handleExpection(obs, "readable message", "someKey");
    newObs.subscribe(
      (data) => (result = data),
      (e) => e,
      () => (completed = true)
    );
    service.errors$.subscribe((err) => {
      errors = err;
    });
    tick(100);
    expect(result).toBeUndefined();
    expect(errors).toEqual({ someKey: "readable message" }, "init try fail");
    // retry 1
    service.doRetry();
    tick(600); //contains 500ms delay
    expect(result).toBeUndefined();
    expect(errors).toEqual({ someKey: "readable message" }, "first retry fail");
    expect(completed).toBeUndefined();
    cleanup();

    // retry 2
    service.doRetry();
    tick(600);
    expect(result).toBeUndefined();
    expect(errors).toEqual(
      { someKey: "readable message" },
      "second retry fail"
    );
    expect(completed).toBeUndefined();
    cleanup();

    // retry 3: retry will not be triggered
    service.doRetry();
    tick(600);
    expect(result).toBeUndefined();
    expect(errors).toBeUndefined();
    expect(completed).toBe(true);
  }));
});
