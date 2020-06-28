import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgxErrorBoundaryComponent } from "./ngx-error-boundary.component";
import { NgxErrorRetryDirective } from "./ngx-error-retry.directive";
import { NgxErrorDismissDirective } from "./ngx-error-dismiss.directive";
import { CommonModule } from "@angular/common";
import { GLOBAL_KEY } from "./ngx-error-boundary.token";

@NgModule({
  declarations: [
    NgxErrorBoundaryComponent,
    NgxErrorRetryDirective,
    NgxErrorDismissDirective,
  ],
  imports: [CommonModule],
  exports: [
    NgxErrorBoundaryComponent,
    NgxErrorRetryDirective,
    NgxErrorDismissDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: GLOBAL_KEY,
      useValue: "_$ngx_error_boundary_global_error$_",
    },
  ],
})
export class NgxErrorBoundaryModule {}
