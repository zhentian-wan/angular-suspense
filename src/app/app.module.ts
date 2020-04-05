import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { NdwLoadingSkeletonModule } from 'projects/loading-skeleton/src/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    NdwLoadingSkeletonModule
    /*LoadingSkeletonModule.forRoot({
      duration: "2s",
      theme: {
        light: {
          backgroundColor: "pink"
        },
        dark: {
          backgroundColor: "red"
        }
      }
    })*/
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
