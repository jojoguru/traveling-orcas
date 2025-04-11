'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n/client';
import { useEntriesByOrca } from '@/lib/hooks/useEntries';
import { useOrcas } from '@/lib/hooks/useOrcas';
import { useStore } from '@/lib/store/useStore';
import { Entry, Orca } from '@/lib/supabase/types';
import { EntryCard } from './EntryCard';
import { useOrcaStore } from '@/lib/store/orca';
import { useRouter } from 'next/navigation';
import { SelectOrcaBox } from './SelectOrcaBox';

export default function Logbook() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentOrcaId, syncFromUrl, setCurrentOrcaId } = useOrcaStore();
  const { data: entries, isLoading: entriesLoading, error } = useEntriesByOrca(currentOrcaId || '');
  const { orcas, isLoading: orcasLoading } = useOrcas();
  const setSelectedEntry = useStore((state) => state.setSelectedEntry);

  useEffect(() => {
    syncFromUrl();
  }, [syncFromUrl]);

  const selectedOrca = orcas.find(orca => orca.name === currentOrcaId);

  const handleOrcaSelect = (orca: Orca) => {
    if (!orca) {
      return;
    }
    setCurrentOrcaId(orca.name);
    router.push(`/logbook?orca=${orca.name}`);
  };

  return (
    <div className="space-y-6">
      <SelectOrcaBox
        orcas={orcas}
        selectedOrca={selectedOrca}
        onSelect={handleOrcaSelect}
      />
      {(orcasLoading || entriesLoading) && (
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-glass h-48 rounded-lg" />
          ))}
        </div>
      )}

      {entriesLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-glass p-4 text-center text-white/70">
          {t('logbook.error')}
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {entries.map((entry: Entry) => (
              <EntryCard
              key={entry.id}
              entry={entry}
              onClick={() => setSelectedEntry(entry)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-glass p-4 text-center text-white/70">
          {currentOrcaId
            ? t('logbook.noEntries')
            : t('logbook.noOrcaSelected')}
        </div>
      )}
    </div>
  );
} 