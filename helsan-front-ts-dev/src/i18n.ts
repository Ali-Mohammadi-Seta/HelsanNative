import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslationMessages from "./translation/en.json";
import faTranslationMessages from "./translation/fa.json";

const resources = {
  en: { translation: enTranslationMessages },
  fa: { translation: faTranslationMessages },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "fa",

    // keySeparator: false, // we do not use keys in form messages.welcome
    fallbackLng: "fa",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
