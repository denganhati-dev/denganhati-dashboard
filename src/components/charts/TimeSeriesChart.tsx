/**
 * @fileoverview Time Series Chart Component
 * Recharts-based time series visualization for environmental data
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface DataPoint {
  readonly timestamp: string;
  readonly value: number;
  readonly label?: string;
}

interface TimeSeriesChartProps {
  readonly data: DataPoint[];
  readonly title?: string;
  readonly xAxisLabel?: string;
  readonly yAxisLabel?: string;
  readonly color?: string;
  readonly showArea?: boolean;
  readonly height?: number;
  readonly unit?: string;
}

/**
 * Format timestamp for display
 * @param timestamp - ISO timestamp
 * @returns Formatted string
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
  });
}

/**
 * Custom tooltip component
 */
function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  unit?: string;
}): React.ReactElement | null {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-lg font-semibold text-gray-900">
          {payload[0].value} {unit}
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Time Series Chart Component
 * Displays time-based data with optional area fill
 */
export function TimeSeriesChart({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  color = '#10b981',
  showArea = true,
  height = 300,
  unit = '',
}: TimeSeriesChartProps): React.ReactElement {
  const chartData = data.map((point) => ({
    ...point,
    formattedTime: formatTimestamp(point.timestamp),
  }));

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {showArea ? (
          <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 40 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="formattedTime"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              angle={-45}
              textAnchor="end"
              height={60}
              label={
                xAxisLabel
                  ? { value: xAxisLabel, position: 'insideBottom', offset: -10 }
                  : undefined
              }
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: 'insideLeft' }
                  : undefined
              }
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
            />
          </AreaChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="formattedTime"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              angle={-45}
              textAnchor="end"
              height={60}
              label={
                xAxisLabel
                  ? { value: xAxisLabel, position: 'insideBottom', offset: -10 }
                  : undefined
              }
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: 'insideLeft' }
                  : undefined
              }
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

interface MultiSeriesChartProps {
  readonly data: Array<{
    readonly timestamp: string;
    readonly [key: string]: number | string;
  }>;
  readonly series: Array<{
    readonly key: string;
    readonly name: string;
    readonly color: string;
  }>;
  readonly title?: string;
  readonly height?: number;
  readonly unit?: string;
}

/**
 * Multi-Series Chart Component
 * Displays multiple data series on the same chart
 */
export function MultiSeriesChart({
  data,
  series,
  title,
  height = 300,
  unit = '',
}: MultiSeriesChartProps): React.ReactElement {
  const chartData = data.map((point) => ({
    ...point,
    formattedTime: formatTimestamp(point.timestamp as string),
  }));

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="formattedTime"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Legend />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
