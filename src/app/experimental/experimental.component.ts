import { Component, OnInit } from "@angular/core";

import { mapTo } from "rxjs/operators";

import { range } from "lodash";
import { timer } from "rxjs";
import {
  NgxSuspenseService,
  LOADING_DEFUALT_CONFIG,
} from "projects/ngx-suspense/src/projects";
@Component({
  selector: "app-experimental",
  templateUrl: "./experimental.component.html",
  styleUrls: ["./experimental.component.scss"],
  providers: [NgxSuspenseService],
})
export class ExperimentalComponent implements OnInit {
  dataList1$;
  dataList2$;
  dataList3$;
  dataList4$;

  l1;
  l2;
  l3;
  l4;
  model = "*";
  constructor() {
    this.l1 = new NgxSuspenseService(LOADING_DEFUALT_CONFIG);
    this.l2 = new NgxSuspenseService(LOADING_DEFUALT_CONFIG);
    this.l3 = new NgxSuspenseService(LOADING_DEFUALT_CONFIG);
    this.l4 = new NgxSuspenseService(LOADING_DEFUALT_CONFIG);
  }

  ngOnInit(): void {
    this.getDataList();
  }

  random(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
  }

  getDataList() {
    const randomTime = () => this.random(500, 4000);
    const randomSize = () => this.random(1, 3);
    this.dataList1$ = this.getAnyListData(
      randomTime(),
      randomSize(),
      this.l1,
      "First"
    );
    this.dataList2$ = this.getAnyListData(
      randomTime(),
      randomSize(),
      this.l2,
      "Seocnd"
    );
    this.dataList3$ = this.getAnyListData(
      randomTime(),
      randomSize(),
      this.l3,
      "Third"
    );
    this.dataList4$ = this.getAnyListData(
      randomTime(),
      randomSize(),
      this.l4,
      "Fourth"
    );
  }

  formatTime(ms) {
    if (ms < 1000) {
      return `${ms}ms`;
    } else {
      const s = (ms / 1000).toFixed(2);
      return `${s}s`;
    }
  }

  getAnyListData(time, count, service, order) {
    const data = range(0, count).map((i) => `${order} list data ${i + 1}`);
    const head = `${order} list, resolve in ${this.formatTime(time)}`;
    return timer(time).pipe(mapTo({ data, head }), service.showLoadingStatus());
  }

  reload(type, listCmpRef) {
    this.model = type;
    this.getDataList();
    listCmpRef.reload(this.model);
  }
}
