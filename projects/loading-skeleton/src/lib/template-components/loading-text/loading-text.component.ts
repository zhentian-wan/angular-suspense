import { Component, OnInit, Input } from "@angular/core";
import { ITheme } from "../../loading-skeleton.config";

@Component({
  selector: "loading-text",
  template: `
    <loading-placeholder
      [theme]="theme"
      [mode]="mode"
      class="loading-placeholder__text"
      [ngClass]="getType()"
    >
      <ng-content></ng-content>
    </loading-placeholder>
  `,
  styleUrls: ["./loading-text.component.scss"]
})
export class LoadingTextComponent implements OnInit {
  @Input() size: string;
  @Input() theme: ITheme;
  @Input() mode: "light" | "dark";

  constructor() {}

  ngOnInit(): void {}

  getType() {
    const sizes = ["small", "medium", "large", "full"];
    const alias = ["s", "m", "l", "f"];

    if (sizes.indexOf(this.size) === -1 && alias.indexOf(this.size) === -1) {
      return `loading-placeholder__text`;
    }

    return `loading-placeholder__text--${this.size}`;
  }
}
