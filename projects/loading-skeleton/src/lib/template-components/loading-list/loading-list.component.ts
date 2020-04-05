import { Component, OnInit, Input } from "@angular/core";
import { ITheme } from "../../loading-skeleton.config";

@Component({
  selector: "loading-list",
  templateUrl: "./loading-list.component.html",
  styleUrls: ["./loading-list.component.scss"]
})
export class LoadingListComponent implements OnInit {
  @Input() count: number = 3;
  @Input() size: number;
  @Input() bullet: boolean = true;

  @Input() theme: ITheme;
  @Input() mode: "light" | "dark";

  constructor() {}

  ngOnInit(): void {}

  repeat(num: number) {
    return [...new Array(Number(num))].fill(0);
  }
}
