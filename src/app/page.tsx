import { Suspense } from 'react';
import Logbook from '@/components/Logbook';

export default function LogbookPage() {
  return (
      <Suspense
        fallback={
          <div className="h-[600px] animate-pulse bg-gray-100 rounded-lg" />
        }
      >
        <Logbook />
      </Suspense>
  );
}
