'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

function VerifyForm() {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState<string>('/');
  const [mounted, setMounted] = useState(false);

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

  // Show a simple loading state during SSR/before hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text">
              Enter verification code
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text">
            {t('auth.enterCode')}
          </h2>
          <p className="mt-2 text-center text-sm text-text-light">
            {t('auth.codeInstructions')}
          </p>
          <p className="mt-1 text-center text-sm text-text-light">
            {email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="sr-only">
              {t('form.code')}
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-text focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder={t('form.code')}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading}
              pattern="[0-9]{6}"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:enabled:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('auth.verifying') : t('auth.verify')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Loading fallback component
function VerifyLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text">
            Enter verification code
          </h2>
          <div className="mt-8 space-y-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
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