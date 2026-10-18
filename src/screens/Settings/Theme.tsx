import React, { FC } from "react";
import { Pressable, View } from "react-native";
import { RadioButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ThemePreference, useChangeTheme } from "src/context/ThemeProvider";
import { useSettings } from "@components/LocalSettingsProvider";

const Theme: FC = () => {
    const { t } = useTranslation();
    const settings = useSettings();
    const changeTheme = useChangeTheme();
    const preference = settings.getValue('Theme') || 'auto';

    const labels = {
        auto: t("screens.settings.themeAuto"),
        light: t("screens.settings.themeLight"),
        dark: t("screens.settings.themeDark"),
    };

    const handlePreferenceChange = (newPreference: ThemePreference) => {
        settings.setValue('Theme', newPreference);
        changeTheme(newPreference);
    };

    return (
        <View>
            <Text variant="titleMedium">{t("screens.settings.themeTitle")}</Text>
            {(['auto', 'light', 'dark'] as const).map(option => (
                <Pressable
                    key={option}
                    onPress={() => handlePreferenceChange(option)}
                    testID={`themePreference-${option}`}
                    style={{ flexDirection: "row", alignItems: "center" }}
                >
                    <RadioButton value={option} status={preference === option ? "checked" : "unchecked"} />
                    <Text>{labels[option]}</Text>
                </Pressable>
            ))}
        </View>
    );
};

export default Theme;
