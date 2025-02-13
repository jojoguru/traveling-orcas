'use client';

import dynamic from 'next/dynamic';
import '@/lib/i18n/client';

export default function MapPage() {
  const Map = dynamic(
    () => import('@/components/Map'),
    {
      loading: () => (
          <p className="text-gray-500">Loading map...</p>
      ),
      ssr: false
    }
  );

  return (
      <div className="space-y-4">
        <Map />
      </div>
  );
} 