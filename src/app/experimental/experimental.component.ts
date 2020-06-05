import { Component, OnInit } from '@angular/core';

import { mapTo } from 'rxjs/operators';

import { range } from 'lodash';
import { timer } from 'rxjs';
import {
  LoadingSkeletonService,
  LOADING_DEFUALT_CONFIG,
} from 'projects/loading-skeleton/src/public-api';
@Component({
  selector: 'app-experimental',
  templateUrl: './experimental.component.html',
  styleUrls: ['./experimental.component.scss'],
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
  model = '*';
  constructor() {
    this.l1 = new LoadingSkeletonService(LOADING_DEFUALT_CONFIG);
    this.l2 = new LoadingSkeletonService(LOADING_DEFUALT_CONFIG);
    this.l3 = new LoadingSkeletonService(LOADING_DEFUALT_CONFIG);
    this.l4 = new LoadingSkeletonService(LOADING_DEFUALT_CONFIG);
  }

  ngOnInit(): void {
    this.getDataList();
  }

  random(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
  }

  getDataList() {
    const randomTime = () => this.random(500, 4000);
    const randomSize = () => this.random(1, 4);
    this.dataList1$ = this.getAnyListData(
      randomTime(),
      randomSize(),
      this.l1,
      'First'
    );
    this.dataList2$ = this.getAnyListData(
      randomTime(),
      randomSize(),
      this.l2,
      'Seocnd'
    );
    this.dataList3$ = this.getAnyListData(
      randomTime(),
      randomSize(),
      this.l3,
      'Third'
    );
    this.dataList4$ = this.getAnyListData(
      randomTime(),
      randomSize(),
      this.l4,
      'Fourth'
    );
  }

  formatTime(ms) {
    if (ms < 1000) {
      return `${ms}ms`;
    } else {
      const s = (ms / 1000).toFixed(1);
      return `${s}s`;
    }
  }

  getAnyListData(time, count, service, order) {
    const data = range(0, count).map((i) => `data ${i}`);
    const head = `${order} list, reveal in ${this.formatTime(time)}`;
    return timer(time).pipe(mapTo({ data, head }), service.showLoadingStatus());
  }

  together(listCmpRef) {
    this.model = 'together';
    this.getDataList();
    listCmpRef.reload( this.model)
    
  }

  forwards(listCmpRef) {
    this.model = 'forwards';
    this.getDataList();
    listCmpRef.reload( this.model)
  }

  backwrads(listCmpRef) {
    this.model = 'backwards';
    this.getDataList();
    listCmpRef.reload( this.model)
  }

  reload() {
    this.model = '*';
    this.getDataList();
  }
}
