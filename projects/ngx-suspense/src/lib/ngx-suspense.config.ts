import { InjectionToken } from "@angular/core";

export interface ILoadingConfig {
  busyMinDurationMs?: number;
  busyDelayMs?: number;
}

export const LOADING_DEFUALT_CONFIG: ILoadingConfig = {
  busyMinDurationMs: 0,
  busyDelayMs: 0,
};
export const LOADING_CONFIG_TOKEN = new InjectionToken<ILoadingConfig>(
  "LOADING_CONFIG_TOKEN"
);
