import { NgModule, ModuleWithProviders } from "@angular/core";
import { LoadingSkeletonComponent } from "./loading-skeleton.component";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  LOADING_CONFIG_TOKEN,
  LOADING_DEFUALT_CONFIG,
  ILoadingConfig,
} from "./loading-skeleton.config";
import { LoadingPlaceholderComponent } from "./loading-placeholder/loading-placeholder.component";
import { LoadingButtonComponent } from "./template-components/loading-button/loading-button.component";
import { LoadingHeadlineComponent } from "./template-components/loading-headline/loading-headline.component";
import { LoadingListComponent } from "./template-components/loading-list/loading-list.component";
import { LoadingTextComponent } from "./template-components/loading-text/loading-text.component";
import { LoadingBulletComponent } from "./template-components/loading-bullet/loading-bullet.component";
import { LoadingSkeletonListComponent } from "./loading-skeleton-list/loading-skeleton-list.component";

@NgModule({
  declarations: [
    LoadingSkeletonListComponent,
    LoadingSkeletonComponent,
    LoadingPlaceholderComponent,
    LoadingBulletComponent,
    LoadingButtonComponent,
    LoadingHeadlineComponent,
    LoadingListComponent,
    LoadingTextComponent,
  ],
  imports: [BrowserAnimationsModule, CommonModule],
  exports: [
    LoadingSkeletonListComponent,
    LoadingSkeletonComponent,
    LoadingPlaceholderComponent,
    LoadingBulletComponent,
    LoadingButtonComponent,
    LoadingHeadlineComponent,
    LoadingListComponent,
    LoadingTextComponent,
  ],
  providers: [
    {
      provide: LOADING_CONFIG_TOKEN,
      useValue: LOADING_DEFUALT_CONFIG,
    },
  ],
})
export class NgxLoadingSkeletonModule {
  static forRoot(config: ILoadingConfig): ModuleWithProviders {
    return {
      ngModule: NgxLoadingSkeletonModule,
      providers: [
        {
          provide: LOADING_CONFIG_TOKEN,
          useValue: {
            ...LOADING_DEFUALT_CONFIG,
            ...config,
            theme: {
              light: {
                ...LOADING_DEFUALT_CONFIG.theme.light,
                ...(config?.theme?.light || {}),
              },
              dark: {
                ...LOADING_DEFUALT_CONFIG.theme.dark,
                ...(config?.theme?.dark || {}),
              },
            },
          },
        },
      ],
    };
  }
}
