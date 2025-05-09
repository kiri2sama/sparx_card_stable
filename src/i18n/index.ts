import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from './locales/en.json';
import es from './locales/es.json';

// Configure i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3', // Add this line to fix compatibility issues
    resources: {
      en: { translation: en },
      es: { translation: es }
      // Add more languages as needed
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false // prevents issues with SSR
    }
  });

export default i18n;