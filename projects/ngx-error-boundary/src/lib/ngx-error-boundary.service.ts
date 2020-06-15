import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject, Observable, throwError } from "rxjs";
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

  showErrors(
    errors: string | string[],
    key: string = "_$ngx_error_boundary_global_error$_"
  ) {
    this.errorStore = Object.assign({}, this.errorStore, { [key]: errors });
    this.keyStore = Object.assign({}, this.keyStore, { [key]: true });
    this.errorsSubject.next(this.errorStore);
    this.keySubject.next(this.keyStore);
  }

  handleExpection<T>(
    obs$: Observable<T>,
    readableMessage?: string,
    key?: string
  ): Observable<T> {
    return obs$.pipe(
      catchError((err) => {
        // Catch error every time it emits
        this.retryStatusSubjet.next("end");
        const message = readableMessage || JSON.stringify(err);
        this.showErrors(message, key);
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
    );
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
