import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { NgxLoadingSkeletonModule } from "projects/loading-skeleton/src/public-api";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    //NgxLoadingSkeletonModule,
    NgxLoadingSkeletonModule.forRoot({
      animationSpeed: "2s",
      busyDelayMs: 300,
      busyMinDurationMs: 1000,
      theme: {
        light: {
          backgroundColor: "pink",
        },
        dark: {
          backgroundColor: "red",
        },
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
