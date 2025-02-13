'use client';

import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n/client';

export default function MapPage() {
  const { t } = useTranslation();
  
  const Map = dynamic(
    () => import('@/components/Map'),
    {
      loading: () => (
        <div className="h-[400px] w-full rounded-lg bg-gray-100 animate-pulse flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
        </div>
      ),
      ssr: false
    }
  );

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t('map.title')}</h2>
        <Map />
      </div>
    </div>
  );
} 