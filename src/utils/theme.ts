
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
  dark: false,
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
    "background": "rgb(247, 247, 247)",
    "onBackground": "rgb(25, 28, 27)",
    "surface": "rgb(251, 253, 249)",
    "onSurface": "rgb(25, 28, 27)",
    "surfaceVariant": "rgb(241, 243, 239)",
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
    "backdrop": "rgba(41, 50, 46, 0.4)",
  }
};

export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    primary: "rgb(19, 73, 59)",
    onPrimary: "rgb(184, 184, 184)",
    primaryContainer: "rgb(0, 81, 62)",
    onPrimaryContainer: "rgb(129, 248, 208)",

    secondary: "rgb(177, 204, 191)",
    onSecondary: "rgb(29, 52, 43)",
    secondaryContainer: "rgb(32, 48, 40)",
    onSecondaryContainer: "rgb(206, 233, 220)",

    tertiary: "rgb(176, 208, 176)",
    onTertiary: "rgb(31, 54, 34)",
    tertiaryContainer: "rgb(47, 74, 91)",
    onTertiaryContainer: "rgb(195, 232, 254)",

    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 218, 214)",

    background: "rgb(25, 28, 27)",
    onBackground: "rgb(225, 227, 224)",

    surface: "rgb(32, 36, 35)",
    onSurface: "rgb(225, 227, 224)",

    surfaceVariant: "rgb(64, 73, 68)",
    onSurfaceVariant: "rgb(191, 201, 195)",

    outline: "rgb(75, 80, 77)",
    outlineVariant: "rgb(64, 73, 68)",

    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",

    inverseSurface: "rgb(225, 227, 224)",
    inverseOnSurface: "rgb(46, 49, 47)",
    inversePrimary: "rgb(0, 108, 83)",

    elevation: {
      level0: "transparent",
      level1: "rgb(29, 33, 31)",
      level2: "rgb(32, 36, 34)",
      level3: "rgb(36, 40, 38)",
      level4: "rgb(37, 42, 40)",
      level5: "rgb(40, 45, 43)",
    },

    surfaceDisabled: "rgba(225, 227, 224, 0.12)",
    onSurfaceDisabled: "rgba(225, 227, 224, 0.38)",
    backdrop: "rgba(41, 50, 46, 0.4)",
  },
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
