import {
  Directive,
  HostListener,
  Input,
  HostBinding,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { NgxErrorBoundaryService } from "./ngx-error-boundary.service";
import { Subscription, combineLatest } from "rxjs";

@Directive({
  selector: "[errorRetry], [applyErrorStyle]",
  exportAs: "retryBtn",
})
export class NgxErrorRetryDirective implements OnInit, OnDestroy {
  sub: Subscription;
  disabled: boolean = false;
  current: number = 0;
  maxRetry: number;
  @Input("errorRetry") set errorRetry(val) {
    if (!Number(val)) {
      this.maxRetry = 3;
    } else {
      this.maxRetry = Number(val);
    }
    this.errorService.retryMaxTimes = this.maxRetry;
  }
  @Input("applyErrorStyle") applyStyling: boolean = true;
  @HostListener("click") onClick() {
    if (this.disabled) {
      return;
    }
    this.errorService.doRetry();
  }
  @HostBinding("disabled") get retryDisabled() {
    if (!this.applyStyling) {
      return false;
    }
    return this.disabled;
  }
  @HostBinding("style.cursor") get cursor() {
    if (!this.applyStyling) {
      return "";
    }
    if (this.current >= this.maxRetry) {
      return "not-allowed";
    }
    return this.disabled ? "wait" : "pointer";
  }

  constructor(private errorService: NgxErrorBoundaryService) {}

  ngOnInit() {
    this.sub = combineLatest([
      this.errorService.retryStatus$,
      this.errorService.retryClick$,
    ]).subscribe(([status, clicks]) => {
      this.current = clicks;
      if (this.current >= this.maxRetry) {
        this.disabled = true;
        return;
      }
      this.disabled = status === "start" ? true : false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
