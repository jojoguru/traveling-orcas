import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddressSearch } from '@/lib/hooks/useAddressSearch';
import { GeocodingResult } from '@/lib/types/geocoding';

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: GeocodingResult) => void;
  error?: string;
  disabled?: boolean;
}

export function LocationSelect({ value, onChange, onLocationSelect, error, disabled }: LocationSelectProps) {
  const { t } = useTranslation();
  const [isLocating, setIsLocating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string>();
  const { suggestions, isLoading, searchAddress, searchAddressByGeolocation, clearSuggestions } = useAddressSearch();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle location search
  useEffect(() => {
    if (value) {
      searchAddress(value);
      setShowSuggestions(true);
    } else {
      clearSuggestions();
      setShowSuggestions(false);
    }
  }, [value, searchAddress, clearSuggestions]);

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsLocating(true);
    setGeolocationError(undefined);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const result = await searchAddressByGeolocation(latitude, longitude);
      console.log({result});
      if (result?.[0]) {
        handleLocationSelect(result[0]);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      if (error instanceof GeolocationPositionError && error.code === 1) {
        setGeolocationError(t('errors.geolocation.denied'));
      }
    } finally {
      setIsLocating(false);
    }
  };

  const handleLocationSelect = (result: GeocodingResult) => {
    onLocationSelect(result);
    onChange(result.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="relative space-y-1">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`mt-1 block w-full rounded-lg border-gray-200 shadow-input focus:border-primary focus:ring-primary pr-12 ${
            error ? 'border-red-500' : ''
          }`}
          disabled={disabled || isLocating}
          placeholder={t('form.searchLocation')}
        />
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={disabled || isLocating}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary disabled:opacity-50"
        >
          {isLocating ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {geolocationError && (
        <p className="mt-1 text-sm text-red-600">{geolocationError}</p>
      )}
      
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-100"
        >
          {isLoading ? (
            <div className="p-4 text-text-light">Loading...</div>
          ) : (
            <ul className="py-1">
              {suggestions.map((result) => (
                <li
                  key={result.place_id}
                  className="px-4 py-2 hover:bg-primary-light cursor-pointer text-sm"
                  onClick={() => handleLocationSelect(result)}
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 