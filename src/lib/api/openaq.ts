/**
 * @fileoverview OpenAQ API Client
 * Functions for fetching air quality data from OpenAQ v3 API
 */

import type {
  AirQualityMeasurement,
  AirQualityFilter,
  Coordinates,
} from '@/types/air-quality';

const OPENAQ_BASE_URL = 'https://api.openaq.org/v3';

/**
 * Calculate AQI from PM2.5 value using US EPA standards
 * @param pm25 - PM2.5 concentration in μg/m³
 * @returns AQI value (0-500)
 */
function calculateAQIFromPM25(pm25: number): number {
  if (pm25 <= 12.0) {
    return Math.round(((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0);
  }
  if (pm25 <= 35.4) {
    return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  }
  if (pm25 <= 55.4) {
    return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  }
  if (pm25 <= 150.4) {
    return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
  }
  if (pm25 <= 250.4) {
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  }
  if (pm25 <= 500.4) {
    return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
  }
  return 500;
}

/**
 * Transform OpenAQ v3 location to AirQualityMeasurement
 */
function transformLocation(location: {
  id: string;
  name: string;
  locality?: string;
  timezone?: string;
  country?: { id: string; name: string };
  owner?: { id: string; name: string };
  coordinates?: { lat: number; lon: number };
  sensors?: Array<{
    id: string;
    name: string;
    parameter?: { id: string; name: string; units: string };
    latest?: {
      datetime: string;
      value: number;
    };
  }>;
}): AirQualityMeasurement | null {
  if (!location.coordinates || !location.sensors) {
    return null;
  }

  const coordinates: Coordinates = [location.coordinates.lat, location.coordinates.lon];
  
  let aqi = 0;
  let pm25: number | null = null;
  let pm10: number | null = null;
  let o3: number | null = null;
  let no2: number | null = null;
  let so2: number | null = null;
  let co: number | null = null;
  let latestTimestamp = new Date().toISOString();

  // Process sensors
  for (const sensor of location.sensors) {
    if (!sensor.latest) continue;
    
    const paramName = sensor.parameter?.name?.toLowerCase() ?? '';
    const value = sensor.latest.value;
    latestTimestamp = sensor.latest.datetime;

    switch (paramName) {
      case 'pm25':
      case 'pm2.5':
        pm25 = value;
        aqi = calculateAQIFromPM25(value);
        break;
      case 'pm10':
        pm10 = value;
        break;
      case 'o3':
      case 'ozone':
        o3 = value;
        break;
      case 'no2':
      case 'nitrogen dioxide':
        no2 = value;
        break;
      case 'so2':
      case 'sulfur dioxide':
        so2 = value;
        break;
      case 'co':
      case 'carbon monoxide':
        co = value;
        break;
    }
  }

  // Only return if we have at least one measurement
  if (pm25 === null && pm10 === null && o3 === null && no2 === null && so2 === null && co === null) {
    return null;
  }

  return {
    locationId: location.id,
    locationName: location.name,
    coordinates,
    city: location.locality ?? location.owner?.name ?? 'Unknown',
    country: location.country?.name ?? 'Unknown',
    timestamp: latestTimestamp,
    aqi,
    pm25,
    pm10,
    o3,
    no2,
    so2,
    co,
  };
}

/**
 * Fetch latest air quality measurements from OpenAQ v3
 * @param filter - Optional filter parameters
 * @returns Array of air quality measurements
 * @throws Error if API request fails
 */
export async function fetchLatestAirQuality(
  filter: AirQualityFilter = {}
): Promise<AirQualityMeasurement[]> {
  const params = new URLSearchParams();
  params.append('limit', String(filter.limit ?? 50));
  params.append('sensors', 'true');
  
  if (filter.country) {
    params.append('countries_id', filter.country);
  }
  if (filter.city) {
    params.append('locality', filter.city);
  }

  const url = `${OPENAQ_BASE_URL}/locations?${params.toString()}`;
  
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error(`OpenAQ API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  return (data.results ?? [])
    .map(transformLocation)
    .filter((m: AirQualityMeasurement | null): m is AirQualityMeasurement => m !== null);
}

/**
 * Fetch air quality for a specific location
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @param radius - Search radius in meters (default: 25000)
 * @returns Air quality measurement or null
 */
export async function fetchAirQualityByLocation(
  latitude: number,
  longitude: number,
  radius: number = 25000
): Promise<AirQualityMeasurement | null> {
  const params = new URLSearchParams();
  params.append('coordinates', `${latitude},${longitude}`);
  params.append('radius', String(radius));
  params.append('limit', '1');
  params.append('sensors', 'true');

  const url = `${OPENAQ_BASE_URL}/locations?${params.toString()}`;
  
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error(`OpenAQ API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    return null;
  }

  return transformLocation(data.results[0]);
}

/**
 * Get AQI category label
 * @param aqi - AQI value
 * @returns Category label
 */
export function getAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

/**
 * Get AQI color for UI
 * @param aqi - AQI value
 * @returns Tailwind color class
 */
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return 'text-green-500';
  if (aqi <= 100) return 'text-yellow-500';
  if (aqi <= 150) return 'text-orange-500';
  if (aqi <= 200) return 'text-red-500';
  if (aqi <= 300) return 'text-purple-500';
  return 'text-red-900';
}

/**
 * Get AQI background color for UI
 * @param aqi - AQI value
 * @returns Tailwind background color class
 */
export function getAQIBgColor(aqi: number): string {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-purple-500';
  return 'bg-red-900';
}
