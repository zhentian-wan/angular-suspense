import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { timer, throwError } from "rxjs";
import { mapTo, switchMap } from "rxjs/operators";
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
    const obs = timer(100).pipe(
      mapTo(mockData),
      service.handleExpection({
        message: "error message",
        key: "someKey",
      })
    );
    obs.subscribe((data) => (result = data));
    expect(result).toBeUndefined();
    tick(100);
    expect(result).toBe(mockData);
  }));

  it("handleExpection: should handle error when it happens and use readable message", fakeAsync(() => {
    let result, errors, keys;
    let key = "someKey";
    let message = "error message";
    const obs = timer(100).pipe(
      switchMap(() => throwError("ERROR")),
      service.handleExpection({
        message,
        key,
      })
    );
    obs.subscribe((data) => (result = data));
    service.errors$.subscribe((err) => {
      errors = err;
    });
    service.keys$.subscribe((key) => {
      keys = key;
    });
    tick(100);
    expect(result).toBeUndefined();
    expect(errors).toEqual({ [key]: message });
    expect(keys).toEqual({ [key]: true });
  }));

  it("handleExpection: should handle error when it happens and use default messages", fakeAsync(() => {
    let result, errors, keys;
    const obs = timer(100).pipe(
      switchMap(() => throwError("ERROR")),
      service.handleExpection()
    );
    obs.subscribe((data) => (result = data));
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
});
