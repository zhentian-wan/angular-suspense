import { Component, OnInit, Input } from "@angular/core";
import { ITheme } from "../../loading-skeleton.config";

@Component({
  selector: "loading-headline",
  template: `
    <loading-placeholder
      [theme]="theme"
      [mode]="mode"
      class="loading-placeholder__headline"
      [ngClass]="getType()"
    >
      <ng-content></ng-content>
    </loading-placeholder>
  `,
  styleUrls: ["./loading-headline.component.scss"]
})
export class LoadingHeadlineComponent implements OnInit {
  @Input() size: string;

  @Input() theme: ITheme;
  @Input() mode: "light" | "mode";

  constructor() {}

  ngOnInit(): void {}

  getType() {
    const sizes = ["small", "medium", "large", "full"];
    const alias = ["s", "m", "l", "f"];

    if (sizes.indexOf(this.size) === -1 && alias.indexOf(this.size) === -1) {
      return `loading-placeholder__headline`;
    }

    return `loading-placeholder__headline--${this.size}`;
  }
}
