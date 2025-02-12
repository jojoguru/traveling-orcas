'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCodeIcon, MapIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n/client';

export default function TabNavigation() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [addEntryHref, setAddEntryHref] = useState('/add');

  useEffect(() => {
    const orcaId = sessionStorage.getItem('orcaId');
    if (orcaId) {
      setAddEntryHref(`/add?orca=${orcaId}`);
    }
  }, []);

  // Hide navigation on auth pages
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  const tabs = [
    { name: t('navigation.addEntry'), href: addEntryHref, icon: QrCodeIcon },
    { name: t('navigation.logbook'), href: '/', icon: BookOpenIcon },
    { name: t('navigation.map'), href: '/map', icon: MapIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area">
      <div className="max-w-md mx-auto px-4">
        <nav className="flex justify-between items-center">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center py-3 px-6 text-sm font-medium ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-6 w-6" />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 
