import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { createContext, FC, ReactNode, useContext, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { theme as defaultTheme, devTheme, prevTheme } from "src/utils/theme";

type ChangeThemeFunction = (theme?: string | null) => void;

const ThemeContext = createContext<ChangeThemeFunction | null>(null);

export const useChangeTheme = () => {
    const changeFunction = useContext(ThemeContext);
    if (!changeFunction) {
        throw new Error("useChangeTheme must be used within a ThemeProvider");
    }
    return changeFunction;
};

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState(defaultTheme);

    const handleChangeTheme: ChangeThemeFunction = (theme) => {
        if (theme === 'development') {
            setTheme(devTheme);
        } else if (theme === 'preview') {
            setTheme(prevTheme);
        } else {
            setTheme(defaultTheme);
        }
    };

    useEffect(() => {
        const initializeTheme = async () => {
            const env = await AsyncStorage.getItem('apiEnv') || process.env.NODE_ENV as string;
            handleChangeTheme(env);
        };

        initializeTheme();
    }, []);

    return (
        <ThemeContext.Provider value={handleChangeTheme}>
            <PaperProvider theme={theme}>
                {children}
            </PaperProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;