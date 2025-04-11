import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Orca } from '@/lib/supabase/types';
import Image from 'next/image';

interface SelectOrcaBoxProps {
  orcas: Orca[];
  selectedOrca: Orca | undefined;
  onSelect: (orca: Orca) => void;
}

const defaultOrca: Orca = {
  name: '',
  created_at: new Date().toISOString(),
};

export function SelectOrcaBox({ orcas, selectedOrca, onSelect }: SelectOrcaBoxProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filteredOrcas = query === ''
    ? orcas
    : orcas.filter((orca) =>
        orca.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      );

  return (
    <div className="relative w-full">
      <Combobox value={selectedOrca || defaultOrca} onChange={onSelect}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-glass text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Image
                src="/bb-orcas/orca-round-right.svg"
                alt="Orca icon"
                width={24}
                height={24}
                className="text-white/60"
              />
            </div>
            <ComboboxInput
              className="w-full border-none py-2 pl-12 pr-10 text-xl leading-5 bg-transparent text-white focus:ring-0"
              displayValue={(orca: Orca) => orca?.name ?? ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('logbook.selectOrca')}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-white/60"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1a1a1a] py-1 text-base border border-white/10 focus:outline-none sm:text-sm z-[1000]">
            {filteredOrcas.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none px-4 py-2 text-white/70">
                {t('logbook.noResults')}
              </div>
            ) : (
              filteredOrcas.map((orca) => (
                <ComboboxOption
                  key={orca.name}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary/20 text-white' : 'text-white/70'
                    }`
                  }
                  value={orca}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {orca.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-primary'
                          }`}
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
} 