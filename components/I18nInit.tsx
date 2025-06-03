'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import i18n from '@/i18n';

export default function I18nInit() {
  const pathname = usePathname();           // e.g. "/zh/auth/login"
  const [, locale] = pathname.split('/');   // grabs "zh" or "en"

  useEffect(() => {
    if (locale && ['en', 'zh'].includes(locale)) {
      // Only change language if it's different from current
      if (i18n.language !== locale) {
        i18n.changeLanguage(locale);
        // Update localStorage
        localStorage.setItem('language', locale);
      }
    } else {
      // If no locale in path, use stored language or default to 'en'
      const storedLang = localStorage.getItem('language') || 'en';
      if (i18n.language !== storedLang) {
        i18n.changeLanguage(storedLang);
      }
    }
  }, [locale]);

  useEffect(() => {
    console.log('language changed to', i18n.language);
  }, [i18n.language]);

  return null;
}
