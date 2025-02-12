import Image from 'next/image';
import { Entry } from '@/lib/supabase/types';
import Link from 'next/link';
import { useState } from 'react';
import { ImageModal } from './ImageModal';
import { useTranslation } from 'react-i18next';

interface EntryCardProps {
  entry: Entry;
  onClick: (entry: Entry) => void;
}

export function EntryCard({ entry, onClick }: EntryCardProps) {
  const { t, i18n } = useTranslation();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const date = new Date(entry.created_at);
  const formattedDate = date.toLocaleDateString(i18n.language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' ' + t('common.time');

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
        onClick={() => onClick(entry)}
      >
        <div className="p-4 space-y-3">
          <div className="text-gray-500 text-sm">
            {formattedDate}
          </div>
          
          <div>
            <h3 className="text-xl">
              <span className="font-semibold">{entry.name}</span>
              {entry.company && (
                <span className="text-gray-600">, {entry.company}</span>
              )}
            </h3>
          </div>

          <div className="flex items-start space-x-2">
            <div className="text-primary flex-shrink-0">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"/>
              </svg>
            </div>
            <Link 
              href={`https://maps.google.com/?q=${entry.location}`}
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
              aria-label={t('entry.viewOnMap', { location: entry.location })}
            >
              {entry.location}
            </Link>
          </div>

          <div 
            className="relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              setIsImageModalOpen(true);
            }}
          >
            <Image
              src={entry.photo_url}
              alt={t('entry.photoFrom', { location: entry.location })}
              fill
              className="object-cover"
            />
          </div>

          <p className="text-lg">
            {entry.message}
          </p>
        </div>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={entry.photo_url}
        alt={t('entry.photoFrom', { location: entry.location })}
      />
    </>
  );
} 