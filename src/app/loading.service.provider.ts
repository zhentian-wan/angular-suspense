import {
  LoadingSkeletonService,
  LOADING_DEFUALT_CONFIG,
} from "projects/loading-skeleton/src/public-api";

export const loadingFactory = (config) => {
  return new LoadingSkeletonService(config);
};

export let loadingServiceProvider = {
  provide: LoadingSkeletonService,
  useFactory: loadingFactory,
  deps: [LOADING_DEFUALT_CONFIG],
};
