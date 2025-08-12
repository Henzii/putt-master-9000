
import { DefaultTheme } from "react-native-paper";
export const scoreColors = {
    alba: '#ffcf40',
    eagle: 'rgb(255,207,64)',
    birdie: '#9adaff',
    par: '#a5d4c3',
    bogey: '#fce79a',
    doubleBogey: '#fcbc9a',
    other: '#ff7f7f',
};
export const theme = {
    ...DefaultTheme,
        "colors": {
          "primary": "rgb(0, 108, 83)",
          "onPrimary": "rgb(255, 255, 255)",
          "primaryContainer": "rgb(129, 248, 208)",
          "onPrimaryContainer": "rgb(0, 33, 23)",
          "secondary": "rgb(76, 99, 90)",
          "onSecondary": "rgb(255, 255, 255)",
          "secondaryContainer": "rgb(206, 233, 220)",
          "onSecondaryContainer": "rgb(8, 32, 24)",
          "tertiary": "rgb(200, 235, 200)",
          "onTertiary": "rgb(76, 99, 90)",
          "tertiaryContainer": "rgb(195, 232, 254)",
          "onTertiaryContainer": "rgb(0, 30, 43)",
          "error": "rgb(186, 26, 26)",
          "onError": "rgb(255, 255, 255)",
          "errorContainer": "rgb(255, 218, 214)",
          "onErrorContainer": "rgb(65, 0, 2)",
          "background": "rgb(251, 253, 249)",
          "onBackground": "rgb(25, 28, 27)",
          "surface": "rgb(251, 253, 249)",
          "onSurface": "rgb(25, 28, 27)",
          "surfaceVariant": "rgb(219, 229, 223)",
          "onSurfaceVariant": "rgb(64, 73, 68)",
          "outline": "rgb(112, 121, 116)",
          "outlineVariant": "rgb(191, 201, 195)",
          "shadow": "rgb(0, 0, 0)",
          "scrim": "rgb(0, 0, 0)",
          "inverseSurface": "rgb(46, 49, 47)",
          "inverseOnSurface": "rgb(239, 241, 238)",
          "inversePrimary": "rgb(99, 219, 181)",
          "elevation": {
            "level0": "transparent",
            "level1": "rgb(238, 246, 241)",
            "level2": "rgb(231, 241, 236)",
            "level3": "rgb(223, 237, 231)",
            "level4": "rgb(221, 236, 229)",
            "level5": "rgb(216, 233, 226)"
          },
          "surfaceDisabled": "rgba(25, 28, 27, 0.12)",
          "onSurfaceDisabled": "rgba(25, 28, 27, 0.38)",
          "backdrop": "rgba(41, 50, 46, 0.4)"
        }
};

export const devTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: 'rgb(0, 83, 108)',
    tertiary: "rgb(150, 200, 235)",
  }
};

export const prevTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: 'rgb(108, 0, 108)',
    tertiary: "rgb(235, 0, 235)",
  }
};

