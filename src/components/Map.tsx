'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Entry } from '@/lib/supabase/types';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from 'react-i18next';

// Fix for Leaflet marker icons in Next.js
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Image from 'next/image';

// Create custom smaller icon
const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [18, 30],     // Original is [25, 41]
  iconAnchor: [9, 30],    // Original is [12, 41]
  popupAnchor: [0, -30],  // Original is [1, -34]
  shadowSize: [30, 30],   // Original is [41, 41]
});

// Component to handle map bounds
function MapBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();

  React.useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);

  return null;
}

interface MapProps {
  entries: Entry[];
}

export default function Map({ entries }: MapProps) {
  const { t, i18n } = useTranslation();
  const selectedEntry = useStore((state) => state.selectedEntry);

  // Calculate center based on entries or default to a central location
  const center = React.useMemo(() => {
    if (selectedEntry) {
      return [selectedEntry.coordinates.latitude, selectedEntry.coordinates.longitude] as [number, number];
    }
    if (entries?.length) {
      const latitudes = entries.map((entry: Entry) => entry.coordinates.latitude);
      const longitudes = entries.map((entry: Entry) => entry.coordinates.longitude);
      return [
        (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
        (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
      ] as [number, number];
    }
    return [0, 0] as [number, number];
  }, [entries, selectedEntry]);

  // Sort entries by creation date and create route coordinates
  const routeCoordinates = React.useMemo(() => {
    if (!entries?.length) return [];
    
    return entries
      .sort((a: Entry, b: Entry) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((entry: Entry) => [entry.coordinates.latitude, entry.coordinates.longitude] as [number, number]);
  }, [entries]);

  return (
    <MapContainer
      center={center}
      zoom={selectedEntry ? 12 : 2}
      className="h-[calc(100vh-256px)] w-full rounded-lg shadow-lg relative z-0"
      zoomControl={false} // Move zoom control to right side
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      
      {/* Add bounds handler */}
      {routeCoordinates.length > 0 && (
        <MapBounds coordinates={routeCoordinates} />
      )}
      
      {/* Draw route line */}
      {routeCoordinates.length > 1 && (
        <>
          {/* Shadow effect */}
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ 
              color: '#000000',
              weight: 6,
              opacity: 0.2,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
          {/* Main line */}
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ 
              color: '#DE2D26',
              weight: 4,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </>
      )}

      {entries?.map((entry: Entry) => (
        <Marker
          key={entry.id}
          position={[entry.coordinates.latitude, entry.coordinates.longitude]}
          icon={customIcon}
        >
          <Popup className="rounded-lg shadow-lg">
            <div className="text-sm space-y-2">
              <div className="aspect-w-16 aspect-h-9 -mx-2 -mt-2 mb-2">
                <Image
                  src={entry.photo_url}
                  alt={t('map.photoBy', { name: entry.name })}
                  className="rounded-t-lg object-cover w-full h-full"
                />
              </div>
              <p className="font-semibold">{entry.name}</p>
              <p>{entry.location}</p>
              <p className="text-gray-500">
                {new Date(entry.created_at).toLocaleDateString(i18n.language)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 