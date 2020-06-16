# NgxLoadingSkeleton

## [DEMO](https://codesandbox.io/s/ngx-loading-skeleton-zlcwr?file=/src/app/available/available.component.html)

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
<loading-skeleton [fallback]="TempalteRef"></loading-skeleton>
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

You can set `backgroundColor`, `fontColor` and `animationSpeed`.

```typescript
imports: [
  LoadingSkeletonModule.forRoot({
    animationSpeed: "1.5s", // default: 0.9s
    theme: {
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
