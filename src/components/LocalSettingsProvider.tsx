import React, { createContext, useContext } from "react";
import useLocalSettings from "../hooks/useLocalSettings";

const SettingsContext = createContext<any>(null);

export const useSettings = () => useContext(SettingsContext);

export default function LocalSettingsProvider ( {children}: { children: React.ReactElement | Element | false | null }) {
    const settings = useLocalSettings();
    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}