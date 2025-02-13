import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface PhotoUploadProps {
  photo: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
  orcaName: string;
}

export function PhotoUpload({ photo, onChange, error, disabled, orcaName }: PhotoUploadProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <label htmlFor="photo" className="block text-sm font-medium text-white/90">
        Photo
      </label>
      <label
        htmlFor="photo"
        className={`block transition-colors cursor-pointer ${
          error ? 'border-red-500' : photo ? 'glass-card' : 'glass-card hover:border-white/30'
        }`}
      >
        {photo ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg group">
            <Image
              src={URL.createObjectURL(photo)}
              alt="Preview"
              fill
              className="object-cover"
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(photo))}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/60 transition-all duration-200">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm">
                {t('form.uploadDifferentPhoto')}
              </span>
            </div>
          </div>
        ) : (
          <div className="px-6 pt-5 pb-6">
            <div className="space-y-2 text-center">
              <svg
                className={`mx-auto h-12 w-12 ${error ? 'text-red-400' : 'text-white/50'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm">
                <span className="text-white/90 hover:text-white transition-colors">
                  {t('form.uploadPhoto', { name: orcaName })}
                </span>
              </div>
              <p className="text-xs text-white/50">{t('form.photoFormats')}</p>
            </div>
          </div>
        )}
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="sr-only"
          disabled={disabled}
        />
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
} 