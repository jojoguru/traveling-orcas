'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  kk: { name: 'Kölsch', flag: '⛪️' },
} as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageSelect = (lang: keyof typeof languages) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-1">
      {Object.entries(languages).map(([lang, info]) => (
        <button
          key={lang}
          onClick={() => handleLanguageSelect(lang as keyof typeof languages)}
          className={`w-full px-3 py-2 text-left flex items-center space-x-3 rounded hover:bg-glass-hover transition-colors ${
            lang === i18n.language ? 'bg-primary/5 text-primary' : 'text-white/70'
          }`}
        >
          <span className="text-lg">{info.flag}</span>
          <span className="font-medium text-sm">{info.name}</span>
          {lang === i18n.language && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
} 