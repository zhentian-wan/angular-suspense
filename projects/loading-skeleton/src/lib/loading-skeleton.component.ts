import { Component, OnInit, TemplateRef, Input } from "@angular/core";
import { Observable } from "rxjs";
import { LoadingSkeletonService } from "./loading-skeleton.service";
import { ILoadingConfigTheme } from "./loading-skeleton.config";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "loading-skeleton",
  templateUrl: "./loading-skeleton.component.html",
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(
          "300ms ease-in",
          style({
            opacity: 1,
          })
        ),
      ]),
    ]),
  ],
})
export class LoadingSkeletonComponent implements OnInit {
  _theme: ILoadingConfigTheme;
  _mode: "light" | "dark" = "light";
  @Input() outlet: TemplateRef<any>;
  @Input() ariaLabel: string = "Loading...";
  @Input() set theme(val: ILoadingConfigTheme) {
    if (val.dark && val.light) {
      this._theme = val;
    }
  }
  @Input() bind: LoadingSkeletonService;
  get theme() {
    return this._theme;
  }
  @Input() set mode(val: "light" | "dark") {
    this._mode = val;
  }
  get mode() {
    return this._mode;
  }
  @Input() isVisible: boolean = false;

  // For debug
  // in browser: ng.getComponent($0).log()
  @Input() log = () =>
    console.dir({
      ...this.loadingService.config,
      mode: this.loadingService.mode,
    });

  loading$: Observable<boolean>;
  service: LoadingSkeletonService;

  constructor(private loadingService: LoadingSkeletonService) {}

  ngOnInit(): void {
    this.service = this.getService();
    this.loading$ = this.service.loading$;
  }

  getService() {
    return this.bind || this.loadingService;
  }

  show() {
    this.service.show();
    this.isVisible = true;
  }

  hide() {
    this.service.hide();
    this.isVisible = false;
  }

  get loadingContext() {
    return {
      $implicit: {
        theme: this.theme,
        mode: this.mode,
      },
    };
  }
}
