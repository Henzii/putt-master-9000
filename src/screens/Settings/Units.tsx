import React, { FC } from "react";
import { RadioButton, Text } from 'react-native-paper';
import { View } from "react-native";
import { useTranslation } from 'react-i18next';
import Stack from "@components/Stack";
import { useSettings } from "@components/LocalSettingsProvider";

const Distance: FC = () => {
    const { t } = useTranslation();
    const localSettings = useSettings();
    const isImperial = localSettings.getBoolValue('ImperialUnits');

    const handleRadioButtonPress = () => localSettings.toggle('ImperialUnits');

    return (
        <View>
            <Text variant="titleMedium">{t('screens.settings.displayUnitsTitle')}</Text>
            <Stack direction="row" alignItems="center">
                <RadioButton value="metric" onPress={handleRadioButtonPress} status={isImperial ? 'unchecked' : 'checked'} />
                <Text>{t('screens.settings.metric')}</Text>
            </Stack>
            <Stack direction="row" alignItems="center">
                <RadioButton value="imperial" onPress={handleRadioButtonPress} status={isImperial ? 'checked' : 'unchecked'} />
                <Text>{t('screens.settings.imperial')}</Text>
            </Stack>

        </View>
    );
};

export default Distance;
