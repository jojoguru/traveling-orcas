import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import TabNavigation from '@/components/TabNavigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getInitialLanguage } from '@/lib/i18n/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Traveling Orcas',
  description: 'Follow the journey of our traveling orcas',
  icons: {
    icon: '/orca-96.png',
    apple: '/orca-96.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLang = getInitialLanguage();
  
  return (
    <html lang={initialLang}>
      <body className={`${inter.className} bg-primary-light min-h-screen`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-background-blue to-primary-light pb-[76px]">
            <LanguageSwitcher />
            <main className="max-w-4xl mx-auto px-4 pt-16">
              {children}
            </main>
          </div>
          <TabNavigation />
        </Providers>
      </body>
    </html>
  );
}
