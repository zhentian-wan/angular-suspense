import {
  Component,
  Input,
  AfterContentInit,
  ContentChildren,
  QueryList,
  SimpleChanges,
  OnDestroy,
} from "@angular/core";
import { NgxSuspenseComponent } from "./ngx-suspense.component";
import {
  combineLatest,
  Subscription,
  Subject,
  BehaviorSubject,
  Observable,
} from "rxjs";
import { filter, skip, pairwise, tap, startWith } from "rxjs/operators";

type ORDERS = "*" | "together" | "forwards" | "backwards";

@Component({
  selector: "SuspenseList",
  templateUrl: "./ngx-suspense-list.component.html",
  exportAs: "list",
})
export class NgxSuspenseListComponent implements AfterContentInit, OnDestroy {
  @Input() revealOrder: ORDERS = "*";
  @ContentChildren(NgxSuspenseComponent) skeletons: QueryList<
    NgxSuspenseComponent
  >;
  @ContentChildren(NgxSuspenseListComponent) list: QueryList<
    NgxSuspenseListComponent
  >;
  loading$: Observable<boolean>;
  subs: Array<Subscription> = [];
  allBroadcasters = [];
  allListeners = [];

  private hasParentControlSubject = new BehaviorSubject(undefined);
  private parentControl$ = this.hasParentControlSubject.asObservable();

  ngOnInit() {
    this.parentControl$
      .pipe(
        tap((val) => {
          console.log("release", val);
        })
      )
      .subscribe();
  }

  ngAfterContentInit() {
    this.allBroadcasters = this.skeletons.map((s) => s.loading$);
    this.allListeners = this.skeletons.map((s) => this.hideSkeletonListener(s));
    this.revealOrderOperator(this.revealOrder);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.revealOrder) {
      this.revealOrderOperator(changes.revealOrder.currentValue);
    }
  }

  ngOnDestroy() {
    if (this.subs.length) {
      this.subs.forEach((sub) => sub.unsubscribe());
      this.subs.length = 0;
    }
  }

  reload(order) {
    this.revealOrderOperator(order || this.revealOrder);
  }

  show() {}

  hide() {}

  private revealOrderOperator(order: ORDERS) {
    if (this.allBroadcasters.length === 0 || this.allListeners.length === 0) {
      return;
    }

    if (this.subs.length) {
      this.subs.forEach((sub) => sub.unsubscribe());
      this.subs.length = 0;
    }
    switch (order) {
      case "together": {
        const sub = this.togetherOperator(this.allBroadcasters)(
          this.allListeners
        );
        this.subs.push(sub);
        break;
      }
      case "forwards": {
        const subs = this.domOrderOperator(this.allBroadcasters)(
          this.allListeners
        );
        this.subs = subs;
        break;
      }
      case "backwards": {
        const broadcasters = [...this.allBroadcasters].reverse();
        const listeners = [...this.allListeners].reverse();
        const subs = this.domOrderOperator(broadcasters)(listeners);
        this.subs = subs;
        break;
      }
      default:

      // nothing should happen
    }
  }

  private hideSkeletonListener(
    skeleton: NgxSuspenseComponent | NgxSuspenseListComponent
  ) {
    return () => {
      skeleton.hide();
    };
  }

  private showSkeletonListener(
    skeleton: NgxSuspenseComponent | NgxSuspenseListComponent
  ) {
    return () => {
      skeleton.show();
    };
  }

  private togetherOperator(broadcasters) {
    this.skeletons.forEach((s) => this.showSkeletonListener(s)());
    return (listeners) => {
      return combineLatest([...broadcasters])
        .pipe(
          // skip default
          skip(1),
          // keep tracking previous value
          pairwise(),
          filter(([ary1, ary2]) => {
            // any loading state is ture
            const cond1 = ary1.some((b) => b);
            // all loading state is false
            const cond2 = !ary2.some((b) => b);
            // pass only when prev loading state is ture, current is false
            return cond1 && cond2;
          })
        )
        .subscribe(() => {
          listeners.forEach((hide: any) => hide());
        });
    };
  }

  private domOrderOperator(broadcasters) {
    this.skeletons.forEach((s) => this.showSkeletonListener(s)());
    return (listeners) => {
      let subs = [];
      let checks = [...new Array(broadcasters.length)].fill(null);
      broadcasters.forEach((boradcaster, index) => {
        subs.push(
          boradcaster
            .pipe(
              // skip default
              skip(1),
              // keep tracking previous value
              pairwise(),
              filter(([b1, b2]) => {
                // pass only when prev loading state is ture, current is false
                return b1 && !b2;
              })
            )
            .subscribe(() => {
              checks[index] = true;
              const indexesToFlush = this.getFlushIndexes(checks);
              for (let i of indexesToFlush) {
                listeners[i]();
              }
            })
        );
      });
      return subs;
    };
  }

  private getFlushIndexes(checks) {
    const indexesToFlush = [];
    for (let i = 0; i < checks.length; i++) {
      if (indexesToFlush.indexOf(i) > -1) {
        continue;
      }
      const check = checks[i];
      if (check !== null) {
        indexesToFlush.push(i);
      } else {
        break;
      }
    }

    return indexesToFlush;
  }
}
