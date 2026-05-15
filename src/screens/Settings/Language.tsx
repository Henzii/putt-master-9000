import React, { FC, useEffect, useState } from "react";
import { Button, Menu, Text } from "react-native-paper";
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
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    getUserLanguagePreference().then(setPreference);
  }, []);

  const handleLanguageChange = async (newPreference: LanguagePreference) => {
    setPreference(newPreference);
    await setUserLanguage(newPreference);
    setMenuVisible(false);
  };

  const getPreferenceLabel = (pref: LanguagePreference): string => {
    if (pref === AUTO_LANGUAGE) {
      const deviceLanguage = getDeviceLanguage();
      const deviceLanguageLabel =
        deviceLanguage === "fi"
          ? t("screens.settings.languageFinnish")
          : deviceLanguage === "sv"
          ? t("screens.settings.languageSwedish")
          : deviceLanguage === "et"
          ? t("screens.settings.languageEstonian")
          : deviceLanguage === "pl"
          ? t("screens.settings.languagePolish")
          : deviceLanguage === "de"
          ? t("screens.settings.languageGerman")
          : t("screens.settings.languageEnglish");
      return `${t("screens.settings.languageAuto")} (${deviceLanguageLabel})`;
    }

    const languageMap: Record<string, string> = {
      en: t("screens.settings.languageEnglish"),
      fi: t("screens.settings.languageFinnish"),
      sv: t("screens.settings.languageSwedish"),
      et: t("screens.settings.languageEstonian"),
      pl: t("screens.settings.languagePolish"),
      de: t("screens.settings.languageGerman"),
    };

    return languageMap[pref] || pref;
  };

  return (
    <View>
      <Text variant="titleMedium">{t("screens.settings.languageTitle")}</Text>
      <Stack direction="row" alignItems="center" style={{ marginTop: 16 }}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={{ flex: 1 }}
              icon="chevron-down"
              contentStyle={{flexDirection: "row-reverse" }}
              testID="languageMenuButton"
            >
              {getPreferenceLabel(preference)}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => handleLanguageChange(AUTO_LANGUAGE)}
            title={getPreferenceLabel(AUTO_LANGUAGE)}
            leadingIcon={preference === AUTO_LANGUAGE ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleLanguageChange("en")}
            title={t("screens.settings.languageEnglish")}
            leadingIcon={preference === "en" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleLanguageChange("fi")}
            title={t("screens.settings.languageFinnish")}
            leadingIcon={preference === "fi" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleLanguageChange("sv")}
            title={t("screens.settings.languageSwedish")}
            leadingIcon={preference === "sv" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleLanguageChange("et")}
            title={t("screens.settings.languageEstonian")}
            leadingIcon={preference === "et" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleLanguageChange("pl")}
            title={t("screens.settings.languagePolish")}
            leadingIcon={preference === "pl" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleLanguageChange("de")}
            title={t("screens.settings.languageGerman")}
            leadingIcon={preference === "de" ? "check" : undefined}
          />
        </Menu>
      </Stack>
    </View>
  );
};

export default Language;
