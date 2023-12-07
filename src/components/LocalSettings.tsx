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
            <SingleSwitch text="Sort summary by HC" onPress={settings.toggle} value={settings.getValue('SortHC')} name="SortHC" />
            <SingleSwitch text="Sort scorecards by box order" onPress={settings.toggle} value={settings.getValue('SortBox')} name="SortBox" />
            <SingleSwitch text="Auto select first unfinished hole" onPress={settings.toggle} value={settings.getValue('AutoAdvance')} name="AutoAdvance" />
            <SingleSwitch text="Hide stats from scorecards" onPress={settings.toggle} value={settings.getValue('HideStatsBars')} name="HideStatsBars" />
            <SingleSwitch text="Hide +/- from scorecards" onPress={settings.toggle} value={settings.getValue('HidePlusMinus')} name="HidePlusMinus" />
            <SingleSwitch text="Prohibition" onPress={settings.toggle} value={settings.getValue('Prohibition')} name="Prohibition" noBorder />
        </>
    );
}
type SingleSwitchProps = {
    text: string,
    onPress: (name: SettingName) => void,
    value?: string | boolean,
    name?: SettingName,
    noBorder?: boolean,
    testID?: string,
}

export const SingleSwitch = ({text, onPress, value=false, name, noBorder = false, testID}: SingleSwitchProps ) => {
    const handleChange = () => {
        onPress(name as SettingName);
    };
    return (
         <SplitContainer onPress={handleChange} style={[tyyli.single, !noBorder && tyyli.withBorder]}>
            <Text style={tyyli.text}>{text}</Text>
            <Switch value={Boolean(value)} onValueChange={handleChange} testID={testID} />
        </SplitContainer>
    );
};

const tyyli = StyleSheet.create({
    text: {
        flexShrink: 1,
        marginRight: 10,
    },
    single: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        maxWidth: '100%'
    },
    withBorder: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.3)'
    }
});
