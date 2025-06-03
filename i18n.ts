// i18n.ts
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// point at your actual JSON files
import commonEN from './public/locales/en/common.json';
import commonZH from './public/locales/zh/common.json';

// Get initial language from localStorage or default to 'en'
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: commonEN },
      zh: { common: commonZH },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    ns: ['common'],         // we only have one namespace
    defaultNS: 'common',    // make it the default
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
  });

// Add language change listener
if (typeof window !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
  });
}

export default i18n;
