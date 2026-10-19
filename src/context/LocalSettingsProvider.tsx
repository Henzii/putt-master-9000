import { useNotification } from '@hooks/useNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

export type SettingName = 'SortHC' | 'SortBox' | 'Prohibition' | 'AutoAdvance' | 'HideStatsBars' | 'HidePlusMinus' | 'RandomThrowStyle' | 'ImperialUnits' | 'HideTeeSign' | 'Theme';

function useLocalSettings() {
    const [settingsData, setSettingsData] = useState<Record<string, string | boolean>>();
    const notify = useNotification();
    useEffect(() => {
        async function initializeSettings() {
            try {
                const data = await AsyncStorage.getItem('localSettings');
                if (!data) return;
                const JSONdata = JSON.parse(data);
                if (JSONdata) {
                    setSettingsData(JSONdata);
                }
            } catch (error) {
                notify("Error loading local settings");
                setSettingsData({});
            }
        }
        initializeSettings();
    }, []);
    const handleChangeData = (newValue: Record<string, string | boolean>) => {
        const newData = { ...settingsData, ...newValue };
        setSettingsData(newData);
        AsyncStorage.setItem('localSettings', JSON.stringify(newData));
    };
    const toggle = (name: SettingName) => {
        if (!settingsData) return;

        if (!settingsData[name]) {
            handleChangeData({ [name]: true });
        } else if (typeof settingsData[name] === "boolean") {
            handleChangeData({ [name]: !settingsData[name] });
        }
        return;
    };
    const getValue = (name: SettingName) => {
        return settingsData?.[name] ?? '';
    };
    const getBoolValue = (name: SettingName) => {
        return !!settingsData?.[name];
    };
    const setValue = (name: SettingName, value: string | boolean) => {
        handleChangeData({ [name]: value });
    };
    return {
        toggle,
        setValue,
        settingsData,
        getValue,
        getBoolValue
    };
}

type LocalSettings = ReturnType<typeof useLocalSettings>

const SettingsContext = createContext<LocalSettings>({} as LocalSettings);

export const useSettings = () => useContext(SettingsContext);

export default function LocalSettingsProvider({ children }: PropsWithChildren) {
    const settings = useLocalSettings();
    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}
