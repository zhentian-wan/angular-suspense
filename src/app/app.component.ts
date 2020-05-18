import { Component } from "@angular/core";
import { LoadingSkeletonService } from "projects/loading-skeleton/src/public-api";
import { timer } from "rxjs";
import { mapTo } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [LoadingSkeletonService],
})
export class AppComponent {
  data$;
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
  constructor(private loadingService: LoadingSkeletonService) {
    this.data$ = timer(290).pipe(
      this.loadingService.showLoadingStatus(),
      mapTo("data coming back")
    );

    /*
    this.data$ = this.loadingService.showingFor(
      timer(4000).pipe(mapTo("data coming back"))
    );*/

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
