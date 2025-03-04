'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

function VerifyForm() {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState<string>('/');
  const [mounted, setMounted] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Get stored email and callback URL
    const storedEmail = sessionStorage.getItem('auth_email');
    const storedCallback = sessionStorage.getItem('auth_callback');

    if (!storedEmail) {
      window.location.href = '/auth/login';
      return;
    }

    setEmail(storedEmail);
    if (storedCallback) {
      setCallbackUrl(storedCallback);
    }
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
    if (!email) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('errors.auth.failed'));
        return;
      }

      // Clear stored auth data
      sessionStorage.removeItem('auth_email');
      sessionStorage.removeItem('auth_callback');

      // Redirect to the callback URL
      window.location.href = callbackUrl;
    } catch (err) {
      setError(t('errors.auth.unknown'));
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!email) {
    return null; // Will redirect in useEffect
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
            <div className="absolute right-0 mt-2 w-48 z-50">
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
            {t('auth.enterCode')}
          </h1>
          <p className="mt-2 text-white/70">
            {t('auth.codeInstructions')}
            <span className="text-white/80 font-light ml-1">
              ({email})
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-white/90">
              {t('form.code')}
            </label>
            <div className="relative">
              <input
                id="code"
                name="code"
                type="text"
                required
                className="glass-input w-full pr-4 py-3 text-white placeholder-white/30 bg-glass backdrop-blur-xl text-center tracking-[0.5em] text-lg"
                style={{ WebkitAppearance: 'none' }}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isLoading}
                pattern="[0-9]{6}"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
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
            disabled={isLoading || code.length !== 6}
            className="glass-button w-full py-3 text-lg font-medium disabled:opacity-50"
          >
            {isLoading ? t('auth.verifying') : t('auth.verify')}
          </button>
        </form>
      </div>
    </div>
  );
}

// Loading fallback component
function VerifyLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="h-8 bg-glass rounded-lg w-48 mx-auto"></div>
          <div className="h-4 bg-glass rounded-lg w-64 mx-auto"></div>
          <div className="h-4 bg-glass rounded-lg w-32 mx-auto"></div>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-glass rounded-lg w-full"></div>
          <div className="h-12 bg-glass rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyForm />
    </Suspense>
  );
} 