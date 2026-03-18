/**
 * @fileoverview Air Quality Data Types
 * Type definitions for OpenAQ API integration and air quality measurements
 */

/**
 * Geographic coordinates [latitude, longitude]
 */
export type Coordinates = [number, number];

/**
 * Air quality location metadata
 */
export interface AirQualityLocation {
  readonly id: string;
  readonly name: string;
  readonly coordinates: Coordinates;
  readonly country: string;
  readonly city: string;
}

/**
 * Individual pollutant measurement
 */
export interface PollutantMeasurement {
  readonly parameter: string;
  readonly value: number;
  readonly unit: string;
  readonly timestamp: string;
}

/**
 * Air quality measurement at a specific location and time
 */
export interface AirQualityMeasurement {
  readonly locationId: string;
  readonly locationName: string;
  readonly coordinates: Coordinates;
  readonly city: string;
  readonly country: string;
  readonly timestamp: string;
  readonly aqi: number;
  readonly pm25: number | null;
  readonly pm10: number | null;
  readonly o3: number | null;
  readonly no2: number | null;
  readonly so2: number | null;
  readonly co: number | null;
}

/**
 * Time series data for charts
 */
export interface TimeSeriesData {
  readonly timestamps: string[];
  readonly values: number[];
}

/**
 * Air quality time series for a location
 */
export interface AirQualityTimeSeries {
  readonly location: AirQualityLocation;
  readonly hourly: {
    readonly timestamps: string[];
    readonly pm25: number[];
    readonly pm10: number[];
    readonly aqi: number[];
  };
}

/**
 * AQI category based on US EPA standards
 */
export type AQICategory = 
  | 'good'           // 0-50
  | 'moderate'       // 51-100
  | 'unhealthy-sensitive' // 101-150
  | 'unhealthy'      // 151-200
  | 'very-unhealthy' // 201-300
  | 'hazardous';     // 301+

/**
 * AQI level information for UI display
 */
export interface AQILevel {
  readonly category: AQICategory;
  readonly label: string;
  readonly color: string;
  readonly description: string;
}

/**
 * OpenAQ API response for latest measurements
 */
export interface OpenAQLatestResponse {
  readonly meta: {
    readonly name: string;
    readonly license: string;
    readonly website: string;
    readonly page: number;
    readonly limit: number;
    readonly found: number;
  };
  readonly results: Array<{
    readonly locationId: string;
    readonly location: string;
    readonly parameter: string;
    readonly value: number;
    readonly date: {
      readonly utc: string;
      readonly local: string;
    };
    readonly unit: string;
    readonly coordinates: {
      readonly latitude: number;
      readonly longitude: number;
    };
    readonly country: string;
    readonly city: string;
  }>;
}

/**
 * Filter options for air quality queries
 */
export interface AirQualityFilter {
  readonly country?: string;
  readonly city?: string;
  readonly parameter?: string;
  readonly limit?: number;
  readonly page?: number;
}
