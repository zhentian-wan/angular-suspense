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
    timer(3500)
      .pipe(mapTo("data coming back"), this.loadingService.showLoadingStatus())
      .subscribe();

    /*this.loadingService
      .showingFor(timer(3500).pipe(mapTo("data coming back")))
      .subscribe();*/
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
