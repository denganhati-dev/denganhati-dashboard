/**
 * @fileoverview Air Quality API Route
 * Next.js API route for proxying OpenAQ requests with caching
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AirQualityMeasurement } from '@/types/air-quality';

const OPENAQ_BASE_URL = 'https://api.openaq.org/v2';

// Simple in-memory cache (5 minutes)
const cache = new Map<string, { data: AirQualityMeasurement[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Calculate AQI from PM2.5 value
 * @param pm25 - PM2.5 concentration
 * @returns AQI value
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
 * Transform OpenAQ result to AirQualityMeasurement
 */
function transformResult(result: {
  locationId: string;
  location: string;
  parameter: string;
  value: number;
  date: { utc: string; local: string };
  unit: string;
  coordinates: { latitude: number; longitude: number };
  country: string;
  city: string;
}): AirQualityMeasurement {
  const coordinates: [number, number] = [result.coordinates.latitude, result.coordinates.longitude];

  let aqi = 0;
  let pm25: number | null = null;
  let pm10: number | null = null;
  let o3: number | null = null;
  let no2: number | null = null;
  let so2: number | null = null;
  let co: number | null = null;

  switch (result.parameter.toLowerCase()) {
    case 'pm25':
    case 'pm2.5':
      pm25 = result.value;
      aqi = calculateAQIFromPM25(result.value);
      break;
    case 'pm10':
      pm10 = result.value;
      break;
    case 'o3':
      o3 = result.value;
      break;
    case 'no2':
      no2 = result.value;
      break;
    case 'so2':
      so2 = result.value;
      break;
    case 'co':
      co = result.value;
      break;
  }

  return {
    locationId: result.locationId,
    locationName: result.location,
    coordinates,
    city: result.city,
    country: result.country,
    timestamp: result.date.utc,
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
 * GET handler for air quality data
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const limit = searchParams.get('limit') ?? '100';

    // Create cache key
    const cacheKey = `${country ?? 'all'}-${city ?? 'all'}-${limit}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ data: cached.data, cached: true });
    }

    // Build OpenAQ URL
    const params = new URLSearchParams();
    params.append('limit', limit);
    if (country) params.append('country', country);
    if (city) params.append('city', city);

    const url = `${OPENAQ_BASE_URL}/latest?${params.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();
    const measurements: AirQualityMeasurement[] = data.results.map(transformResult);

    // Update cache
    cache.set(cacheKey, { data: measurements, timestamp: Date.now() });

    return NextResponse.json({ data: measurements, cached: false });
  } catch (error) {
    console.error('Air quality API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch air quality data' },
      { status: 500 }
    );
  }
}
