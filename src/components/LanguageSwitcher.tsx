'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  kk: { name: 'Kölsch', flag: '🔴' },
} as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const currentIndex = Object.keys(languages).indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % Object.keys(languages).length;
    const nextLang = Object.keys(languages)[nextIndex];
    i18n.changeLanguage(nextLang);
    localStorage.setItem('preferredLanguage', nextLang);
  };

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) {
    return null;
  }

  const nextLang = languages[
    Object.keys(languages)[
      (Object.keys(languages).indexOf(i18n.language) + 1) % Object.keys(languages).length
    ] as keyof typeof languages
  ];

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
      aria-label={`Switch to ${nextLang.name}`}
    >
      <span className="text-lg">
        {nextLang.flag}
      </span>
    </button>
  );
} 