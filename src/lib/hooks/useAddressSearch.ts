import { useState, useCallback } from 'react';
import { GeocodingResult } from '../types/geocoding';
import debounce from 'lodash/debounce';

export function useAddressSearch() {
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const formatDisplayName = (address: any): string => {
    const parts = [];
    
    // Add road/street name if available
    if (address.road) {
      parts.push(address.road);
      // Add house number if available
      if (address.house_number) {
        parts[0] += ' ' + address.house_number;
      }
    }
    
    // Add city/town/village
    if (address.city) {
      parts.push(address.city);
    } else if (address.town) {
      parts.push(address.town);
    } else if (address.village) {
      parts.push(address.village);
    }
    
    // Add state/province
    if (address.state) {
      parts.push(address.state);
    }
    
    // Add country
    if (address.country) {
      parts.push(address.country);
    }
    
    return parts.join(', ');
  };

  const searchAddressByGeolocation = useCallback(async (latitude: number, longitude: number): Promise<GeocodingResult[]> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'de', // Prefer German results
          },
        }
      );
      const data = await response.json();
      // Convert reverse geocoding result to match GeocodingResult format
      const result: GeocodingResult = {
        place_id: data.place_id,
        lat: data.lat,
        lon: data.lon,
        display_name: formatDisplayName(data.address),
        type: data.type,
        importance: data.importance || 0,
      };
      setSuggestions([result]);
      return [result];
    } catch (error) {
      console.error('Error fetching address by coordinates:', error);
      setSuggestions([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        clearSuggestions();
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'de', // Prefer German results
            },
          }
        );
        const data = await response.json();
        const formattedResults = data.map((item: any) => ({
          ...item,
          display_name: formatDisplayName(item.address),
        }));
        setSuggestions(formattedResults);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [clearSuggestions]
  );

  const searchAddress = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  return {
    suggestions,
    isLoading,
    searchAddress,
    searchAddressByGeolocation,
    clearSuggestions,
  };
} 