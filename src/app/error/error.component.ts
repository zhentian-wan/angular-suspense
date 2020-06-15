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
    this.innerSuccess();
    this.outterSuccess();
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
    this.outterState = !this.outterState;
    if (this.outterState) {
      this.outterSuccess();
    } else {
      this.outterFail();
    }
  }

  outterSuccess() {
    this.outter$ = this.errorService.handleExpection(
      of("some content for outter container"),
      "Outter has proble!",
      "example2"
    );
  }

  outterFail() {
    this.outter$ = this.errorService.handleExpection(
      throwError("Outter has problem"),
      "Outter has proble!",
      "example2"
    );
  }

  innerToggle() {
    this.innerState = !this.innerState;
    if (this.innerState) {
      this.innerSuccess();
    } else {
      this.innerFail();
    }
  }

  innerSuccess() {
    this.inner$ = this.errorService.handleExpection(
      of("some content for inner container"),
      "Inner has proble!",
      "example3"
    );
  }

  innerFail() {
    this.inner$ = this.errorService.handleExpection(
      throwError("Inner has problem"),
      "Inner has proble!",
      "example3"
    );
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
