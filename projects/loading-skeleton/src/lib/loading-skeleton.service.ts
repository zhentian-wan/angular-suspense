import { Injectable, Inject, Optional } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  of,
  combineLatest,
  timer,
  merge,
  Subject,
  Subscriber,
} from "rxjs";
import {
  concatMap,
  tap,
  finalize,
  mapTo,
  takeUntil,
  skip,
  filter,
  switchMap,
  startWith,
} from "rxjs/operators";
import {
  LOADING_CONFIG_TOKEN,
  ILoadingConfig,
  ITheme,
  ILoadingConfigTheme,
} from "./loading-skeleton.config";

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

  private taskStartSubject = new Subject();
  private taskStart = this.taskStartSubject.asObservable();
  private taskEndSubject = new Subject();
  private taskEnd = this.taskEndSubject.asObservable();

  // according to Facebook UI team research, it would be a better
  // user experience to show spinner a little bit longer than
  // when user has a high internet speed.
  // Avoid flashing screen
  private _flashingLimitTimer = timer(
    this.config.busyMinDurationMs + this.config.busyDelayMs
  );
  private _flashThreshold = timer(this.config.busyDelayMs);
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

  private controller() {
    const busyDelayTimerStart = this.taskStart.pipe(
      switchMap(() => this._flashThreshold)
    );
    const busyDelayTimerEnd = busyDelayTimerStart.pipe(takeUntil(this.taskEnd));
    const emitOnTaskEnd = this.taskEnd.pipe(mapTo(1));
    const emitOnDelayTimerEnd = busyDelayTimerEnd.pipe(mapTo(-1));
    const emitOnMinDurationEnd = this._flashingLimitTimer.pipe(mapTo(-1));

    ////////////// start/////////////////

    const raceBetweenTaskAndDelay = combineLatest([
      emitOnTaskEnd.pipe(startWith(null)),
      emitOnDelayTimerEnd.pipe(startWith(null)),
    ]).pipe(skip(1));
    const taskEndBeforeDelay = raceBetweenTaskAndDelay.pipe(
      filter(([taskEndFirst, timerEndFirst]) => {
        return taskEndFirst === 1 && timerEndFirst === null;
      })
    );
    const shouldNotShowSpinner = taskEndBeforeDelay.pipe(mapTo(false));
    const taskEndAfterTimeout = raceBetweenTaskAndDelay.pipe(
      filter(([taskEndFirst, timerEndFirst]) => {
        return taskEndFirst === null && timerEndFirst === -1;
      })
    );
    const shouldShowSpinner = taskEndAfterTimeout.pipe(mapTo(true));
    const showSpinner = shouldShowSpinner.pipe(
      tap(() => {
        this.show();
      })
    );

    /////////////// end ///////////////

    const raceBetweenTaskAndMinDuration = combineLatest([
      emitOnTaskEnd.pipe(startWith(null)),
      emitOnMinDurationEnd.pipe(startWith(null)),
    ]).pipe(skip(1));
    const hideSpinnerUntilMinDurationEnd = raceBetweenTaskAndMinDuration.pipe(
      filter(([taskEndFirst, timerEndFirst]) => {
        return taskEndFirst === 1 && timerEndFirst === null;
      })
    );
    const hideSpinnerAfterTimerAndTaskEnd = raceBetweenTaskAndMinDuration.pipe(
      filter(([taskEndFirst, timerEndFirst]) => {
        return taskEndFirst === 1 && timerEndFirst === -1;
      })
    );
    const hideSpinner = merge(
      // case 1: should not show spinner at all
      shouldNotShowSpinner,
      // case 2: task end, but wait until min duration timer ends
      combineLatest([hideSpinnerUntilMinDurationEnd, emitOnMinDurationEnd]),
      // case 3: task takes a long time, wait unitl its end
      hideSpinnerAfterTimerAndTaskEnd
    ).pipe(
      tap(() => {
        this.hide();
      })
    );
    return showSpinner.pipe(takeUntil(hideSpinner));
  }

  showLoadingStatus() {
    return (source) => {
      return new Observable((subscriber: Subscriber<any>) => {
        this.controller().subscribe();
        const sub = of(null)
          .pipe(
            tap(() => {
              this.taskStartSubject.next();
            }),
            concatMap(() => source),
            finalize(() => {
              this.taskEndSubject.next();
            })
          )
          .subscribe(subscriber);

        return () => {
          sub.unsubscribe();
        };
      });
    };
  }

  showingFor<T>(obs$: Observable<T>): Observable<T> {
    this.controller().subscribe();
    return of(null).pipe(
      tap(() => {
        this.taskStartSubject.next();
      }),
      concatMap(() => obs$),
      finalize(() => this.taskEndSubject.next())
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
