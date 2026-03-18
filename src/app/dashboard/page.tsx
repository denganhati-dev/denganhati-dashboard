/**
 * @fileoverview Dashboard Page
 * Main dashboard for environmental data visualization
 */

'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer } from '@/components/maps/MapContainer';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import type { AirQualityMeasurement } from '@/types/air-quality';
import type { WeatherForecast } from '@/types/weather';
import { getAQIColor, getAQICategory } from '@/lib/api/openaq';
import { getWeatherDescription, formatTemperature, formatWindSpeed, formatHumidity } from '@/lib/api/openmeteo';

interface DashboardData {
  airQuality: AirQualityMeasurement[];
  weather: WeatherForecast | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch dashboard data from API
 */
async function fetchDashboardData(): Promise<{ airQuality: AirQualityMeasurement[]; weather: WeatherForecast | null }> {
  // Fetch air quality data
  const aqResponse = await fetch('/api/air-quality?limit=50');
  const aqData = await aqResponse.json();
  
  // Fetch weather data for Jakarta
  const weatherResponse = await fetch('/api/weather?lat=-6.2088&lon=106.8456&days=7');
  const weatherData = await weatherResponse.json();
  
  return {
    airQuality: aqData.data ?? [],
    weather: weatherData.data ?? null,
  };
}

/**
 * AQI Card Component
 */
function AQICard({ measurement }: { measurement: AirQualityMeasurement }): React.ReactElement {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-600">{measurement.locationName}</h4>
          <p className="text-xs text-gray-500">{measurement.city}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getAQIColor(measurement.aqi)}`}>
            {measurement.aqi}
          </div>
          <div className="text-xs text-gray-500">{getAQICategory(measurement.aqi)}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
        <div>PM2.5: {measurement.pm25?.toFixed(1) ?? 'N/A'}</div>
        <div>PM10: {measurement.pm10?.toFixed(1) ?? 'N/A'}</div>
        <div>O₃: {measurement.o3?.toFixed(1) ?? 'N/A'}</div>
      </div>
    </div>
  );
}

/**
 * Weather Card Component
 */
function WeatherCard({ weather }: { weather: WeatherForecast }): React.ReactElement {
  const { current, location } = weather;
  const weatherInfo = getWeatherDescription(0); // Default, should use actual code
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{location.timezone}</h4>
          <p className="text-sm text-gray-500">{weatherInfo.description}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-gray-900">
            {formatTemperature(current.temperature)}
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-semibold text-blue-600">{formatHumidity(current.humidity)}</div>
          <div className="text-xs text-gray-500">Kelembaban</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-green-600">{formatWindSpeed(current.windSpeed)}</div>
          <div className="text-xs text-gray-500">Angin</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-yellow-600">{current.uvIndex}</div>
          <div className="text-xs text-gray-500">UV Index</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Page Component
 */
export default function DashboardPage(): React.ReactElement {
  const [data, setData] = useState<DashboardData>({
    airQuality: [],
    weather: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function loadData(): Promise<void> {
      try {
        const result = await fetchDashboardData();
        setData({
          airQuality: result.airQuality,
          weather: result.weather,
          loading: false,
          error: null,
        });
      } catch (err) {
        setData({
          airQuality: [],
          weather: null,
          loading: false,
          error: 'Failed to load dashboard data',
        });
      }
    }

    loadData();
  }, []);

  if (data.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data lingkungan...</p>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{data.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data from weather hourly
  const temperatureData = data.weather?.hourly.times.slice(0, 24).map((time, i) => ({
    timestamp: time,
    value: data.weather?.hourly.temperature[i] ?? 0,
  })) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dengan Hati Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Visualisasi data lingkungan untuk media dan NGO
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Data dari OpenAQ & Open-Meteo
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weather Card */}
          {data.weather && <WeatherCard weather={data.weather} />}
          
          {/* Top AQI Locations */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.airQuality.slice(0, 2).map((measurement) => (
              <AQICard key={measurement.locationId} measurement={measurement} />
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Peta Kualitas Udara</h2>
          <div className="h-[500px] bg-white rounded-lg border border-gray-200 shadow-sm">
            <MapContainer
              measurements={data.airQuality}
              center={[-6.2088, 106.8456]}
              zoom={11}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TimeSeriesChart
            data={temperatureData}
            title="Prakiraan Suhu (24 Jam)"
            color="#f59e0b"
            unit="°C"
            height={300}
          />
          
          {/* AQI Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi AQI</h3>
            <div className="space-y-3">
              {['Baik (0-50)', 'Sedang (51-100)', 'Tidak Sehat (101-150)', 'Sangat Tidak Sehat (151-200)', 'Berbahaya (>200)'].map((label, i) => {
                const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];
                const count = data.airQuality.filter((m) => {
                  if (i === 0) return m.aqi <= 50;
                  if (i === 1) return m.aqi > 50 && m.aqi <= 100;
                  if (i === 2) return m.aqi > 100 && m.aqi <= 150;
                  if (i === 3) return m.aqi > 150 && m.aqi <= 200;
                  return m.aqi > 200;
                }).length;
                const percentage = data.airQuality.length > 0 ? (count / data.airQuality.length) * 100 : 0;
                
                return (
                  <div key={label} className="flex items-center">
                    <div className={`w-4 h-4 rounded ${colors[i]} mr-3`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{label}</span>
                        <span className="text-gray-500">{count} lokasi</span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${colors[i]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Data Kualitas Udara Terkini</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AQI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM2.5</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM10</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.airQuality.slice(0, 10).map((measurement) => (
                  <tr key={measurement.locationId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {measurement.locationName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {measurement.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-bold ${getAQIColor(measurement.aqi)}`}>
                        {measurement.aqi}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {measurement.pm25?.toFixed(1) ?? 'N/A'} μg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {measurement.pm10?.toFixed(1) ?? 'N/A'} μg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        measurement.aqi <= 50 ? 'bg-green-100 text-green-800' :
                        measurement.aqi <= 100 ? 'bg-yellow-100 text-yellow-800' :
                        measurement.aqi <= 150 ? 'bg-orange-100 text-orange-800' :
                        measurement.aqi <= 200 ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {getAQICategory(measurement.aqi)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 Dengan Hati. Data disediakan oleh OpenAQ dan Open-Meteo.
          </p>
        </div>
      </footer>
    </div>
  );
}
