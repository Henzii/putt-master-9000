import React, { PropsWithChildren, createContext, useContext } from "react";
import useLocalSettings from "../hooks/useLocalSettings";

type LocalSettings = ReturnType<typeof useLocalSettings>

const SettingsContext = createContext<LocalSettings>({} as LocalSettings);

export const useSettings = () => useContext(SettingsContext);

export default function LocalSettingsProvider ( {children}: PropsWithChildren) {
    const settings = useLocalSettings();
    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}