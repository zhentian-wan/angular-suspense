import {
  NgModule,
  ModuleWithProviders,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { NgxSuspenseComponent } from "./ngx-suspense.component";
import {
  LOADING_CONFIG_TOKEN,
  LOADING_DEFUALT_CONFIG,
  ILoadingConfig,
} from "./ngx-suspense.config";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { NgxSuspenseListComponent } from "./ngx-suspense-list.component";

@NgModule({
  declarations: [NgxSuspenseListComponent, NgxSuspenseComponent],
  imports: [BrowserAnimationsModule, CommonModule],
  providers: [
    {
      provide: LOADING_CONFIG_TOKEN,
      useValue: LOADING_DEFUALT_CONFIG,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [NgxSuspenseComponent, NgxSuspenseListComponent],
})
export class NgxSuspenseModule {
  static forRoot(config: ILoadingConfig): ModuleWithProviders {
    return {
      ngModule: NgxSuspenseModule,
      providers: [
        {
          provide: LOADING_CONFIG_TOKEN,
          useValue: {
            ...LOADING_DEFUALT_CONFIG,
            ...config,
          },
        },
      ],
    };
  }
}
