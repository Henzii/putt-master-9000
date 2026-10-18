import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { createContext, FC, ReactNode, useContext, useMemo, useState } from "react";
import { useColorScheme } from 'react-native';
import { PaperProvider } from "react-native-paper";
import { darkTheme, theme as lightTheme } from "src/utils/theme";

export type ThemePreference = 'auto' | 'light' | 'dark';
type ChangeThemeFunction = (preference: ThemePreference) => void;

const ThemeContext = createContext<ChangeThemeFunction | null>(null);

export const useChangeTheme = () => {
    const changeFunction = useContext(ThemeContext);
    if (!changeFunction) {
        throw new Error("useChangeTheme must be used within a ThemeProvider");
    }
    return changeFunction;
};

const isThemePreference = (value: unknown): value is ThemePreference =>
    value === 'auto' || value === 'light' || value === 'dark';

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [preference, setPreferenceState] = useState<ThemePreference>('auto');
    const colorScheme = useColorScheme();

    const handleChangeTheme: ChangeThemeFunction = (newPreference) => {
        setPreferenceState(newPreference);
    };

    useEffect(() => {
        const initializeTheme = async () => {
            const settings = await AsyncStorage.getItem('localSettings');
            const localSettings: unknown = settings ? JSON.parse(settings) : null;
            if (localSettings && typeof localSettings === 'object' && 'Theme' in localSettings &&
                isThemePreference(localSettings.Theme)) {
                setPreferenceState(localSettings.Theme);
            }
        };

        initializeTheme();
    }, []);

    const theme = useMemo(() => {
        const isDark = preference === 'dark' || (preference === 'auto' && colorScheme === 'dark');
        return isDark ? darkTheme : lightTheme;
    }, [colorScheme, preference]);

    return (
        <ThemeContext.Provider value={handleChangeTheme}>
            <PaperProvider theme={theme}>
                {children}
            </PaperProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;