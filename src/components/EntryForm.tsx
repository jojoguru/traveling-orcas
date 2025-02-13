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
  const { t, i18n } = useTranslation();
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
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-32 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-48 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
      </div>
    );
  }

  if (!orcaId) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Invalid ORCA ID
            </h3>
            <p className="mt-2 text-sm text-red-700">
              No ORCA ID provided. Please scan the QR code on your ORCA figure.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 animate-fade-in">
          <div className="rounded-full bg-green-100 p-4 animate-success">
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
        <h1 className="text-2xl font-bold text-text">{t('welcome.thanks')}</h1>
        <p className="text-xl text-text">{getEntryMessage(entryCount)}</p>
        <div className="relative">
          <div className="bg-primary rounded-full w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
            <Image
              src="/orca1.svg"
              alt="Orca"
              width={80}
              height={80}
              className="bg-primary rounded-full w-64 h-64 mx-auto flex items-center justify-center overflow-hidden"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2">
            <div className="bg-white rounded-full px-4 py-1 shadow-sm mx-auto inline-block">
              <span className="text-lg font-bold font-medium text-text">
                {orcaId.charAt(0).toUpperCase() + orcaId.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xl text-text">eingefangen hat!</p>
        <p className="text-lg text-text-light mt-8">
          {t('welcome.shareWorld')}
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-text">
          {t('form.name')}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 block w-full rounded-lg border-gray-200 shadow-input focus:border-primary focus:ring-primary ${
            errors.name ? 'border-red-500' : ''
          }`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="company" className="block text-sm font-medium text-text">
          {t('form.company')}
        </label>
        <input
          type="text"
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={`mt-1 block w-full rounded-lg border-gray-200 shadow-input focus:border-primary focus:ring-primary ${
            errors.company ? 'border-red-500' : ''
          }`}
          disabled={isSubmitting}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-red-600">{errors.company}</p>
        )}
      </div>

      <div className="relative space-y-1">
        <label htmlFor="location" className="block text-sm font-medium text-text">
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

      <div className="space-y-1">
        <label htmlFor="message" className="block text-sm font-medium text-text">
          {t('form.message')}
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={`mt-1 block w-full rounded-lg border-gray-200 shadow-input focus:border-primary focus:ring-primary ${
            errors.message ? 'border-red-500' : ''
          }`}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      <PhotoUpload
        photo={photo}
        onChange={setPhoto}
        error={errors.photo}
        disabled={isSubmitting}
      />

      {errors.submit && (
        <p className="text-red-600 text-sm">{errors.submit}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary px-4 py-3 text-white font-medium shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? t('form.uploading') : t('form.submit')}
      </button>
    </form>
  );
} 