/**
 * @fileoverview Weather Data Types
 * Type definitions for Open-Meteo API integration and weather data
 */

/**
 * Geographic coordinates
 */
export interface GeoCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

/**
 * Weather location with timezone
 */
export interface WeatherLocation extends GeoCoordinates {
  readonly timezone: string;
  readonly timezoneAbbreviation: string;
  readonly elevation: number;
}

/**
 * Current weather conditions
 */
export interface WeatherCurrent {
  readonly temperature: number;      // °C
  readonly humidity: number;         // %
  readonly windSpeed: number;        // km/h
  readonly windDirection: number;    // degrees
  readonly windGusts: number | null; // km/h
  readonly precipitation: number;    // mm
  readonly rain: number | null;      // mm
  readonly showers: number | null;   // mm
  readonly snowfall: number | null;  // cm
  readonly cloudCover: number;       // %
  readonly pressure: number;         // hPa
  readonly uvIndex: number;
  readonly isDay: boolean;
  readonly timestamp: string;
}

/**
 * Daily weather forecast
 */
export interface WeatherDaily {
  readonly dates: string[];
  readonly maxTemp: number[];        // °C
  readonly minTemp: number[];        // °C
  readonly precipitation: number[];  // mm
  readonly rain: number[];           // mm
  readonly showers: number[];        // mm
  readonly snowfall: number[];       // cm
  readonly uvIndex: number[];
  readonly sunrise: string[];
  readonly sunset: string[];
}

/**
 * Hourly weather forecast
 */
export interface WeatherHourly {
  readonly times: string[];
  readonly temperature: number[];    // °C
  readonly humidity: number[];       // %
  readonly windSpeed: number[];      // km/h
  readonly windDirection: number[];  // degrees
  readonly precipitation: number[];  // mm
  readonly cloudCover: number[];     // %
  readonly pressure: number[];       // hPa
  readonly uvIndex: number[];
}

/**
 * Complete weather forecast data
 */
export interface WeatherForecast {
  readonly location: WeatherLocation;
  readonly current: WeatherCurrent;
  readonly daily: WeatherDaily;
  readonly hourly: WeatherHourly;
}

/**
 * Open-Meteo API response structure
 */
export interface OpenMeteoResponse {
  readonly latitude: number;
  readonly longitude: number;
  readonly generationtime_ms: number;
  readonly utc_offset_seconds: number;
  readonly timezone: string;
  readonly timezone_abbreviation: string;
  readonly elevation: number;
  readonly current_weather?: {
    readonly temperature: number;
    readonly windspeed: number;
    readonly winddirection: number;
    readonly weathercode: number;
    readonly is_day: number;
    readonly time: string;
  };
  readonly hourly?: {
    readonly time: string[];
    readonly temperature_2m: number[];
    readonly relative_humidity_2m: number[];
    readonly precipitation: number[];
    readonly rain: number[];
    readonly showers: number[];
    readonly snowfall: number[];
    readonly weathercode: number[];
    readonly cloudcover: number[];
    readonly windspeed_10m: number[];
    readonly winddirection_10m: number[];
    readonly surface_pressure: number[];
    readonly uv_index: number[];
  };
  readonly daily?: {
    readonly time: string[];
    readonly weathercode: number[];
    readonly temperature_2m_max: number[];
    readonly temperature_2m_min: number[];
    readonly sunrise: string[];
    readonly sunset: string[];
    readonly uv_index_max: number[];
    readonly precipitation_sum: number[];
    readonly rain_sum: number[];
    readonly showers_sum: number[];
    readonly snowfall_sum: number[];
  };
}

/**
 * Weather code mapping for icons and descriptions
 */
export interface WeatherCode {
  readonly code: number;
  readonly description: string;
  readonly icon: string;
}

/**
 * Query parameters for Open-Meteo API
 */
export interface WeatherQueryParams {
  readonly latitude: number;
  readonly longitude: number;
  readonly timezone?: string;
  readonly current?: string[];
  readonly hourly?: string[];
  readonly daily?: string[];
  readonly forecast_days?: number;
  readonly past_days?: number;
}

/**
 * Combined environmental data for dashboard
 */
export interface EnvironmentalData {
  readonly weather: WeatherForecast | null;
  readonly airQuality: import('./air-quality').AirQualityMeasurement | null;
  readonly lastUpdated: string;
}
