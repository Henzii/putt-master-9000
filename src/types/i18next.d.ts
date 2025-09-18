import en from "src/localization/locales/en.json";

const resources = {
  translation: en
} as const;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof resources
  }
}