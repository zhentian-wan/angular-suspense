import { Component, Input } from "@angular/core";
import { ITheme } from "../../loading-skeleton.config";

@Component({
  selector: "loading-bullet",
  template: `
    <loading-placeholder
      [theme]="theme"
      [mode]="mode"
      class="loading-placeholder__bullet"
    ></loading-placeholder>
  `,
  styleUrls: ["./loading-bullet.component.scss"]
})
export class LoadingBulletComponent {
  @Input() theme: ITheme;
  @Input() mode: "light" | "dark";
}
