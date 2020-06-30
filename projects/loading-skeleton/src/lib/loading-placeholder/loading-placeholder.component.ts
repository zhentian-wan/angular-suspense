import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
  OnDestroy,
} from "@angular/core";
import { LoadingSkeletonService } from "../loading-skeleton.service";
import { ITheme } from "../loading-skeleton.config";
import { combineLatest, Subscription } from "rxjs";

@Component({
  selector: "loading-placeholder",
  templateUrl: "./loading-placeholder.component.html",
  styleUrls: ["./loading-placeholder.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class LoadingPlaceholderComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() type: string;
  @Input() size: string;
  @Input() theme: ITheme;
  @Input() mode: "light" | "dark";

  extraClass: string;
  backgroundColor: string;
  fontColor: string;

  private subs: Subscription[] = [];

  constructor(
    private el: ElementRef,
    public loadingService: LoadingSkeletonService
  ) {}

  ngOnInit(): void {
    this.extraClass = this.getType();

    const sub = combineLatest([
      this.loadingService.theme$,
      this.loadingService.mode$,
    ]).subscribe(() => {
      this.updateThemeMode();
    });

    this.subs.push(sub);
  }

  updateThemeMode() {
    const theme = this.theme || this.loadingService.theme;
    const mode = this.mode || this.loadingService.mode;
    this.backgroundColor = `${theme[mode].backgroundColor}`;
    this.fontColor = `${theme[mode].fontColor}`;
  }

  ngOnChanges(changes) {
    if (changes.mode) {
      this.updateThemeMode();
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit() {
    this.el.nativeElement.style.setProperty(
      "--duration",
      this.loadingService.duration
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
