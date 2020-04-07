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
    <loading-placeholder [size]="s|m|l|f|small|medium|large|full" [type]="text|headline|image"></loading-placeholde>
    <loading-text [size]="s|m|l|f|small|medium|large|full"></loading-text>
    <loading-headline [size]="s|m|l|f|small|medium|large|full">
    <loading-image>
    <loading-button>
    <loading-textarea>
    <loading-list [count]="number(default 3)" [size]="s|m(default)|l|f|small|medium|large|full" [bullet]="true(default)|false">
```

and also you got one service:

```typescript
LoadingSkeletonService;
```

## Usage

### `<loading-skeleton>`

Two ways to using `<loading-skeleton>`.

1. Using `[outlet]` with `<ng-template></ng-template>`

`<loading-skeleton [outlet]="tempalteRef"></loading-skeleton>` will use the template you passed in.

It using `this.loadingService.showingFor<T>(obs$ : Observable<T>): Observable: T`, dynamically control `loading-skeleton` component show / hide. It is more reactive approach.

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

```html
<ng-template #tmp2>
  <loading-headline size="s"></loading-headline>
  <div class="column">
    <loading-headline size="m"></loading-headline>
    <loading-text size="m"></loading-text>
    <loading-text size="m"></loading-text>
  </div>
</ng-template>
<main>
  <section>
    <loading-skeleton [outlet]="tmp2"></loading-skeleton>
    <!-- Your content to be loaded below -->
    <div *ngIf="categories$ | asnyc as categories"></div>
  </section>
</main>
```

2. Using `content projection`

```html
<loading-skeleton>
  <p>
    <span>Loading...</span>
  </p>
</loading-skeleton>
```

without `[outlet]` will show the content from content projection

#### `@Input() isVisible`

If you are not comfortable with reactive (Angualar) approach, you can use `<loading-skeleton [isVisible]="boolean"></loading-skeleton>` to control it as well. This is more friendly to web component use cases, if you are not using Angular.

#### `@Input() ariaLabel: string`

Support for `aria-label`, with default settings `aria-busy=true` & `aria-hidden=false`

---

### `<loading-placeholder>`

This is basic buidling block for all the available components:

```html
<loading-text [size]="s|m|l|f|small|medium|large|full"></loading-text>
<loading-headline [size]="s|m|l|f|small|medium|large|full"></loading-headline>
<loading-image></loading-image>
<loading-button></loading-button>
<loading-textarea></loading-textarea>
<loading-list
  [count]="number"
  [size]="s|m|l|f|small|medium|large|full"
  [bullet]="true|false"
></loading-list>
```

Basiclly it means that if in the list doesn't contain such built-in component for your usecases. You can use `<loading-placeholder></loading-placeholder>` to build one by yourself.

For example:

```html
// loading-image.component.html

<loading-placeholder class="loading-placeholder__image"></loading-placeholder>
```

```css
.loading-placeholder__image {
  border-radius: 50%;
  height: 100px;
  width: 100px;
}
```

### `LoadingSkeletonService`

#### `showingFor<T>(Obs\$: Observable<T>): Observable<T>`

You can pass in an observable which will finially complete, `showingFor` will trigger
the side effect which control loading spinner ON / OFF.

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

[Note]: **Some observables will complete automaticlly, some are not.** If you want to use with `router`:

```typescript
// Bad
// Following code will not work
// Because this.router.paramMap will NOT COMPLETE automaticlly

this.loadingService.showingFor(
  this.router.paramMap.pipe(
    map(paramMap => paramMap.get('id')),
    switchMap(id => this.categoriesService.getCategoryById(id))
  )
)

// Good
// Categories Service use http call which will complete automatically

this.router.paramMap.pipe(
  map(paramMap => paramMap.get('id')),
  switchMap(id => this.loadingService.showingFor(this.categoriesService.getCategoryById(id)))
)
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

You can set `backgroundColor`, `fontColor` and animation `duration`.

```typescript
imports: [
  LoadingSkeletonModule.forRoot({
    duration: "1.5s", // default: 0.9s
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
