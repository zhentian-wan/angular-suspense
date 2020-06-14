import { Component, OnInit, Input, TemplateRef } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { NgxSuspenseService } from "./ngx-suspense.service";
import { Observable } from "rxjs";

@Component({
  selector: "Suspense",
  templateUrl: "./ngx-suspense.component.html",
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(
          "300ms ease-in",
          style({
            opacity: 1,
          })
        ),
      ]),
    ]),
  ],
})
export class NgxSuspenseComponent implements OnInit {
  @Input() fallback: TemplateRef<any>;
  @Input() ariaLabel: string = "Loading...";
  @Input() bind: NgxSuspenseService;
  @Input() isVisible: boolean = false;

  loading$: Observable<boolean>;
  service: NgxSuspenseService;

  constructor(private loadingService: NgxSuspenseService) {}

  ngOnInit(): void {
    this.service = this.getService();
    this.loading$ = this.service.loading$;
  }

  getService() {
    return this.bind || this.loadingService;
  }

  show() {
    this.service.show();
    this.isVisible = true;
  }

  hide() {
    this.service.hide();
    this.isVisible = false;
  }
}
