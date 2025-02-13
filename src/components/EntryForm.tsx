'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n/client';
import { useCreateEntry, useEntryCountByOrca } from '@/lib/hooks/useEntries';
import { useStore } from '@/lib/store/useStore';
import { GeocodingResult } from '@/lib/types/geocoding';
import Image from 'next/image';
import { LocationSelect } from './LocationSelect';
import { PhotoUpload } from './PhotoUpload';

export default function EntryForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [orcaId, setOrcaId] = useState<string>('');
  const [location, setLocation] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null);
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    company?: string;
    location?: string;
    message?: string;
    photo?: string;
    submit?: string;
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const createEntry = useCreateEntry();
  const { data: entryCount = 0 } = useEntryCountByOrca(orcaId);
  const isSubmitting = useStore((state) => state.isSubmitting);

  // Handle orcaId from URL or sessionStorage
  useEffect(() => {
    const urlOrcaId = searchParams.get('orca');
    if (urlOrcaId) {
      setOrcaId(urlOrcaId);
      sessionStorage.setItem('orcaId', urlOrcaId);
    } else {
      const storedOrcaId = sessionStorage.getItem('orcaId');
      if (storedOrcaId) {
        setOrcaId(storedOrcaId);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleLocationSelect = (result: GeocodingResult) => {
    setSelectedLocation(result);
    setLocation(result.display_name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setShowSuccess(false);

    const newErrors: typeof errors = {};

    if (!name) newErrors.name = t('errors.required');
    if (!company) newErrors.company = t('errors.required');
    if (!location) newErrors.location = t('errors.required');
    if (!message) newErrors.message = t('errors.required');
    if (!photo) newErrors.photo = t('errors.required');
    if (!selectedLocation) newErrors.location = t('errors.required');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (!photo || !selectedLocation) return;

      await createEntry.mutateAsync({
        name,
        company,
        orcaId,
        location,
        message,
        photo,
        coordinates: {
          latitude: parseFloat(selectedLocation.lat),
          longitude: parseFloat(selectedLocation.lon),
        },
      });

      setShowSuccess(true);
      
      // Wait for animation to complete before redirecting
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/');
      }, 1500);

      // Reset form
      setName('');
      setCompany('');
      setLocation('');
      setLocationSearch('');
      setSelectedLocation(null);
      setMessage('');
      setPhoto(null);
      setErrors({});
    } catch (err) {
      setErrors({ submit: t('errors.submit') });
      console.error(err);
    }
  };

  const getEntryMessage = (count: number) => {
    const nextCount = count + 1; // Since this will be the next entry
    if (nextCount === 1) return t('welcome.firstEntry');
    if (nextCount === 2) return t('welcome.secondEntry');
    if (nextCount === 3) return t('welcome.thirdEntry');
    return t('welcome.nthEntry', { count: nextCount });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-glass rounded-lg w-full"></div>
        <div className="h-10 bg-glass rounded-lg w-full"></div>
        <div className="h-10 bg-glass rounded-lg w-full"></div>
        <div className="h-32 bg-glass rounded-lg w-full"></div>
        <div className="h-48 bg-glass rounded-lg w-full"></div>
        <div className="h-12 bg-glass rounded-lg w-full"></div>
      </div>
    );
  }

  if (!orcaId) {
    return (
      <div className="glass-card p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-400">
              Invalid ORCA ID
            </h3>
            <p className="mt-2 text-sm text-red-300">
              No ORCA ID provided. Please scan the QR code on your ORCA figure.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative">
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark/80 backdrop-blur-sm z-50 animate-fade-in rounded-xl">
          <div className="rounded-full bg-green-500/20 p-4 animate-success">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="text-center space-y-4 mb-8">
        <h1 className="text-2xl font-bold text-white">{t('welcome.thanks')}</h1>
        <p className="text-xl text-white/90">{getEntryMessage(entryCount)}</p>
        <div className="relative">
          <div className="glass-card w-64 h-64 mx-auto relative overflow-hidden rounded-full">
            <div className="absolute inset-0">
              <Image
                src="/orca1.svg"
                alt="Orca"
                fill
                className="object-contain"
                sizes="256px"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex justify-center items-center p-4 bg-black/30 backdrop-blur-sm">
              <span className="text-2xl font-serif italic font-medium text-white">
                {orcaId.charAt(0).toUpperCase() + orcaId.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xl text-white/90">{t('welcome.caught')}</p>
        <p className="text-white/70 mt-8">
          {t('welcome.shareWorld')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-white/90">
            {t('form.name')}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`glass-input w-full ${errors.name ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="company" className="block text-sm font-medium text-white/90">
            {t('form.company')}
          </label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={`glass-input w-full ${errors.company ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-400">{errors.company}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-white/90">
            {t('form.location')}
          </label>
          <LocationSelect
            value={locationSearch}
            onChange={setLocationSearch}
            onLocationSelect={handleLocationSelect}
            error={errors.location}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-white/90">
            {t('form.message')}
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className={`glass-input w-full ${errors.message ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-400">{errors.message}</p>
          )}
        </div>

        <PhotoUpload
          photo={photo}
          onChange={setPhoto}
          error={errors.photo}
          disabled={isSubmitting}
          orcaName={orcaId.charAt(0).toUpperCase() + orcaId.slice(1)}
        />

        {errors.submit && (
          <p className="text-red-400 text-sm">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="glass-button w-full py-3 text-lg font-medium"
        >
          {isSubmitting ? t('form.uploading') : t('form.submit')}
        </button>
      </div>
    </form>
  );
} 