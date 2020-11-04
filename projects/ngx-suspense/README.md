# NgxSuspense

This library is an experimental implementation of React Suspense for Angular.

## [DEMO 📽️](https://codesandbox.io/s/ngx-suspense-dgjhh)

## Motivation 💥

NgxSuspense allows to provide a consistent way for loading experience. Similar as `useTransition` hook in React. You can provide custom configuration to fine tuning loading experience.

## Install the library 🧪

```bash
npm i ngx-suspense --save
```

Import the module:

```typescript
imports: [NgxSuspenseModule];
```

Once you include the module, you will get following list of components you can use:

```html
<SuspenseList revealOrder="together | forwards | backwards"></SuspenseList>
<Suspnese [fallback]="template" [bind]="suspneseServiceInstanse"></Suspnese>
```

and also you got one service:

```typescript
NgxSuspenseService;
```

## Features 🔥

### `<Suspense>`

Using `[fallback]` with `<ng-template></ng-template>`

`<Suspense [fallback]="tempalteRef"><YOUR_CONTENT_FROM_SERVER /></Suspense>` will use the template you passed in.

Using `[bind]=suspenseServiceInstanse`, allow you to bind differnet service instanse to `Suspense` component other than global one. Normally use `[bind]` when you have multi `Suspsnse` components inside one page.

```typescript
@Component({
  selector: "categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  providers: [NgxSuspenseService],
})
export class CategoriesComponent implements OnInit {
  categories$: Observable<Category[]>;
  constructor(
    private categoriesService: CategoriesService,
    private suspenseService: NgxSuspenseService
  ) {
    // Side effect
    this.categories$ = this.categoriesService
      .getCategories()
      .pipe(this.suspenseService.showLoadingStatus());
  }
}
```

```html
<ng-template #tmp>
  <loading-headline size="s"></loading-headline>
  <div class="column">
    <loading-headline size="m"></loading-headline>
    <loading-text size="m"></loading-text>
    <loading-text size="m"></loading-text>
  </div>
</ng-template>
<main>
  <section>
    <Suspnese [fallback]="tmp">
      <!-- Your content to be loaded below -->
      <div *ngIf="categories$ | asnyc as categories"></div>
    </Suspnese>
  </section>
</main>
```

In the example uses [`ngx-loading-skeleton`](../loading-skeleton/README.md) for showing loading shimmer

#### `@Input() ariaLabel: string`

Support for `aria-label`, with default settings `aria-busy=true` & `aria-hidden=false`

---

### `<SuspenseList>`

Let's say you have two or more `<Suspense>` inside one page.

Each of them resolve in different time, different orders, depends on network speed.

To avoid some part of UI jumping up & down, you can use `<SuspenseList revealOrder="together">` as a parent component to wrap all `<Suspense>`s. Then all `<Suspense>` will resolve at the same time.

```html
<SuspenseList revealOrder="together">
  <Suspense [fallback]="tmp1" [bind]="suspenseService1">
    <YOUR_COMPONENT1 [data]="data1$ | async" />
  </Suspense>
  <Suspense [fallback]="tmp2" [bind]="suspenseService2">
    <YOUR_COMPONENT2 [data]="data2$ | async" />
  </Suspense>
  <Suspense [fallback]="tmp3" [bind]="suspenseService3">
    <YOUR_COMPONENT3 [data]="data3$ | async" />
  </Suspense>
</SuspenseList>
```

```typescript
class YOUR_SMART_COMPONENT {
    this.suspenseService1 = new NgxSuspenseService()
    this.suspenseService2 = new NgxSuspenseService()
    this.suspenseService3 = new NgxSuspenseService()

    this.data1$ = this.apiService.loadData1()
        .pipe(
            this.suspenseService1.showLoadingStatus()
        )
    this.data2$ = this.apiService.loadData2()
        .pipe(
            this.suspenseService2.showLoadingStatus()
        )
    this.data3$ = this.apiService.loadData3()
        .pipe(
            this.suspenseService3.showLoadingStatus()
        )
}
```

---

### `NgxSuspenseService`

#### `showLoadingStatus()`

You can pass in an observable which will finially complete, `showLoadingStatus` will trigger the side effect which control loading spinner ON / OFF. Type friendly approach.

```typescript
this.categories$ = this.categoriesService
  .getCategories()
  .pipe(this.suspenseService.showLoadingStatus());
```

#### `show() / hide()`

If you wish to have normal control flow approach. You can use `show / hide`

```typescript
this.suspenseService.show();
await this.apiService.load();
this.suspenseService.hide();
```

## Configuration

You can set `busyDelayMs` and `busyMinDurationMs`.

```diff
imports: [
  NgxSuspenseModule.forRoot({
    // within 300ms, don't show the loading skeleton; default value: 0
  + busyDelayMs: 300,
  // showing loading skeleton for at least 700ms; default value: 0
  + busyMinDurationMs: 700
  }),
];
```
