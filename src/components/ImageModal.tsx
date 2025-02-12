import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, alt }: ImageModalProps) {
  const { t } = useTranslation();
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black" aria-hidden="true" />

      {/* Full-screen container */}
      <div 
        className="fixed inset-0 flex items-center justify-center"
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

        {/* Image container - only as large as needed */}
        <div className="relative w-auto h-auto max-w-[90vw] max-h-[90vh]">
          <Image
            src={imageUrl}
            alt={alt}
            className="object-contain"
            width={1920}
            height={1080}
            sizes="90vw"
            priority
            quality={95}
          />
        </div>
      </div>
    </Dialog>
  );
} 
