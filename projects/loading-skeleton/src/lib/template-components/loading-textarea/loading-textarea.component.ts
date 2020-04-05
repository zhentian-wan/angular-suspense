import { Component, Input } from "@angular/core";
import { ITheme } from "../../loading-skeleton.config";

@Component({
  selector: "loading-textarea",
  templateUrl: "./loading-textarea.component.html",
  styleUrls: ["./loading-textarea.component.scss"]
})
export class LoadingTextareaComponent {
  @Input() theme: ITheme;
  @Input() mode: "light" | "dark";
}
