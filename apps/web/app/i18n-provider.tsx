"use client";

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { useEffect } from 'react';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set document direction based on language
    if (typeof window !== 'undefined') {
      const lang = i18n.language || 'en';
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
    }
  }, []);
  
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
