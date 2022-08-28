import React from "react";
import { Text } from "react-native";
import { Switch } from "react-native-paper";
import useLocalSettings from "../hooks/useLocalSettings";
import Container from "./ThemedComponents/Container";
import SplitContainer from "./ThemedComponents/SplitContainer";

export default function LocalSettings() {
    const settings = useLocalSettings();
    return (
        <Container>
            <SingleSwitch text="Sort summary by HC" onPress={settings.toggle} getValue={settings.getBoolValue} name="sortHC" />
            <SingleSwitch text="Sort scorecards by box order" onPress={settings.toggle} getValue={settings.getBoolValue} name="sortBox" />
            <SingleSwitch text="Go to first incomplete scorecard tab on load" onPress={settings.toggle} getValue={settings.getBoolValue} name="autoAdvance" />
            <SingleSwitch text="Prohibition" onPress={settings.toggle} getValue={settings.getBoolValue} name="prohibition" />
        </Container>
    );
}

const SingleSwitch = ({text, onPress, getValue, name} : {text: string, getValue: (name: string) => boolean, onPress: (name: string) => void, name: string}) => {
    const handleChange = () => {
        onPress(name);
    };
    return (
         <SplitContainer onPress={handleChange}>
            <Text>{text}</Text>
            <Switch value={getValue(name)} onValueChange={handleChange} />
        </SplitContainer>
    );
};
