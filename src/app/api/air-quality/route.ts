/**
 * @fileoverview Air Quality API Route
 * Next.js API route for fetching air quality data from OpenAQ v3 API
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AirQualityMeasurement } from '@/types/air-quality';

const OPENAQ_BASE_URL = 'https://api.openaq.org/v3';

// Simple in-memory cache (5 minutes)
const cache = new Map<string, { data: AirQualityMeasurement[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
 * Transform OpenAQ v3 result to AirQualityMeasurement
 */
function transformResult(result: {
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
  if (!result.coordinates || !result.sensors) {
    return null;
  }

  const coordinates: [number, number] = [result.coordinates.lat, result.coordinates.lon];
  
  let aqi = 0;
  let pm25: number | null = null;
  let pm10: number | null = null;
  let o3: number | null = null;
  let no2: number | null = null;
  let so2: number | null = null;
  let co: number | null = null;
  let latestTimestamp = new Date().toISOString();

  // Process sensors
  for (const sensor of result.sensors) {
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
    locationId: result.id,
    locationName: result.name,
    coordinates,
    city: result.locality ?? result.owner?.name ?? 'Unknown',
    country: result.country?.name ?? 'Unknown',
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
 * GET handler for air quality data
 * Uses OpenAQ v3 API - /locations endpoint
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const limit = searchParams.get('limit') ?? '50';

    // Create cache key
    const cacheKey = `${country ?? 'all'}-${city ?? 'all'}-${limit}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ data: cached.data, cached: true });
    }

    // Build OpenAQ v3 URL - using /locations endpoint with sensors
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('sensors', 'true'); // Include sensor data
    
    if (country) {
      params.append('countries_id', country);
    }
    if (city) {
      params.append('locality', city);
    }

    const url = `${OPENAQ_BASE_URL}/locations?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAQ API error:', response.status, errorText);
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform results
    const measurements: AirQualityMeasurement[] = (data.results ?? [])
      .map(transformResult)
      .filter((m: AirQualityMeasurement | null): m is AirQualityMeasurement => m !== null);

    // Update cache
    cache.set(cacheKey, { data: measurements, timestamp: Date.now() });

    return NextResponse.json({ data: measurements, cached: false });
  } catch (error) {
    console.error('Air quality API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch air quality data', details: String(error) },
      { status: 500 }
    );
  }
}
