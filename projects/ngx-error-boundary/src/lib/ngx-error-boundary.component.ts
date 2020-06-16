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
})
export class NgxErrorBoundaryComponent implements OnInit, OnDestroy {
  @Input() fallback: TemplateRef<any>;
  @Input() key: string = "_$ngx_error_boundary_global_error$_";

  private sub: Subscription;
  errors$: Observable<{ [key: string]: string }>;
  isRetrying$: Observable<boolean>;
  constructor(private errorService: NgxErrorBoundaryService) {}

  ngOnInit(): void {
    this.errors$ = combineLatest([
      this.errorService.errors$,
      this.errorService.keys$,
    ]).pipe(map(([errors, keys]) => this.zip(errors, keys)));

    this.isRetrying$ = this.errorService.retryStatus$.pipe(
      map((status) => {
        return status !== "end";
      })
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
    return {
      $implicit: {
        message: error,
        key,
      },
      retry$: this.isRetrying$,
    };
  }
}
