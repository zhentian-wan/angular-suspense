# NgxLoadingSkeleton

## [DEMO](https://codesandbox.io/s/hungry-flower-0jwv5?fontsize=14&hidenavigation=1&theme=dark)

## Install the library

```bash
npm i ngx-loading-skeleton --save
```

Import the module:

```typescript
imports: [NgxLoadingSkeletonModule];
```

Once you include the module, you will get following list of components you can use:

```html
    <loading-skeleton [outlet]="TempalteRef"></loading-skeleton>
    <loading-placeholder [size]="s|m|l|f|small|medium|large|full" [type]="text|headline"></loading-placeholde>
    <loading-text [size]="s|m|l|f|small|medium|large|full"></loading-text>
    <loading-headline [size]="s|m|l|f|small|medium|large|full">
    <loading-button>
    <loading-bullet>
    <loading-list [count]="number(default 3)" [size]="s|m(default)|l|f|small|medium|large|full" [bullet]="true(default)|false">
```

and also you got one service:

```typescript
LoadingSkeletonService;
```

## Usage

### `<loading-skeleton>`

Using `[outlet]` with `<ng-template></ng-template>`

`<loading-skeleton [outlet]="tempalteRef"><YOUR_CONTENT_FROM_SERVER /></loading-skeleton>` will use the template you passed in.

It using `this.loadingService.showingFor<T>(obs$ : Observable<T>): Observable<T>`, dynamically control `loading-skeleton` component show / hide. It is more reactive approach.

You can also use `this.loadingService.showLoadingStatus()`

```typescript
@Component({
  selector: "categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  providers: [LoadingSkeletonService],
})
export class CategoriesComponent implements OnInit {
  categories$: Observable<Category[]>;
  constructor(
    private categoriesService: CategoriesService,
    private loadingService: LoadingSkeletonService
  ) {
    // Type safe
    this.categories$ = this.loadingService.showingFor(
      this.categoriesService.getCategories()
    );

    // or
    // Side effect
    this.categories$ = this.categoriesService
      .getCategories()
      .pipe(this.loadingService.showLoadingStatus());
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
    <loading-skeleton [outlet]="tmp">
      <!-- Your content to be loaded below -->
      <div *ngIf="categories$ | asnyc as categories"></div>
    </loading-skeleton>
  </section>
</main>
```

#### `@Input() ariaLabel: string`

Support for `aria-label`, with default settings `aria-busy=true` & `aria-hidden=false`

---

### `<loading-skeleton-list>`

Let's say you have two or more `<loading-skeleton>` inside one page.

Each of them resolve in different time, different orders, depends on network speed.

To avoid some part of UI jumping up & down, you can use `<loading-skeleton-list revealOrder="together">` as a parent component to wrap all `<loading-skeleton>`s. Then all `<loading-skeleton>` will resolve at the same time.

---

### `<loading-placeholder>`

This is basic buidling block for all the available components:

```html
<loading-text [size]="s|m|l|f|small|medium|large|full"></loading-text>
<loading-headline [size]="s|m|l|f|small|medium|large|full"></loading-headline>
<loading-button></loading-button>
<loading-bullet></loading-bullet>
<loading-list
  [count]="number"
  [size]="s|m|l|f|small|medium|large|full"
  [bullet]="true|false"
></loading-list>
```

Basiclly it means that if in the list doesn't contain such built-in component for your usecases. You can use `<loading-placeholder></loading-placeholder>` to build one by yourself.

For example:

```html
// loading-bullet.component.html

<loading-placeholder class="loading-placeholder__bullet"></loading-placeholder>
```

```css
.loading-placeholder__bullet {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
```

### `LoadingSkeletonService`

#### `showingFor<T>(Obs$: Observable<T>): Observable<T>`

You can pass in an observable which will finially complete, `showingFor` will trigger the side effect which control loading spinner ON / OFF. Type friendly approach.

**Example:**

```typescript
@Component({
  selector: "categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  providers: [LoadingSkeletonService],
})
export class CategoriesComponent implements OnInit {
  categories$: Observable<Category[]>;
  constructor(
    private categoriesService: CategoriesService,
    private loadingService: LoadingSkeletonService
  ) {
    this.categories$ = this.loadingService.showingFor(
      this.categoriesService.getCategories()
    );
  }
}
```

#### `showLoadingStatus()`

The same effect with `showingFor()`, just doesn't have type information.

```typescript
this.categories$ = this.categoriesService
  .getCategories()
  .pipe(this.loadingService.showLoadingStatus());
```

#### `show() / hide()`

If you wish to have normal control flow approach. You can use `show / hide`

```typescript
this.loadingSerivce.show();
await this.apiService.load();
this.loadingService.hide();
```

#### `changeMode(mode: 'light'|'dark'): void`

#### `changeMode(isDark: boolean ): void`

You can use LoadingSkeletonService to toggle dark / light mode.

```typescript
const isDark = true;
this.loadingService.changeMode(isDark); // set dark mode
this.loadingService.changeMode("dark"); // set dark mode
this.loadingService.changeMode(!isDark); // set light mode
this.loadingService.changeMode("light"); // set light mode
```

## Configuration

You can set `backgroundColor`, `fontColor`, `busyDelayMs`, `busyMinDurationMs` and `animationSpeed`.

```typescript
imports: [
  LoadingSkeletonModule.forRoot({
    animationSpeed: "1.5s", // default: 0.9s
    busyDelayMs: 300, // within 300ms, don't show the loading skeleton
    busyMinDurationMs: 700, // showing loading skeleton for at least 700ms
    theme: {
      // the same as default value
      light: {
        backgroundColor: `rgb(227, 227, 227)`,
        fontColor: `rgba(0, 0, 0, 0.7)`,
      },
      dark: {
        backgroundColor: `rgba(0, 0, 0, 0.7)`,
        fontColor: `rgb(227, 227, 227)`,
      },
    },
  }),
];
```

### Recommended

It is recommended to inject `LoadingSkeletonService` for `component` level.

The reason is for each page or feature module, we want difference loading skeleton so that users get unqiue experience when browsering the appliation.
