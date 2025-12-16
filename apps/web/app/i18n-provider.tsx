"use client";

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { useEffect } from 'react';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to update document direction and language
    const updateDocumentAttributes = () => {
      if (typeof window !== 'undefined') {
        const lang = i18n.language || 'en';
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
      }
    };

    // Set initial attributes
    updateDocumentAttributes();

    // Listen for language changes
    i18n.on('languageChanged', updateDocumentAttributes);

    // Cleanup: remove listener on unmount
    return () => {
      i18n.off('languageChanged', updateDocumentAttributes);
    };
  }, []); // Empty deps is fine here - we're setting up event listeners
  
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
