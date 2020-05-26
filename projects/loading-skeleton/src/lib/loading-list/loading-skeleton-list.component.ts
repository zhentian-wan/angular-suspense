import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input,
} from "@angular/core";
import { LoadingSkeletonComponent } from "../loading-skeleton.component";
import { forkJoin, BehaviorSubject } from "rxjs";
import { tap, skip, pairwise, filter, skipWhile } from "rxjs/operators";

@Component({
  selector: "loading-skeleton-list",
  templateUrl: "./loading-skeleton-list.component.html",
  styleUrls: ["./loading-skeleton-list.component.scss"],
})
export class LoadingSkeletonListComponent implements AfterContentInit {
  @ContentChildren(LoadingSkeletonComponent) skeletons: QueryList<
    LoadingSkeletonComponent
  >;

  @Input() revealOrder: "together" = "together";

  constructor() {}

  ngAfterContentInit() {
    const listener = (s) => (b) => {
      console.log(s, b);
      s.isVisible = false;
    };

    const operator = (casters) => (listeners) => {
      let count = new BehaviorSubject(0);
      let count$ = count.asObservable();
      count$
        .pipe(
          filter((v) => v === 2),
          tap(console.log)
        )
        .subscribe((b) => {
          listeners.forEach((l) => l(b));
        });
      casters.forEach((obs, index) => {
        obs
          .pipe(
            skip(1),
            pairwise(),
            filter(([a, b]) => a && !b)
          )
          .subscribe((b) => {
            let crt = count.getValue();
            count.next(++crt);
          });
      });
    };

    this.skeletons.forEach((s) => {
      s.isVisible = true;
    });
    const bothCasters = this.skeletons.map((skeleton) => skeleton.loading$);
    const bothLisnters = this.skeletons.map((skeleton) => {
      return listener(skeleton);
    });
    operator(bothCasters)(bothLisnters);
  }
}
