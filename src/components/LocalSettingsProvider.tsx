import React, { PropsWithChildren, createContext, useContext } from "react";
import useLocalSettings from "../hooks/useLocalSettings";

const SettingsContext = createContext<ReturnType<typeof useLocalSettings> | null>(null);

export const useSettings = () => useContext(SettingsContext);

export default function LocalSettingsProvider ( {children}: PropsWithChildren) {
    const settings = useLocalSettings();
    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}