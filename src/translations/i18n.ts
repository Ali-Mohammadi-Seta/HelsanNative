// src/translations/i18n.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import fa from './fa.json';

const LANGUAGE_STORAGE_KEY = '@app_language';

const resources = {
  fa: { translation: fa },
  en: { translation: en },
};

// ✅ ALWAYS default to Persian (fa)
const defaultLanguage = 'fa';

// Initialize i18n synchronously with Persian as default
i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage, // ✅ Changed to always be 'fa'
  fallbackLng: 'fa', // ✅ Changed fallback to Persian instead of English
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Restore the preference before rendering. A deferred read could otherwise
// overwrite a language the user has just selected.
export const initializeLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'fa' || savedLanguage === 'en') {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.log('Could not load saved language:', error);
  }
};

export const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  await i18n.changeLanguage(lang);
};

export default i18n;
