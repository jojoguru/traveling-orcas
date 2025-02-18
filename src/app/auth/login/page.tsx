'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 403) {
        setError(t('auth.errors.emailNotAllowed'));
        return;
      }

      if (!response.ok) {
        setError(data.error || t('errors.auth.failed'));
        return;
      }

      // Store email for verification page
      sessionStorage.setItem('auth_email', email);
      sessionStorage.setItem('auth_callback', callbackUrl);

      // Redirect to verify page
      window.location.href = '/auth/verify';
    } catch (err) {
      setError(t('errors.auth.unknown'));
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative">
      {/* Language Switcher Dropdown - Top Right */}
      <div className="absolute top-4 right-4">
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="glass-button p-2"
            aria-label="Toggle language menu"
          >
            <GlobeAltIcon className="h-6 w-6" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-48">
              <div className="glass-card p-2">
                <div className="mb-2 px-3 py-2 text-xs font-medium text-white/50 uppercase">
                  {t('common.language')}
                </div>
                <div className="px-2">
                  <LanguageSwitcher onSelect={() => setIsLangOpen(false)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">
            {t('auth.signIn')}
          </h1>
          <p className="mt-2 text-white/70">
            {t('auth.emailInstructions')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/90">
              {t('form.email')}
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="glass-input w-full pr-4 py-3 text-white placeholder-white/30 bg-glass backdrop-blur-xl"
                style={{ WebkitAppearance: 'none' }}
                placeholder="name@timetoact-group.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="glass-card border-red-500/50 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="glass-button w-full py-3 text-lg font-medium disabled:opacity-50"
          >
            {isLoading ? t('auth.sending') : t('auth.continue')}
          </button>
        </form>
      </div>
    </div>
  );
}

// Loading fallback component
function LoginLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="h-8 bg-glass rounded-lg w-48 mx-auto"></div>
          <div className="h-4 bg-glass rounded-lg w-64 mx-auto"></div>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-glass rounded-lg w-full"></div>
          <div className="h-12 bg-glass rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
} 