import React from "react";
import { StyleSheet, Text } from "react-native";
import { Switch } from "react-native-paper";
import type { SettingName } from "../hooks/useLocalSettings";
import { useSettings } from "./LocalSettingsProvider";
import SplitContainer from "./ThemedComponents/SplitContainer";

export default function LocalSettings() {
    const settings = useSettings();
    return (
        <>
            <SingleSwitch text="Sort summary by HC" onPress={settings.toggle} getValue={settings.getBoolValue} name="SortHC" />
            <SingleSwitch text="Sort scorecards by box order" onPress={settings.toggle} getValue={settings.getBoolValue} name="SortBox" />
            <SingleSwitch text="Auto select first unfinished hole" onPress={settings.toggle} getValue={settings.getBoolValue} name="AutoAdvance" />
            <SingleSwitch text="Hide stats from scorecards" onPress={settings.toggle} getValue={settings.getBoolValue} name="HideStatsBars" />
            <SingleSwitch text="Prohibition" onPress={settings.toggle} getValue={settings.getBoolValue} name="Prohibition" noBorder />
        </>
    );
}
type SingleSwitchProps = {
    text: string,
    onPress: (name: SettingName) => void,
    getValue: (name: SettingName) => boolean,
    name: SettingName,
    noBorder?: boolean,
}
const SingleSwitch = ({text, onPress, getValue, name, noBorder = false}: SingleSwitchProps ) => {
    const handleChange = () => {
        onPress(name);
    };
    return (
         <SplitContainer onPress={handleChange} style={[tyyli.single, !noBorder && tyyli.withBorder]}>
            <Text>{text}</Text>
            <Switch value={getValue(name)} onValueChange={handleChange} />
        </SplitContainer>
    );
};

const tyyli = StyleSheet.create({
    single: {
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    withBorder: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.3)'
    }
});
