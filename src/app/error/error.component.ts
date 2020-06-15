import { Component, OnInit } from "@angular/core";
import { NgxErrorBoundaryService } from "projects/ngx-error-boundary/src/public-api";
import { NgxSuspenseService } from "projects/ngx-suspense/src/projects";
import { timer, throwError, of, BehaviorSubject } from "rxjs";
import {
  mapTo,
  mergeMap,
  tap,
  scan,
  startWith,
  switchMap,
} from "rxjs/operators";

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
  outter$;
  outterState = true;
  inner$;
  innerState = true;
  retry$ = this.retry();
  constructor(
    private suspense: NgxSuspenseService,
    private errorService: NgxErrorBoundaryService
  ) {}

  ngOnInit(): void {
    this.reload();
    this.innerToggle();
    this.outterToggle();
  }

  reload() {
    if (this.count % 2 === 0) {
      this.dataList$ = this.getSource().pipe(
        this.errorService.handleExpection({
          message: "Cannot load list",
          key: "example",
        })
      );
    } else {
      this.dataList$ = this.getError().pipe(
        this.errorService.handleExpection({
          message: "Cannot load list",
          key: "example",
        })
      );
    }
    this.count++;
  }

  retry() {
    return timer(500).pipe(
      switchMap(() => of(this.count++)),
      mergeMap((x) =>
        x % 3 !== 0 && x > 0 ? throwError("Oops!") : of("Good")
      ),
      this.errorService.handleExpection({
        message: "Please retry...",
        key: "example4",
      })
    );
  }

  triggerRetryError() {
    this.retry$ = this.retry();
    this.errorService.dismiss("example4");
  }

  outterToggle() {
    const source$ = this.outterState
      ? of("some content for outter container")
      : throwError("Outter has problem");

    this.outter$ = source$.pipe(
      this.errorService.handleExpection({
        message: "Outter has proble!",
        key: "example2",
      })
    );
    this.outterState = !this.outterState;
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

  getSource() {
    return timer(500).pipe(mapTo(mockData), this.suspense.showLoadingStatus());
  }

  getError() {
    return timer(500).pipe(
      mergeMap(() => throwError("Oops")),
      this.suspense.showLoadingStatus()
    );
  }
}
