import { Component } from '@angular/core';
import { LoadingSkeletonService } from 'projects/loading-skeleton/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [LoadingSkeletonService]
})
export class AppComponent {
  title = 'libs-workspaces';
  isDark: boolean = false;
  isVisible;
  theme = {
    light: {
      backgroundColor: 'lightblue'
    },
    dark: {
      backgroundColor: 'darkblue'
    }
  };
  themeMode = 'light';
  constructor(private loadingService: LoadingSkeletonService) {
    this.loadingService.show();
    this.isVisible = false;
  }

  ngOnInit() {}

  toggleDark() {
    this.isDark = !this.isDark;
    this.loadingService.changeMode(this.isDark);
  }

  cmpToggleMode() {
    this.themeMode = this.themeMode === 'light' ? 'dark' : 'light';
  }
}
