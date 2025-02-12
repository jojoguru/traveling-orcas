'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n/client';
import { useEntriesByOrca } from '@/lib/hooks/useEntries';
import { useStore } from '@/lib/store/useStore';
import { Entry } from '@/lib/supabase/types';
import { EntryCard } from './EntryCard';

export default function Logbook() {
  const { t } = useTranslation();
  const [currentOrcaId, setCurrentOrcaId] = useState<string | null>(null);
  const { data: entries, isLoading, error } = useEntriesByOrca(currentOrcaId || '');
  const setSelectedEntry = useStore((state) => state.setSelectedEntry);

  useEffect(() => {
    const orcaId = sessionStorage.getItem('orcaId');
    setCurrentOrcaId(orcaId);
  }, []);

  // If no orca is selected, show a message
  if (!currentOrcaId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-gray-500">{t('logbook.noOrcaSelected')}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-text">{t('logbook.title')}</h2>
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600 text-sm">
        Error loading entries: {error.message}
      </div>
    );
  }

  if (!entries?.length) {
    return (
      <div className="text-text-light text-center py-12 bg-gray-50 rounded-lg">
        {t('logbook.empty')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text">{t('logbook.title')}</h2>
      <div className="space-y-6">
        {entries?.map((entry: Entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onClick={setSelectedEntry}
          />
        ))}
      </div>
    </div>
  );
} 