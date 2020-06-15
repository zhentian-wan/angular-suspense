import { Directive, HostListener, Input } from "@angular/core";
import { NgxErrorBoundaryService } from "./ngx-error-boundary.service";

@Directive({
  selector: "[errorDismiss]",
  exportAs: "dismiss",
})
export class NgxErrorDismissDirective {
  @Input() errorDismiss: string;

  @HostListener("click") onClick() {
    this.errorService.dismiss(this.errorDismiss);
  }

  constructor(private errorService: NgxErrorBoundaryService) {}
}
