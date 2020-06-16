# NgxErrorBoundary

This library is an experimental implementation of React Error boundary for Angular.

# [DEMO](https://codesandbox.io/s/ngx-error-boundary-zu61y?fontsize=14&hidenavigation=1&theme=dark)

## Install the library

```bash
npm i ngx-error-boundary --save
```

Import the module:

```typescript
imports: [NgxErrorBoundaryModule];
```

Once you include the module, you will get following component that you can use:

```html
<ErrorBoundary
  [fallback]="template"
  key="unique.identify.string"
></ErrorBoundary>
```

following directives:

```typescript
errorRetry;
errorDismiss;
```

and also you got one service:

```typescript
NgxErrorBoundaryService;
```

## Usage

### `<ErrorBoundary>`

Using `[fallback]` with `<ng-template></ng-template>`, `key` is optional if there is only one `ErrorBoundary` pre-component.

If there are multi `ErrorBoundary` inside one component, you need to use `key` to show correct error message

```html
<!-- error: {message: string, key: string} -->
<!-- retry$: Observable<boolean>: is retrying -->
<ng-template #errTemplate let-error let-retry$="retry$">
  <div class="err-container">
    <h2>Something goes wrong!</h2>
    <section>
      <p [innerHTML]="error.message"></p>
      <!-- errorRetry can help to retry the failed observable -->
      <button errorRetry>
        {{ (retry$ | async) ? "Retrying..." : "Retry" }}
      </button>
      <!-- errorDismiss: hide error boundary -->
      <button [errorDismiss]="error.key">Dismiss</button>
    </section>
  </div>
</ng-template>

<ErrorBoundary [fallback]="errTemplate" key="example">
  <YOUR_CONTENT_FROM_SERVER [data]="data$ | async" />
</ErrorBoundary>
```

```typescript
this.data$ = timer(500).pipe(
  this.apiService.fetchData(),
  this.errorService.handleExpection({
    message: "Cannot load data",
    key: "example",
  })
);
```

When there is error, `<YOUR_CONTENT_FROM_SERVER [data]="data$ | async" />` will be repalced with `errTemplate`.

#### `@Input() fallback: TemplateRef`

Take an `ng-template` as input.

#### `@Input() key: string`

A string to unqiue identify string to show correct error message

---

### `errorRetry` Directive

You can retry the failed observable.

### `errorDismiss` Directive

Take error's key string as input.

To hide Error boundary component

---

### `NgxErrorBoundaryService`

#### `handleExpection({message?: string, key?: string})`

If nothing passed in as arguement, will use catched error's message information.

There is a default key assigned, can be used for global error message.

**Example:**

```typescript
@Component({
  selector: "categories",
  ...
  providers: [NgxErrorBoundaryService],
})
export class CategoriesComponent {
  categories$: Observable<Category[]>;
  constructor(
    private categoriesService: CategoriesService,
    private errorService: NgxErrorBoundaryService
  ) {
    this.categories$ = this.categoriesService.fetchData().pipe(
      this.errorService.handleExpection({
        message: "Cannot load categories",
        key: "categories",
      })
    );
  }
}
```

#### `dismiss(key?: string)`

key: error key

Hide error boundary component and error message for the key.

If didn't pass key, then hide all error messages.
