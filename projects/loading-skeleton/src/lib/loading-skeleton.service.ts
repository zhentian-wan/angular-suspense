import { Injectable, Inject, Optional } from "@angular/core";
import { BehaviorSubject, Observable, of, combineLatest, timer } from "rxjs";
import { concatMap, tap, finalize, map } from "rxjs/operators";
import {
  LOADING_CONFIG_TOKEN,
  LOADING_DEFUALT_CONFIG,
  ILoadingConfig,
  ITheme,
  ILoadingConfigTheme,
} from "./loading-skeleton.config";
import { ThrowStmt } from "@angular/compiler";

@Injectable()
export class LoadingSkeletonService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private modeSubject = new BehaviorSubject<string>("light");
  private themeSubject = new BehaviorSubject<ITheme>({
    backgroundColor: this.theme[this.mode].backgroundColor,
    fontColor: this.theme[this.mode].fontColor,
  });
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  theme$: Observable<ITheme> = this.themeSubject.asObservable();
  mode$: Observable<string> = this.modeSubject.asObservable();

  // according to Facebook UI team research, it would be a better
  // user experience to show spinner a little bit longer than
  // when user has a high internet speed.
  // Avoid flashing screen
  private _flashingLimitTimer = timer(this.config.busyMinDurationMs);
  constructor(
    @Optional()
    @Inject(LOADING_CONFIG_TOKEN)
    private userConfig: ILoadingConfig
  ) {
    if (this.userConfig.duration) {
      console.warn(
        '[NgxLoadingSkeletonModule.forRoot]: "duration" will be deprecated in the future, please use "animationSpeed" instead'
      );
    }
  }

  get config() {
    return this.userConfig;
  }

  get theme() {
    return this.config.theme;
  }

  get duration() {
    const duartion = this.userConfig.duration;

    if (duartion) {
      return duartion;
    }

    return this.config.animationSpeed;
  }

  get mode() {
    return this.modeSubject.getValue();
  }

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }

  showingFor<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.show()),
      concatMap(() => combineLatest([obs$, this._flashingLimitTimer])),
      map(([data, _]) => data),
      tap(console.log),
      finalize(() => this.hide())
    );
  }

  changeTheme(newTheme: ILoadingConfigTheme): void {
    if (!newTheme) {
      return;
    }
    // TDOO: think about refactoring this code
    // to spreate theme and mode
    this.themeSubject.next(newTheme[this.mode]);
  }

  changeMode(isDark: boolean): void;
  changeMode(mode: "light" | "dark"): void;
  changeMode(mode: boolean | "light" | "dark"): void {
    if (!this.theme) {
      console.warn('You have\'t provide any "theme"');
      return;
    }
    const { dark, light } = this.theme;

    if (typeof mode === "boolean") {
      this.modeSubject.next(mode ? "dark" : "light");
      this.themeSubject.next(mode ? dark : light);
    } else if (typeof mode === "string") {
      this.modeSubject.next(mode);
      this.themeSubject.next(this.theme[mode]);
    }
  }
}
