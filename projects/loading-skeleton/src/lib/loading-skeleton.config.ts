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
      backgroundColor: `rgba(0, 0, 0, 0.2)`,
      fontColor: `black`,
    },
    dark: {
      backgroundColor: `rgba(255, 255, 255, 0.2)`,
      fontColor: `white`,
    },
  },
};
export const LOADING_CONFIG_TOKEN = new InjectionToken<ILoadingConfig>(
  "LOADING_CONFIG_TOKEN"
);
