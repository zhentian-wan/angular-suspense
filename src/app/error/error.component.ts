import { Component, OnInit } from "@angular/core";
import { NgxErrorBoundaryService } from "projects/ngx-error-boundary/src/public-api";
import { NgxSuspenseService } from "projects/ngx-suspense/src/projects";
import { timer, throwError, of } from "rxjs";
import { mergeMap, switchMap, tap } from "rxjs/operators";

const mockData = [
  {
    id: 0,
    content: "List content 0",
  },
  {
    id: 1,
    content: "List content 1",
  },
  {
    id: 2,
    content: "List content 2",
  },
];

@Component({
  selector: "app-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.scss"],
  providers: [NgxErrorBoundaryService, NgxSuspenseService],
})
export class ErrorComponent implements OnInit {
  dataList$;
  count = 0;
  outer$;
  outerState = true;
  inner$;
  innerState = true;
  retry$;
  constructor(
    private suspense: NgxSuspenseService,
    private errorService: NgxErrorBoundaryService
  ) {}

  ngOnInit(): void {
    this.reload();
    this.innerToggle();
    this.outerToggle();
    this.retry$ = this.retry();
  }

  reload() {
    this.dataList$ = timer(500).pipe(
      switchMap(() => of(this.count++)),
      mergeMap((count) => {
        if (count % 2 === 0) {
          return of(mockData);
        } else {
          return throwError("Oops");
        }
      }),
      this.suspense.showLoadingStatus(),
      this.errorService.handleExpection({
        message: "Cannot load list",
        key: "example",
      })
    );
  }

  outerToggle() {
    const source$ = this.outerState
      ? of("some content for outer container")
      : throwError("Outer has problem");

    this.outer$ = source$.pipe(
      this.errorService.handleExpection({
        message: "Outer has proble!",
        key: "example2",
      })
    );
    this.outerState = !this.outerState;
  }

  innerToggle() {
    const source$ = this.innerState
      ? of("some content for inner container")
      : throwError("Inner has problem");

    this.inner$ = source$.pipe(
      this.errorService.handleExpection({
        message: "Inner has problem!",
        key: "example3",
      })
    );
    this.innerState = !this.innerState;
  }

  retry() {
    return timer(500).pipe(
      switchMap(() => of(this.count++)),
      mergeMap((x) =>
        x % 3 !== 0 || x === 0 ? throwError("Oops!") : of("Good")
      ),
      this.errorService.handleExpection({
        message: "Please retry...",
        key: "example4",
      })
    );
  }

  resetRetry() {
    this.count = 0;
    this.retry$ = this.retry();
  }
}
