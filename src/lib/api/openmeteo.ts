/**
 * @fileoverview Open-Meteo API Client
 * Functions for fetching weather data from Open-Meteo API
 */

import type {
  WeatherForecast,
  WeatherCurrent,
  WeatherDaily,
  WeatherHourly,
  WeatherLocation,
  OpenMeteoResponse,
  WeatherQueryParams,
  GeoCoordinates,
} from '@/types/weather';

const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1';

/**
 * Weather code descriptions for UI display
 */
const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌦️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

/**
 * Get weather description from WMO weather code
 * @param code - WMO weather code
 * @returns Description and icon
 */
export function getWeatherDescription(code: number): { description: string; icon: string } {
  return WEATHER_CODES[code] ?? { description: 'Unknown', icon: '❓' };
}

/**
 * Transform Open-Meteo response to WeatherLocation
 * @param data - Open-Meteo API response
 * @returns WeatherLocation object
 */
function transformLocation(data: OpenMeteoResponse): WeatherLocation {
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    timezoneAbbreviation: data.timezone_abbreviation,
    elevation: data.elevation,
  };
}

/**
 * Transform Open-Meteo response to WeatherCurrent
 * @param data - Open-Meteo API response
 * @returns WeatherCurrent object or null
 */
function transformCurrentWeather(data: OpenMeteoResponse): WeatherCurrent | null {
  if (!data.current_weather) {
    return null;
  }

  const hourly = data.hourly;
  const currentIndex = hourly?.time.findIndex(
    (t) => t === data.current_weather?.time
  ) ?? 0;

  return {
    temperature: data.current_weather.temperature,
    humidity: hourly?.relative_humidity_2m[currentIndex] ?? 0,
    windSpeed: data.current_weather.windspeed,
    windDirection: data.current_weather.winddirection,
    windGusts: null,
    precipitation: hourly?.precipitation[currentIndex] ?? 0,
    rain: hourly?.rain?.[currentIndex] ?? null,
    showers: hourly?.showers?.[currentIndex] ?? null,
    snowfall: hourly?.snowfall?.[currentIndex] ?? null,
    cloudCover: hourly?.cloudcover[currentIndex] ?? 0,
    pressure: hourly?.surface_pressure[currentIndex] ?? 0,
    uvIndex: hourly?.uv_index[currentIndex] ?? 0,
    isDay: data.current_weather.is_day === 1,
    timestamp: data.current_weather.time,
  };
}

/**
 * Transform Open-Meteo response to WeatherDaily
 * @param data - Open-Meteo API response
 * @returns WeatherDaily object or null
 */
function transformDailyForecast(data: OpenMeteoResponse): WeatherDaily | null {
  if (!data.daily) {
    return null;
  }

  return {
    dates: data.daily.time,
    maxTemp: data.daily.temperature_2m_max,
    minTemp: data.daily.temperature_2m_min,
    precipitation: data.daily.precipitation_sum,
    rain: data.daily.rain_sum,
    showers: data.daily.showers_sum,
    snowfall: data.daily.snowfall_sum,
    uvIndex: data.daily.uv_index_max,
    sunrise: data.daily.sunrise,
    sunset: data.daily.sunset,
  };
}

/**
 * Transform Open-Meteo response to WeatherHourly
 * @param data - Open-Meteo API response
 * @returns WeatherHourly object or null
 */
function transformHourlyForecast(data: OpenMeteoResponse): WeatherHourly | null {
  if (!data.hourly) {
    return null;
  }

  return {
    times: data.hourly.time,
    temperature: data.hourly.temperature_2m,
    humidity: data.hourly.relative_humidity_2m,
    windSpeed: data.hourly.windspeed_10m,
    windDirection: data.hourly.winddirection_10m,
    precipitation: data.hourly.precipitation,
    cloudCover: data.hourly.cloudcover,
    pressure: data.hourly.surface_pressure,
    uvIndex: data.hourly.uv_index,
  };
}

/**
 * Fetch weather forecast from Open-Meteo
 * @param coordinates - Geographic coordinates
 * @param days - Number of forecast days (default: 7)
 * @returns Weather forecast data
 * @throws Error if API request fails
 */
export async function fetchWeatherForecast(
  coordinates: GeoCoordinates,
  days: number = 7
): Promise<WeatherForecast> {
  const params = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    timezone: 'auto',
    current: 'temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weathercode,cloudcover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    hourly: 'temperature_2m,relative_humidity_2m,precipitation,rain,showers,snowfall,weathercode,cloudcover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum',
    forecast_days: String(days),
  });

  const url = `${OPENMETEO_BASE_URL}/forecast?${params.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
  }

  const data: OpenMeteoResponse = await response.json();

  const location = transformLocation(data);
  const current = transformCurrentWeather(data);
  const daily = transformDailyForecast(data);
  const hourly = transformHourlyForecast(data);

  if (!current || !daily || !hourly) {
    throw new Error('Invalid response from Open-Meteo API');
  }

  return {
    location,
    current,
    daily,
    hourly,
  };
}

/**
 * Fetch weather for a specific city by coordinates
 * @param latitude - City latitude
 * @param longitude - City longitude
 * @returns Weather forecast data
 */
export async function fetchWeatherByCity(
  latitude: number,
  longitude: number
): Promise<WeatherForecast> {
  return fetchWeatherForecast({ latitude, longitude });
}

/**
 * Format temperature with unit
 * @param temp - Temperature value
 * @returns Formatted string
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

/**
 * Format wind speed with unit
 * @param speed - Wind speed in km/h
 * @returns Formatted string
 */
export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

/**
 * Format humidity with unit
 * @param humidity - Humidity percentage
 * @returns Formatted string
 */
export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`;
}
