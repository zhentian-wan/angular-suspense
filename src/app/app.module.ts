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

@NgModule({
  declarations: [
    AppComponent,
    AvailableComponent,
    OptimizeComponent,
    ExperimentalComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot([
      { path: "", component: AvailableComponent },
      { path: "optimize", component: OptimizeComponent },
      { path: "experimental", component: ExperimentalComponent },
    ]),
    NgxLoadingSkeletonModule,
    NgxSuspenseModule.forRoot({
      busyDelayMs: 450,
      busyMinDurationMs: 1300,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
