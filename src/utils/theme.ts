
import { DefaultTheme } from "react-native-paper";
export const scoreColors = {
    eagle: 'rgb(255,207,64)',
    birdie: '#aadaf2',
    par: '#a5d4c3',
    bogey: '#fce79a',
    doubleBogey: '#fcbc9a'
};
export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#508572',
        secondary: 'yellow',
        accent: '#508572',
        background: '#fcfcfc',
        surface: '#eff3ef',
    },
    roundess: 7,
    font: {
        sizes: {
            normal: 14,
            large: 20,
            huge: 25,
        },
        family: 'serif',
        color: {
            primary: 'black',
            secondary: 'lightgray',
        }
    }
};
