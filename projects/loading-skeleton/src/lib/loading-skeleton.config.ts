import { InjectionToken } from "@angular/core";

export interface ITheme {
  backgroundColor?: string;
  fontColor?: string;
}
export interface ILoadingConfigTheme {
  light?: ITheme;
  dark?: ITheme;
}
export interface ILoadingConfig {
  showContent?: boolean;
  theme?: ILoadingConfigTheme;
  duration?: string;
  animationSpeed?: string;
}

export const LOADING_DEFUALT_CONFIG: ILoadingConfig = {
  showContent: true,
  animationSpeed: "0.9s",
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
};
export const LOADING_CONFIG_TOKEN = new InjectionToken<ILoadingConfig>(
  "LOADING_CONFIG_TOKEN"
);
