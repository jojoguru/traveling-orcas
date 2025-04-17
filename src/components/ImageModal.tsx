import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-256px)]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export function ImageModal({ isOpen, onClose, imageUrl, alt }: ImageModalProps) {
  const { t } = useTranslation();
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

      {/* Full-screen container */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 p-2"
          aria-label={t('common.close')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image container with aspect ratio preservation */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-auto h-auto">
            {isLoading && (
              <Loading />
            )}
            <Image
              src={imageUrl}
              alt={alt}
              className={`object-contain rounded-lg transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              width={dimensions.width}
              height={dimensions.height}
              sizes="90vw"
              priority
              quality={95}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto'
              }}
              onLoadingComplete={(img) => {
                setDimensions({
                  width: img.naturalWidth,
                  height: img.naturalHeight
                });
                setIsLoading(false);
              }}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
} 
