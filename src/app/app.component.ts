import { Component } from "@angular/core";
import { LoadingSkeletonService } from "projects/loading-skeleton/src/public-api";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [LoadingSkeletonService],
})
export class AppComponent {
  title;
  constructor() {}

  ngOnInit() {
    import("../../projects/loading-skeleton/package.json").then((pg) => {
      this.title = `${pg.name} v${pg.version}`;
    });
  }
}
