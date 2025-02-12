import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface PhotoUploadProps {
  photo: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export function PhotoUpload({ photo, onChange, error, disabled }: PhotoUploadProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      <label htmlFor="photo" className="block text-sm font-medium text-text">
        Photo
      </label>
      <label
        htmlFor="photo"
        className={`mt-1 block border-2 rounded-lg transition-colors cursor-pointer ${
          error ? 'border-red-500' : photo ? 'border-gray-200' : 'border-dashed border-gray-200 hover:border-primary'
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
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:bg-black/50">
              <span className="px-8 py-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-sm">
                {t('form.uploadDifferentPhoto')}
              </span>
            </div>
          </div>
        ) : (
          <div className="px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              <svg
                className={`mx-auto h-12 w-12 ${error ? 'text-red-400' : 'text-gray-400'}`}
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
              <div className="text-sm text-gray-600">
                <span className="text-primary hover:text-primary-dark">{t('form.uploadPhoto')}</span>
              </div>
              <p className="text-xs text-gray-500">{t('form.photoFormats')}</p>
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
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 