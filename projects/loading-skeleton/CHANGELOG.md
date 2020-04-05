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
