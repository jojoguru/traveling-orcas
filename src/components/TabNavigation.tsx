'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { QrCodeIcon, MapIcon, BookOpenIcon, EllipsisVerticalIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import '@/lib/i18n/client';

export default function TabNavigation() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [addEntryHref, setAddEntryHref] = useState('/add');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orcaId = sessionStorage.getItem('orcaId');
    if (orcaId) {
      setAddEntryHref(`/add?orca=${orcaId}`);
    }

    // Close options when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear session cookie
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login page even if the logout request fails
      router.push('/auth/login');
    }
  };

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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <nav className="bg-glass backdrop-blur-2xl border-t border-glass-border py-2">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative flex items-center justify-center">
            {/* Navigation Items - Centered */}
            <div className="flex items-center justify-center space-x-12">
              {tabs.map((tab) => {
                // Compare only the pathname part without query parameters
                const isActive = pathname === tab.href.split('?')[0];
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-glass-hover text-white'
                        : 'text-white/50 hover:text-white hover:bg-glass-hover'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </Link>
                );
              })}
            </div>

            {/* Options Menu - Right Aligned */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2" ref={optionsRef}>
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isOptionsOpen
                    ? 'bg-glass-hover text-white'
                    : 'text-white/50 hover:text-white hover:bg-glass-hover'
                }`}
                aria-label="Options menu"
                aria-expanded={isOptionsOpen}
              >
                <EllipsisVerticalIcon className="h-6 w-6" />
              </button>

              {isOptionsOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-48">
                  <div className="glass-card p-2">
                    <div className="mb-2 px-3 py-2 text-xs font-medium text-white/50 uppercase">
                      {t('common.language')}
                    </div>
                    <div className="px-2">
                      <LanguageSwitcher />
                    </div>
                    <div className="h-px bg-glass-border my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left flex items-center space-x-3 rounded hover:bg-glass-hover transition-colors text-white/70 hover:text-white"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span className="font-medium text-sm">{t('auth.signOut')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
} 
