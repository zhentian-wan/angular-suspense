import { Component, OnInit, TemplateRef, Input } from "@angular/core";
import { Observable } from "rxjs";
import { LoadingSkeletonService } from "./loading-skeleton.service";
import { startWith, delay } from "rxjs/operators";
import { ITheme, ILoadingConfigTheme } from "./loading-skeleton.config";

@Component({
  selector: "loading-skeleton",
  templateUrl: "./loading-skeleton.component.html",
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
      }
    `,
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

  constructor(private loadingService: LoadingSkeletonService) {}

  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$.pipe(
      startWith(false),
      delay(0)
    );
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
