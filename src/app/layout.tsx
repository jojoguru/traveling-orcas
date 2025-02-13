import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import TabNavigation from '@/components/TabNavigation';
import { getInitialLanguage } from '@/lib/i18n/utils';
import { Suspense } from 'react';
import { OceanBackground } from '@/components/OceanBackground';

export const metadata: Metadata = {
  title: 'Traveling Orcas',
  description: 'Follow the journey of our traveling orcas',
  icons: {
    icon: '/orca-96.png',
    apple: '/orca-96.png',
  },
};

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-glass rounded w-24"></div>
        <div className="h-4 bg-glass rounded w-32"></div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLang = getInitialLanguage();
  
  return (
    <html lang={initialLang}>
      <body className="min-h-screen bg-dark text-white">
        <OceanBackground />
        <Providers>
          <Suspense fallback={<Loading />}>
            <div className="min-h-screen pb-[76px] relative">
              <main className="max-w-4xl mx-auto px-4 pt-16 relative">
                <div className="glass-card p-6">
                  {children}
                </div>
              </main>
            </div>
            <TabNavigation />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
