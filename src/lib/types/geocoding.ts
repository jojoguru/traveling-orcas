export interface GeocodingResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
} 