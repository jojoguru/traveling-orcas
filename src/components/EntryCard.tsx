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
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
        
        <div
          className="glass-card relative flex flex-col transition-all duration-300 cursor-pointer group/card"
          onClick={() => onClick(entry)}
        >
          <div className="p-4 space-y-3">
            <div className="text-white/60 text-sm">
              {formattedDate}
            </div>
            
            <div>
              <h3 className="text-xl">
                <span className="font-light text-white">{entry.name}</span>
                {entry.company && (
                  <span className="text-white/70 font-light">, {entry.company}</span>
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
                className="text-primary hover:text-primary-light transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label={t('entry.viewOnMap', { location: entry.location })}
              >
                {entry.location}
              </Link>
            </div>

            <div 
              className="relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-zoom-in group/image"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(true);
              }}
            >
              <Image
                src={entry.photo_url}
                alt={t('entry.photoFrom', { location: entry.location })}
                fill
                className="object-cover transition-transform duration-500 group-hover/image:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-colors duration-300"></div>
            </div>

            <p className="text-text font-serif italic font-medium">
              {entry.message}
            </p>
          </div>
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