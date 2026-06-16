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

// Load saved language asynchronously (user preference takes priority)
// Only run in React Native environment (not during SSR/bundling)
if (typeof window !== 'undefined' || typeof globalThis !== 'undefined') {
  // Defer AsyncStorage call to avoid issues during module initialization
  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'fa' || savedLanguage === 'en')) {
        i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      // Silently fail if AsyncStorage is not available
      console.log('Could not load saved language:', error);
    }
  };
  // Use setImmediate or setTimeout to defer the call
  setTimeout(loadSavedLanguage, 0);
}

export const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  await i18n.changeLanguage(lang);
};

export default i18n;
