import { Directive, HostListener, OnInit } from "@angular/core";
import { NgxErrorBoundaryService } from "./ngx-error-boundary.service";

@Directive({
  selector: "[errorRetry]",
  exportAs: "retry",
})
export class NgxErrorRetryDirective implements OnInit {
  @HostListener("click") onClick() {
    this.errorService.doRetry();
  }

  constructor(private errorService: NgxErrorBoundaryService) {}

  ngOnInit() {}
}
