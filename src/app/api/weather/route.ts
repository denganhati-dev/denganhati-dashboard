/**
 * @fileoverview Weather API Route
 * Next.js API route for proxying Open-Meteo requests with caching
 */

import { NextRequest, NextResponse } from 'next/server';
import type { WeatherForecast } from '@/types/weather';

const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1';

// Simple in-memory cache (10 minutes for weather)
const cache = new Map<string, { data: WeatherForecast; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Transform Open-Meteo response to WeatherForecast
 */
function transformForecast(data: {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather?: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number;
    time: string;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    rain: number[];
    showers: number[];
    snowfall: number[];
    weathercode: number[];
    cloudcover: number[];
    windspeed_10m: number[];
    winddirection_10m: number[];
    surface_pressure: number[];
    uv_index: number[];
  };
  daily?: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
  };
}): WeatherForecast {
  const location = {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    timezoneAbbreviation: data.timezone_abbreviation,
    elevation: data.elevation,
  };

  const hourly = data.hourly;
  const currentIndex = hourly?.time.findIndex(
    (t) => t === data.current_weather?.time
  ) ?? 0;

  const current = {
    temperature: data.current_weather?.temperature ?? 0,
    humidity: hourly?.relative_humidity_2m[currentIndex] ?? 0,
    windSpeed: data.current_weather?.windspeed ?? 0,
    windDirection: data.current_weather?.winddirection ?? 0,
    windGusts: null,
    precipitation: hourly?.precipitation[currentIndex] ?? 0,
    rain: hourly?.rain?.[currentIndex] ?? null,
    showers: hourly?.showers?.[currentIndex] ?? null,
    snowfall: hourly?.snowfall?.[currentIndex] ?? null,
    cloudCover: hourly?.cloudcover[currentIndex] ?? 0,
    pressure: hourly?.surface_pressure[currentIndex] ?? 0,
    uvIndex: hourly?.uv_index[currentIndex] ?? 0,
    isDay: data.current_weather?.is_day === 1,
    timestamp: data.current_weather?.time ?? new Date().toISOString(),
  };

  const daily = {
    dates: data.daily?.time ?? [],
    maxTemp: data.daily?.temperature_2m_max ?? [],
    minTemp: data.daily?.temperature_2m_min ?? [],
    precipitation: data.daily?.precipitation_sum ?? [],
    rain: data.daily?.rain_sum ?? [],
    showers: data.daily?.showers_sum ?? [],
    snowfall: data.daily?.snowfall_sum ?? [],
    uvIndex: data.daily?.uv_index_max ?? [],
    sunrise: data.daily?.sunrise ?? [],
    sunset: data.daily?.sunset ?? [],
  };

  const hourlyForecast = {
    times: hourly?.time ?? [],
    temperature: hourly?.temperature_2m ?? [],
    humidity: hourly?.relative_humidity_2m ?? [],
    windSpeed: hourly?.windspeed_10m ?? [],
    windDirection: hourly?.winddirection_10m ?? [],
    precipitation: hourly?.precipitation ?? [],
    cloudCover: hourly?.cloudcover ?? [],
    pressure: hourly?.surface_pressure ?? [],
    uvIndex: hourly?.uv_index ?? [],
  };

  return {
    location,
    current,
    daily,
    hourly: hourlyForecast,
  };
}

/**
 * GET handler for weather data
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const days = searchParams.get('days') ?? '7';

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Create cache key
    const cacheKey = `${lat}-${lon}-${days}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ data: cached.data, cached: true });
    }

    // Build Open-Meteo URL
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      timezone: 'auto',
      current: 'temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weathercode,cloudcover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
      hourly: 'temperature_2m,relative_humidity_2m,precipitation,rain,showers,snowfall,weathercode,cloudcover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index',
      daily: 'weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum',
      forecast_days: days,
    });

    const url = `${OPENMETEO_BASE_URL}/forecast?${params.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();
    const forecast = transformForecast(data);

    // Update cache
    cache.set(cacheKey, { data: forecast, timestamp: Date.now() });

    return NextResponse.json({ data: forecast, cached: false });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
