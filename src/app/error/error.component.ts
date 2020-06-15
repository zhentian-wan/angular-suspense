import { Component, OnInit } from "@angular/core";
import { NgxErrorBoundaryService } from "projects/ngx-error-boundary/src/public-api";
import { NgxSuspenseService } from "projects/ngx-suspense/src/projects";
import { timer, throwError, of } from "rxjs";
import { mapTo, mergeMap } from "rxjs/operators";

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
      this.dataList$ = this.errorService.handleExpection(this.getSource());
    } else {
      this.dataList$ = this.errorService.handleExpection(
        this.getError(),
        "Cannot load list",
        "example"
      );
    }
    this.count++;
  }

  outterToggle() {
    this.outter$ = this.errorService.handleExpection(
      this.outterState
        ? of("some content for outter container")
        : throwError("Outter has problem"),
      "Outter has proble!",
      "example2"
    );
    this.outterState = !this.outterState;
  }

  innerToggle() {
    this.inner$ = this.errorService.handleExpection(
      this.innerState
        ? of("some content for inner container")
        : throwError("Inner has problem"),
      "Inner has problem!",
      "example3"
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
