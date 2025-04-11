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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange(file);
    }
  };

  const renderUploadButtons = () => (
    <div className="flex gap-3 mt-4">
      <label
        htmlFor="gallery-upload"
        className="glass-button min-h-[44px] flex-1 py-2.5 px-3 text-center block cursor-pointer active:scale-95 transition-transform"
      >
        <span className="flex flex-col items-center justify-center gap-1.5 text-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('form.gallery')}
        </span>
        <input
          id="gallery-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          disabled={disabled}
        />
      </label>
      <label
        htmlFor="camera-upload"
        className="glass-button min-h-[44px] flex-1 py-2.5 px-3 text-center block cursor-pointer active:scale-95 transition-transform"
      >
        <span className="flex flex-col items-center justify-center gap-1.5 text-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t('form.camera')}
        </span>
        <input
          id="camera-upload"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="sr-only"
          disabled={disabled}
        />
      </label>
    </div>
  );

  return (
    <div className="space-y-2">
      <label htmlFor="photo" className="block text-sm font-medium text-white/90">
        Photo
      </label>
      {photo ? (
        <div className={`block transition-colors ${error ? 'border-red-500' : 'glass-card'}`}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg group">
            <Image
              src={URL.createObjectURL(photo)}
              alt="Preview"
              fill
              className="object-cover"
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(photo))}
            />
            <button
              onClick={() => onChange(null)}
              disabled={disabled}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/90 hover:bg-black/70 transition-colors group-hover:opacity-100 opacity-0"
              type="button"
              aria-label={t('form.removePhoto')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className={`block transition-colors ${error ? 'border-red-500' : 'glass-card'}`}>
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
              <p className="text-sm text-white/90">
                {t('form.uploadPhoto', { name: orcaName })}
              </p>
              <p className="text-xs text-white/50">{t('form.photoFormats')}</p>
              {renderUploadButtons()}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
} 