
import { DefaultTheme } from "react-native-paper";

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#508572',
        secondary: 'yellow',
        accent: '#508572',
        background: '#fff',
        mainBackground: '#fafafa',
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