import { NgModule, ModuleWithProviders } from '@angular/core';
import { LoadingSkeletonComponent } from './loading-skeleton.component';
import { CommonModule } from '@angular/common';
import {
  LOADING_CONFIG_TOKEN,
  LOADING_DEFUALT_CONFIG,
  ILoadingConfig
} from './loading-skeleton.config';
import { LoadingPlaceholderComponent } from './loading-placeholder/loading-placeholder.component';
import { LoadingButtonComponent } from './template-components/loading-button/loading-button.component';
import { LoadingHeadlineComponent } from './template-components/loading-headline/loading-headline.component';
import { LoadingImageComponent } from './template-components/loading-image/loading-image.component';
import { LoadingListComponent } from './template-components/loading-list/loading-list.component';
import { LoadingTextComponent } from './template-components/loading-text/loading-text.component';
import { LoadingTextareaComponent } from './template-components/loading-textarea/loading-textarea.component';
import { LoadingBulletComponent } from './template-components/loading-bullet/loading-bullet.component';

@NgModule({
  declarations: [
    LoadingSkeletonComponent,
    LoadingPlaceholderComponent,
    LoadingBulletComponent,
    LoadingButtonComponent,
    LoadingHeadlineComponent,
    LoadingImageComponent,
    LoadingListComponent,
    LoadingTextComponent,
    LoadingTextareaComponent
  ],
  imports: [CommonModule],
  exports: [
    LoadingSkeletonComponent,
    LoadingPlaceholderComponent,
    LoadingButtonComponent,
    LoadingHeadlineComponent,
    LoadingImageComponent,
    LoadingListComponent,
    LoadingTextComponent,
    LoadingTextareaComponent
  ],
  providers: [
    {
      provide: LOADING_CONFIG_TOKEN,
      useValue: LOADING_DEFUALT_CONFIG
    }
  ]
})
export class NdwLoadingSkeletonModule {
  static forRoot(config: ILoadingConfig): ModuleWithProviders {
    return {
      ngModule: NdwLoadingSkeletonModule,
      providers: [
        {
          provide: LOADING_CONFIG_TOKEN,
          useValue: {
            ...LOADING_DEFUALT_CONFIG,
            ...config,
            theme: {
              light: {
                ...LOADING_DEFUALT_CONFIG.theme.light,
                ...(config?.theme?.light || {})
              },
              dark: {
                ...LOADING_DEFUALT_CONFIG.theme.dark,
                ...(config?.theme?.dark || {})
              }
            }
          }
        }
      ]
    };
  }
}
