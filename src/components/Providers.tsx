'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next, { initI18n } from '@/lib/i18n/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n().then(() => {
      setIsI18nInitialized(true);
    });
  }, []);

  if (!isI18nInitialized) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18next}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </I18nextProvider>
  );
} 