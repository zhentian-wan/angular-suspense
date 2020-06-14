import { Component, OnInit } from "@angular/core";
import { timer, of } from "rxjs";
import { mapTo } from "rxjs/operators";
import { NgxSuspenseService } from "projects/ngx-suspense/src/projects";

const mockData = {
  heading: "Demo heading",
  content: [
    {
      id: 0,
      content: "List content 0",
    },
    {
      id: 1,
      content: "List content 1",
    },
    {
      id: 2,
      content: "List content 2",
    },
    {
      id: 3,
      content: "List content 3",
    },
    {
      id: 4,
      content: "List content 4",
    },
    {
      id: 5,
      content: "List content 5",
    },
    {
      id: 6,
      content: "List content 6",
    },
    {
      id: 7,
      content: "List content 7",
    },
    {
      id: 8,
      content: "List content 8",
    },
  ],
};

@Component({
  selector: "app-optimize",
  templateUrl: "./optimize.component.html",
  styleUrls: ["./optimize.component.scss"],
  providers: [NgxSuspenseService],
})
export class OptimizeComponent implements OnInit {
  data$;
  busyDelayMs;
  busyMinDurationMs;

  constructor(private loadingService: NgxSuspenseService) {}

  ngOnInit(): void {
    this.busyDelayMs = this.loadingService.config.busyDelayMs;
    this.busyMinDurationMs = this.loadingService.config.busyMinDurationMs;
    this.initRequest(1000);
  }

  initRequest(time = 2000) {
    if (time === 0) {
      this.data$ = of(mockData).pipe(this.loadingService.showLoadingStatus());
    }
    this.data$ = timer(time).pipe(
      mapTo(mockData),
      this.loadingService.showLoadingStatus()
    );
  }

  busyTimer() {
    this.loadingService.busyTimer = {
      busyDelayMs: this.busyDelayMs,
      busyMinDurationMs: this.busyMinDurationMs,
    };
  }

  reset() {
    this.busyDelayMs = 0;
    this.busyMinDurationMs = 0;
    this.busyTimer();
  }
}
