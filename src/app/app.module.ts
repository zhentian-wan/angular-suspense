import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { NgxLoadingSkeletonModule } from "projects/loading-skeleton/src/public-api";
import { AvailableComponent } from "./available/available.component";
import { OptimizeComponent } from "./optimize/optimize.component";
import { ExperimentalComponent } from "./experimental/experimental.component";
import { NgxSuspenseModule } from "projects/ngx-suspense/src/projects";
import { ErrorComponent } from "./error/error.component";
import { NgxErrorBoundaryModule } from "projects/ngx-error-boundary/src/public-api";

@NgModule({
  declarations: [
    AppComponent,
    AvailableComponent,
    OptimizeComponent,
    ExperimentalComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot([
      { path: "", component: AvailableComponent },
      { path: "optimize", component: OptimizeComponent },
      { path: "errorboundary", component: ErrorComponent },
      { path: "experimental", component: ExperimentalComponent },
    ]),
    NgxLoadingSkeletonModule,
    NgxSuspenseModule,
    NgxErrorBoundaryModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
