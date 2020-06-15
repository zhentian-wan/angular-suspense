import { Injectable, Optional } from "@angular/core";
import {
  Subject,
  BehaviorSubject,
  Observable,
  throwError,
  Subscriber,
} from "rxjs";
import {
  filter,
  retryWhen,
  delay,
  catchError,
  tap,
  scan,
  mapTo,
  takeWhile,
  exhaustMap,
} from "rxjs/operators";

export interface INgxErrorOption {
  message?: string;
  key?: string;
}

@Injectable({
  providedIn: "root",
})
export class NgxErrorBoundaryService {
  private errorStore = {};
  private keyStore = {};
  private errorsSubject = new BehaviorSubject<{ [key: string]: any }>({});
  private keySubject = new BehaviorSubject<{ [key: string]: boolean }>({});

  private retryStatusSubjet = new BehaviorSubject("end");
  retryStatus$ = this.retryStatusSubjet.asObservable();
  private _retryMaxTimes;
  private retryClickSubject = new Subject();
  retryClick$ = this.retryClickSubject.asObservable().pipe(
    tap(() => {
      this.retryStatusSubjet.next("start");
    }),
    mapTo(1),
    scan((prev, curr) => prev + curr, 0)
  );

  errors$: Observable<{
    [key: string]: string;
  }> = this.errorsSubject.asObservable().pipe(filter((message) => !!message));
  keys$: Observable<{
    [key: string]: boolean;
  }> = this.keySubject.asObservable().pipe(filter((key) => !!key));

  constructor() {}

  private showErrors(
    errors: string | string[],
    key: string = "_$ngx_error_boundary_global_error$_"
  ) {
    this.errorStore = Object.assign({}, this.errorStore, { [key]: errors });
    this.keyStore = Object.assign({}, this.keyStore, { [key]: true });
    this.errorsSubject.next(this.errorStore);
    this.keySubject.next(this.keyStore);
  }

  handleExpection(errorOption: INgxErrorOption) {
    const { message, key } = errorOption;
    return (obs$) => {
      return new Observable((subscriber: Subscriber<any>) => {
        const sub = obs$
          .pipe(
            tap(() => console.log("start")),
            catchError((err) => {
              // Catch error every time it emits
              this.retryStatusSubjet.next("end");
              const readableMessage = message || JSON.stringify(err);
              this.showErrors(readableMessage, key);
              return throwError(err);
            }),
            //retry max times
            retryWhen((err) =>
              err.pipe(
                exhaustMap(() => this.retryClick$),
                delay(500),
                takeWhile((val) => val <= this.retryMaxTimes, true)
              )
            ),
            tap((x) => {
              // Success
              this.dismiss(key);
            })
          )
          .subscribe(subscriber);

        return () => {
          sub.unsubscribe();
        };
      });
    };
  }

  dismiss(key?: string) {
    if (!key) {
      // Dismis all
      this.errorStore = {};
      this.keyStore = {};
      this.errorsSubject.next({});
      this.keySubject.next({});
    }
    delete this.errorStore[key];
    delete this.keyStore[key];
    this.errorsSubject.next(this.errorStore);
    this.keySubject.next(this.keyStore);
  }

  doRetry() {
    this.retryClickSubject.next();
  }

  set retryMaxTimes(times) {
    this._retryMaxTimes = times;
  }

  get retryMaxTimes() {
    return this._retryMaxTimes;
  }
}
