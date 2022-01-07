
import { DefaultTheme } from "react-native-paper";

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        secondary: 'yellow',
    },
    font: {
        sizes: {
            normal: 14,
            large: 20,
            huge: 25,
        },
        family: 'Verdana',
        color: {
            primary: 'black',
            secondary: 'lightgray',
        }
    }
}