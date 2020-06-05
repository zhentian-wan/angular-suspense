# Changelog

## v1.0.0 - 5.4.2020

### Added

- NgxLoadingSkeletonModule

  - forRoot configuration

- LoadingSkeletonService

  - showingFor() to control <loading-skeleton> show / hide
  - show() / hide()
  - Global theme configuration
  - Global 'light' / 'mode' configuration

- LoadingSkeletonComponent
  - @Input() outlet: to support passed in template
  - Support content projection
  - Support component level theme and mode configuration

* LoadingPlaceholderComponent
  - Support theme and mode configuration by @Input
  - Basic styling and animation

- List of built-in components
  - LoadingListComponent
  - LoadingTextComponent
  - LoadingTextareaComponent
  - LoadingButtonComponent
  - LoadingHeadlineComponent
  - LoadingImageComponent

## v1.1.1 - 10.04.2020

- `busyDelayMs`: under 300ms, don't show the loading skeleton
- `busyMinDurationMs`: if showing loading skeleton, showing at least 700ms
- `busyDelayMs` & `busyMinDurationMs` configurable
- Added bouncing opacity animation

## v1.1.2 - 30.04.2020

- Using `ShadowDOM` for placholder component

## v1.2.0 - 01.05.2020

- Add pipeable operator `showLoadingStatus()` to LoadingSkeletonService

## v1.3.0 - 17.05.2020

- Update `showingFor` & `showLoadingStatus` apis

## v1.3.1 - 17.05.2020

- Fix data and skeleton showing at the same time

## v1.3.2 - 19.05.2020

- UnSubscribe the spinner on destroy
- Reset timer to zero on Init

## 1.3.3 - 19.05.2020

- Using AsyncSubject for hideSpinner to resolve source observable using `of`

## 2.0.0

- Fix when retrying, skeleton not showing
- Add transition when toggle from skeleton to content
- Remove content projection approach
- Replace content project to show the data
- Added `loading-skeleton-list` with `revealOrder: together, forwards, backwards`
- Removed `loading-image` & `loading-textarea`
- Added export `loading-bullet`
- rename `loading-skeleton` component's Input `outlet` to `fallback`
