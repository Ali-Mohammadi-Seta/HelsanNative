// src/translations/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fa from './fa.json';
import en from './en.json';

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

// Load saved language asynchronously (user preference takes priority)
AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((savedLanguage) => {
  if (savedLanguage && (savedLanguage === 'fa' || savedLanguage === 'en')) {
    i18n.changeLanguage(savedLanguage);
  }
});

export const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  await i18n.changeLanguage(lang);
};

export default i18n;