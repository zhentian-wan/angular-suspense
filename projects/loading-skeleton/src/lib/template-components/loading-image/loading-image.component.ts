import { Component, Input } from "@angular/core";
import { ITheme } from "../../loading-skeleton.config";

@Component({
  selector: "loading-image",
  template: `
    <loading-placeholder
      [theme]="theme"
      [mode]="mode"
      class="loading-placeholder__image"
    >
      <ng-content></ng-content>
    </loading-placeholder>
  `,
  styleUrls: ["./loading-image.component.scss"]
})
export class LoadingImageComponent {
  @Input() theme: ITheme;
  @Input() mode: "light" | "dark";
}
