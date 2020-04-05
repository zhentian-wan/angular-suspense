import { Component, Input } from "@angular/core";
import { ITheme } from "../../loading-skeleton.config";

@Component({
  selector: "loading-button",
  template: `
    <loading-placeholder
      [theme]="theme"
      [mode]="mode"
      class="loading-placeholder__button"
    >
      <ng-content></ng-content>
    </loading-placeholder>
  `,
  styleUrls: ["./loading-button.component.scss"]
})
export class LoadingButtonComponent {
  @Input() theme: ITheme;
  @Input() mode: "light" | "dark";
}
