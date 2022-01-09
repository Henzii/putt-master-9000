
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
        family: 'serif',
        color: {
            primary: 'black',
            secondary: 'lightgray',
        }
    }
}