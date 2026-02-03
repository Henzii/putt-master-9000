import React, { FC, useEffect, useState } from "react";
import { RadioButton, Text } from "react-native-paper";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Stack from "@components/Stack";
import {
  AUTO_LANGUAGE,
  getDeviceLanguage,
  getUserLanguagePreference,
  setUserLanguage,
  SupportedLanguage,
} from "../../localization/i18n";

type LanguagePreference = SupportedLanguage | "auto";

const Language: FC = () => {
  const { t } = useTranslation();
  const [preference, setPreference] = useState<LanguagePreference>(AUTO_LANGUAGE);

  useEffect(() => {
    getUserLanguagePreference().then(setPreference);
  }, []);

  const handleLanguageChange = async (newPreference: LanguagePreference) => {
    setPreference(newPreference);
    await setUserLanguage(newPreference);
  };

  const deviceLanguage = getDeviceLanguage();
  const deviceLanguageLabel =
    deviceLanguage === "fi"
      ? t("screens.settings.languageFinnish")
      : t("screens.settings.languageEnglish");

  return (
    <View>
      <Text variant="titleMedium">{t("screens.settings.languageTitle")}</Text>
      <Stack direction="row" alignItems="center">
        <RadioButton
          value="auto"
          onPress={() => handleLanguageChange(AUTO_LANGUAGE)}
          status={preference === AUTO_LANGUAGE ? "checked" : "unchecked"}
        />
        <Text>
          {t("screens.settings.languageAuto")} ({deviceLanguageLabel})
        </Text>
      </Stack>
      <Stack direction="row" alignItems="center">
        <RadioButton
          value="en"
          onPress={() => handleLanguageChange("en")}
          status={preference === "en" ? "checked" : "unchecked"}
        />
        <Text>{t("screens.settings.languageEnglish")}</Text>
      </Stack>
      <Stack direction="row" alignItems="center">
        <RadioButton
          value="fi"
          onPress={() => handleLanguageChange("fi")}
          status={preference === "fi" ? "checked" : "unchecked"}
        />
        <Text>{t("screens.settings.languageFinnish")}</Text>
      </Stack>
    </View>
  );
};

export default Language;
