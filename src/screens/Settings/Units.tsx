import React, { FC } from "react";
import { RadioButton, Text } from 'react-native-paper';
import { View } from "react-native";
import Stack from "@components/Stack";
import { useSettings } from "@components/LocalSettingsProvider";

const Distance: FC = () => {

    const localSettings = useSettings();
    const isImperial = localSettings.getBoolValue('ImperialUnits');

    const handleRadioButtonPress = () => localSettings.toggle('ImperialUnits');

    return (
        <View>
            <Text variant="titleMedium">Display units</Text>
            <Stack direction="row" alignItems="center">
                <RadioButton value="metric" onPress={handleRadioButtonPress} status={isImperial ? 'unchecked' : 'checked'} />
                <Text>Metric</Text>
            </Stack>
            <Stack direction="row" alignItems="center">
                <RadioButton value="imperial" onPress={handleRadioButtonPress} status={isImperial ? 'checked' : 'unchecked'} />
                <Text>Imperial</Text>
            </Stack>

        </View>
    );
};

export default Distance;
