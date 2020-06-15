import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { NgxErrorBoundaryService } from "./ngx-error-boundary.service";
import { Observable, combineLatest, Subscription } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "ErrorBoundary",
  templateUrl: "./ngx-error-boundary.component.html",
  styleUrls: ["./ngx-error-boundary.component.scss"],
})
export class NgxErrorBoundaryComponent implements OnInit, OnDestroy {
  @Input() fallback: TemplateRef<any>;
  @Input() key: string = "_$ngx_error_boundary_global_error$_";

  private sub: Subscription;
  current: number = 0;
  errors$: Observable<{ [key: string]: string }>;
  isLoading: boolean;
  isRetrying$: Observable<boolean>;
  constructor(private errorService: NgxErrorBoundaryService) {}

  ngOnInit(): void {
    this.errors$ = combineLatest([
      this.errorService.errors$,
      this.errorService.keys$,
    ]).pipe(map(([errors, keys]) => this.zip(errors, keys)));

    this.isRetrying$ = this.errorService.retryStatus$.pipe(
      map((status) => {
        if (status === "end") {
          this.isLoading = false;
          return false;
        } else {
          this.isLoading = true;
          return true;
        }
      })
    );

    this.sub = this.errorService.retryClick$.subscribe(
      (val) => (this.current = val)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  zip(errors, keys) {
    return Object.keys(keys).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: errors[curr],
      };
    }, {});
  }

  getContext(error, key) {
    const max = this.errorService.retryMaxTimes || 3;

    return {
      $implicit: {
        message: error,
        key,
      },
      retry: {
        max,
        current: this.current,
        isLoading: this.isLoading,
      },
    };
  }
}
