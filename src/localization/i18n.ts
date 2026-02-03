import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import fi from "./locales/fi.json";

// Constants
export const SUPPORTED_LANGUAGES = ["en", "fi"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const LANGUAGE_STORAGE_KEY = "userLanguage";
export const AUTO_LANGUAGE = "auto";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fi: { translation: fi },
  },
  defaultNS: "translation",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Helper: Get device language (fallback to 'en')
export const getDeviceLanguage = (): SupportedLanguage => {
  const locales = Localization.getLocales();
  const deviceLang = locales[0]?.languageCode;
  if (
    deviceLang &&
    SUPPORTED_LANGUAGES.includes(deviceLang as SupportedLanguage)
  ) {
    return deviceLang as SupportedLanguage;
  }
  return "en";
};

// Initialize language from storage/device (call on app start)
export const initializeLanguage = async (): Promise<void> => {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  let language: SupportedLanguage;

  if (stored === AUTO_LANGUAGE || stored === null) {
    language = getDeviceLanguage();
  } else if (SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    language = stored as SupportedLanguage;
  } else {
    language = "en";
  }

  if (i18n.language !== language) {
    await i18n.changeLanguage(language);
  }
};

// Set user language preference and apply it
export const setUserLanguage = async (
  language: SupportedLanguage | "auto"
): Promise<void> => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  const actualLanguage =
    language === AUTO_LANGUAGE ? getDeviceLanguage() : language;
  await i18n.changeLanguage(actualLanguage);
};

// Get stored preference ('auto' or specific language)
export const getUserLanguagePreference = async (): Promise<
  SupportedLanguage | "auto"
> => {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === AUTO_LANGUAGE) return AUTO_LANGUAGE;
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }
  return AUTO_LANGUAGE;
};

export default i18n;
