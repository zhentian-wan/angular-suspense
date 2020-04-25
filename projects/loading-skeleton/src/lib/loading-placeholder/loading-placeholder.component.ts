import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from "@angular/core";
import { LoadingSkeletonService } from "../loading-skeleton.service";
import { ITheme } from "../loading-skeleton.config";
import { combineLatest } from "rxjs";

@Component({
  selector: "loading-placeholder",
  templateUrl: "./loading-placeholder.component.html",
  styleUrls: ["./loading-placeholder.component.scss"],
})
export class LoadingPlaceholderComponent implements OnInit, AfterViewInit {
  @Input() type: string;
  @Input() size: string;
  @Input() theme: ITheme;
  @Input() mode: "light" | "dark";

  extraClass: string;
  backgroundColor: string;
  fontColor: string;
  constructor(
    private render: Renderer2,
    private el: ElementRef,
    public loadingService: LoadingSkeletonService
  ) {}

  ngOnInit(): void {
    this.extraClass = this.getType();
    //TODO: combine theme$ and mode$

    this.loadingService.theme$.subscribe(({ backgroundColor, fontColor }) => {
      this.backgroundColor =
        this.theme && this.hasProp(this.theme[this.mode], "backgroundColor")
          ? `${this.theme[this.mode].backgroundColor}`
          : `${backgroundColor}`;
      this.fontColor =
        this.theme && this.hasProp(this.theme[this.mode], "fontColor")
          ? `${this.theme[this.mode].fontColor}`
          : `${fontColor}`;
    });
  }

  ngOnChanges(changes) {
    if (changes.mode) {
      this.backgroundColor =
        this.theme &&
        this.hasProp(this.theme[changes.mode.currentValue], "backgroundColor")
          ? `${this.theme[changes.mode.currentValue].backgroundColor}`
          : null;
      this.fontColor =
        this.theme &&
        this.hasProp(this.theme[changes.mode.currentValue], "fontColor")
          ? `${this.theme[changes.mode.currentValue].fontColor}`
          : null;
    }
  }

  ngAfterViewInit() {
    this.render.setAttribute(
      this.el.nativeElement,
      "style",
      `--duration:${this.loadingService.duration}`
    );
  }

  hasProp(obj, prop) {
    return !!obj && !!obj[prop];
  }

  getType() {
    const whiteList = ["image", "headline", "text"];
    const sizes = ["small", "medium", "large", "full"];
    const alias = ["s", "m", "l", "f"];
    let res = "";

    if (whiteList.indexOf(this.type) === -1) {
      return res;
    }

    if (sizes.indexOf(this.size) === -1 && alias.indexOf(this.size) === -1) {
      return `loading-placeholder__${this.type}`;
    }

    return `loading-placeholder__${this.type}--${this.size}`;
  }
}
