import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SettingName = 'SortHC' | 'SortBox' | 'Prohibition' | 'AutoAdvance' | 'HideStatsBars' | 'HidePlusMinus' | 'RandomThrowStyle' | 'ImperialUnits' | 'HideTeeSign';

/**
 *
 * @deprecated use useSettings hook
 */
export default function useLocalSettings() {
    const [settingsData, setSettingsData] = useState<Record<string, string | boolean>>({});
    useEffect(() => {
        (async function IIFE() {
            const data = await AsyncStorage.getItem('localSettings');
            if (!data) return;
            const JSONdata = JSON.parse(data);
            if (JSONdata) {
                setSettingsData(JSONdata);
            }
        })();
    }, []);
    const handleChangeData = (newValue: Record<string, string | boolean>) => {
        const newData = {...settingsData, ...newValue};
        setSettingsData(newData);
        AsyncStorage.setItem('localSettings', JSON.stringify(newData));
    };
    const toggle = (name: SettingName) => {
        if (!settingsData[name]) {
            handleChangeData({[name]:true});
        } else if (typeof settingsData[name] === "boolean") {
            handleChangeData({[name]:!settingsData[name]});
        }
        return;
    };
    const getValue = (name: SettingName) => {
        return settingsData[name] ?? '';
    };
    const getBoolValue = (name: SettingName) => {
        return !!settingsData[name];
    };
    return {
        toggle,
        settingsData,
        getValue,
        getBoolValue
    };
}