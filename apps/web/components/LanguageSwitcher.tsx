"use client";

import { useTranslation } from 'react-i18next';

const options = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'AR' },
  { code: 'ru', label: 'RU' },
  { code: 'it', label: 'IT' },
  { code: 'ml', label: 'ML' },
  { code: 'hi', label: 'HI' },
  { code: 'sw', label: 'SW' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select
      className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm"
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      {options.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
    </select>
  );
}

