'use client';

import dynamic from 'next/dynamic';
import { useEntriesByOrca } from '@/lib/hooks/useEntries';
import { useOrcas } from '@/lib/hooks/useOrcas';
import { useOrcaStore } from '@/lib/store/orca';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectOrcaBox } from '@/components/SelectOrcaBox';
import { Orca } from '@/lib/supabase/types';
import '@/lib/i18n/client';

const DynamicMap = dynamic(
  () => import('@/components/Map'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[calc(100vh-256px)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    ),
    ssr: false
  }
);

export default function MapPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentOrcaId, syncFromUrl, setCurrentOrcaId } = useOrcaStore();
  const { data: entries = [], isLoading: entriesLoading } = useEntriesByOrca(currentOrcaId || '');
  const { orcas, isLoading: orcasLoading } = useOrcas();

  useEffect(() => {
    syncFromUrl();
  }, [syncFromUrl]);

  const selectedOrca = orcas.find(orca => orca.name === currentOrcaId);

  const handleOrcaSelect = (orca: Orca) => {
    if (!orca) return;
    setCurrentOrcaId(orca.name);
    router.push(`/map?orca=${orca.name}`);
  };

  const isLoading = entriesLoading || orcasLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-256px)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const renderContent = () => {
    if (!currentOrcaId) {
      return (
        <div className="rounded-lg bg-glass p-4 text-center text-white/70 h-[calc(100vh-320px)] flex items-center justify-center">
          {t('logbook.noOrcaSelected')}
        </div>
      );
    }

    if (!entries.length) {
      return (
        <div className="rounded-lg bg-glass p-4 text-center text-white/70 h-[calc(100vh-320px)] flex items-center justify-center">
          {t('logbook.noEntries')}
        </div>
      );
    }

    return <DynamicMap entries={entries} />;
  };

  return (
    <div className="space-y-6">
      <SelectOrcaBox
        orcas={orcas}
        selectedOrca={selectedOrca}
        onSelect={handleOrcaSelect}
      />
      {renderContent()}
    </div>
  );
} 