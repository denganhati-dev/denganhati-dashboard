/**
 * @fileoverview Map Container Component
 * Interactive map for displaying environmental data using Leaflet
 */

'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { AirQualityMeasurement } from '@/types/air-quality';
import { getAQIColor, getAQICategory } from '@/lib/api/openaq';

// Fix for default markers in Leaflet with Next.js
const defaultIcon = new Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Create custom marker icon based on AQI value
 * @param aqi - AQI value
 * @returns Leaflet Icon
 */
function createAQIIcon(aqi: number): Icon {
  const color = getAQIColor(aqi).replace('text-', '').replace('500', '').replace('900', '');
  const colorMap: Record<string, string> = {
    'green-': '#22c55e',
    'yellow-': '#eab308',
    'orange-': '#f97316',
    'red-': '#ef4444',
    'purple-': '#a855f7',
  };
  
  const fillColor = colorMap[color] ?? '#6b7280';
  
  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="25" height="41">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="${fillColor}"/>
        <circle cx="12" cy="12" r="6" fill="white"/>
      </svg>`
    )}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
}

interface MapContainerProps {
  readonly measurements: AirQualityMeasurement[];
  readonly center?: LatLngTuple;
  readonly zoom?: number;
  readonly onMarkerClick?: (measurement: AirQualityMeasurement) => void;
}

/**
 * Map resize handler component
 */
function MapResizer(): null {
  const map = useMap();
  
  useEffect(() => {
    const handleResize = (): void => {
      map.invalidateSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);
  
  return null;
}

/**
 * Map Container Component
 * Displays air quality measurements on an interactive map
 */
export function MapContainer({
  measurements,
  center = [-6.2088, 106.8456], // Jakarta default
  zoom = 10,
  onMarkerClick,
}: MapContainerProps): React.ReactElement {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-200">
      <LeafletMap
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizer />
        {measurements.map((measurement) => (
          <Marker
            key={measurement.locationId}
            position={measurement.coordinates}
            icon={createAQIIcon(measurement.aqi)}
            eventHandlers={{
              click: () => onMarkerClick?.(measurement),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-gray-900">
                  {measurement.locationName}
                </h3>
                <p className="text-sm text-gray-600">
                  {measurement.city}, {measurement.country}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getAQIColor(measurement.aqi)}`}>
                    {measurement.aqi}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getAQICategory(measurement.aqi)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div>PM2.5: {measurement.pm25?.toFixed(1) ?? 'N/A'} μg/m³</div>
                  <div>PM10: {measurement.pm10?.toFixed(1) ?? 'N/A'} μg/m³</div>
                  <div>O₃: {measurement.o3?.toFixed(1) ?? 'N/A'} ppb</div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Updated: {new Date(measurement.timestamp).toLocaleString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMap>
    </div>
  );
}
