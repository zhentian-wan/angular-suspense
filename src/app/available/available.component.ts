import { Component, OnInit } from "@angular/core";
import { LoadingSkeletonService } from "projects/loading-skeleton/src/public-api";

@Component({
  selector: "app-available",
  templateUrl: "./available.component.html",
  styleUrls: ["./available.component.scss"],
  providers: [LoadingSkeletonService],
})
export class AvailableComponent implements OnInit {
  isDark: boolean = false;
  theme = {
    light: {
      backgroundColor: "lightblue",
    },
    dark: {
      backgroundColor: "darkblue",
    },
  };
  themeMode = "light";
  constructor(private loadingService: LoadingSkeletonService) {}

  ngOnInit(): void {}

  toggleDark() {
    this.isDark = !this.isDark;
    this.loadingService.changeMode(this.isDark);
  }

  cmpToggleMode() {
    this.themeMode = this.themeMode === "light" ? "dark" : "light";
  }
}
