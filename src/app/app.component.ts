import { Component } from "@angular/core";
import {
  LoadingSkeletonService,
  ILoadingConfig,
  LOADING_DEFUALT_CONFIG,
} from "projects/loading-skeleton/src/public-api";
import { timer } from "rxjs";
import { mapTo } from "rxjs/operators";
import { loadingServiceProvider } from "./loading.service.provider";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [LoadingSkeletonService],
})
export class AppComponent {
  data$;
  data2$;
  title = "libs-workspaces";
  isDark: boolean = false;
  isVisible;
  theme = {
    light: {
      backgroundColor: "lightblue",
    },
    dark: {
      backgroundColor: "darkblue",
    },
  };
  themeMode = "light";

  l1 = new LoadingSkeletonService(LOADING_DEFUALT_CONFIG);
  l2 = new LoadingSkeletonService(LOADING_DEFUALT_CONFIG);
  constructor(private loadingService: LoadingSkeletonService) {
    console.log(this.l1);
    console.log(this.l2);
    this.data$ = timer(1500).pipe(
      this.l1.showLoadingStatus(),
      mapTo("data coming back 1500")
    );

    this.data2$ = this.l2.showingFor(
      timer(4000).pipe(mapTo("data coming back 4000"))
    );

    this.isVisible = false;
  }

  ngOnInit() {}

  toggleDark() {
    this.isDark = !this.isDark;
    this.loadingService.changeMode(this.isDark);
  }

  cmpToggleMode() {
    this.themeMode = this.themeMode === "light" ? "dark" : "light";
  }
}
