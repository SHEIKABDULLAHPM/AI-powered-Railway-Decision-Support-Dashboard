// components/KpiCharts.tsx - KPI visualization charts
'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartCard } from './ChartCard';
import { KPI, ChartDataPoint } from '@/lib/types';
import { cn } from '@/lib/utils';

interface KpiChartsProps {
  kpis: KPI[];
  historicalData?: ChartDataPoint[];
  timeRange?: '1h' | '6h' | '24h';
  className?: string;
}

const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
};

export function KpiCharts({ kpis, historicalData = [], timeRange = '1h', className }: KpiChartsProps) {
  // Generate trend data for line charts
  const trendData = useMemo(() => {
    const points = timeRange === '1h' ? 12 : timeRange === '6h' ? 24 : 48;
    const interval = timeRange === '1h' ? 5 : timeRange === '6h' ? 15 : 30;
    
    return Array.from({ length: points }, (_, i) => {
      const time = new Date(Date.now() - (points - 1 - i) * interval * 60 * 1000);
      const timeStr = time.toTimeString().slice(0, 5);
      
      return {
        time: timeStr,
        throughput: 140 + Math.random() * 20 + Math.sin(i * 0.3) * 10,
        delay: 8 + Math.random() * 6 + Math.sin(i * 0.2) * 3,
        utilization: 75 + Math.random() * 15 + Math.sin(i * 0.4) * 8,
        acceptance: 85 + Math.random() * 10 + Math.sin(i * 0.1) * 5
      };
    });
  }, [timeRange]);

  // KPI distribution data for pie chart
  const distributionData = useMemo(() => {
    return kpis.map((kpi, index) => ({
      name: kpi.name,
      value: kpi.value,
      status: kpi.status || 'good',
      color: Object.values(COLORS)[index % Object.values(COLORS).length]
    }));
  }, [kpis]);

  // Performance comparison data
  const comparisonData = useMemo(() => {
    return kpis.map(kpi => ({
      name: kpi.name.replace(/\s+/g, '\n'),
      current: kpi.value,
      target: kpi.target || kpi.value * 1.1,
      status: kpi.status || 'good'
    }));
  }, [kpis]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">{entry.dataKey}:</span>
              <span className="font-medium">
                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
      {/* Throughput Trend */}
      <ChartCard
        title="Network Throughput"
        subtitle={`Trains per hour - Last ${timeRange}`}
        onExport={() => console.log('Export throughput chart')}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="throughput"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Delay Trends */}
      <ChartCard
        title="Average Delay"
        subtitle={`Minutes - Last ${timeRange}`}
        onExport={() => console.log('Export delay chart')}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="delay"
              stroke={COLORS.danger}
              strokeWidth={2}
              dot={{ fill: COLORS.danger, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: COLORS.danger, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Utilization vs Acceptance */}
      <ChartCard
        title="System Performance"
        subtitle="Utilization and AI acceptance rates"
        onExport={() => console.log('Export performance chart')}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="utilization"
              stroke={COLORS.info}
              strokeWidth={2}
              name="Utilization"
            />
            <Line
              type="monotone"
              dataKey="acceptance"
              stroke={COLORS.success}
              strokeWidth={2}
              name="AI Acceptance"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* KPI Comparison Bar Chart */}
      <ChartCard
        title="Current vs Target"
        subtitle="Performance against targets"
        onExport={() => console.log('Export comparison chart')}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="current" 
              fill={COLORS.primary} 
              name="Current"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="target" 
              fill={COLORS.secondary} 
              name="Target"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* System Health Distribution */}
      <div className="lg:col-span-2">
        <ChartCard
          title="System Health Overview"
          subtitle="Distribution of KPI statuses"
          onExport={() => console.log('Export health chart')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
            {/* Pie Chart */}
            <div className="flex flex-col">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">
                KPI Values Distribution
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status Summary */}
            <div className="flex flex-col">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">
                Status Summary
              </h4>
              <div className="space-y-4 flex-1">
                {kpis.map((kpi, index) => (
                  <div key={kpi.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-3 h-3 rounded-full',
                        kpi.status === 'good' && 'bg-green-500',
                        kpi.status === 'warning' && 'bg-yellow-500',
                        kpi.status === 'critical' && 'bg-red-500'
                      )} />
                      <span className="text-sm font-medium">{kpi.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {kpi.value.toFixed(1)}{kpi.unit && ` ${kpi.unit}`}
                      </div>
                      <div className={cn(
                        'text-xs',
                        kpi.status === 'good' && 'text-green-600',
                        kpi.status === 'warning' && 'text-yellow-600',
                        kpi.status === 'critical' && 'text-red-600'
                      )}>
                        {kpi.status?.toUpperCase() || 'GOOD'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

export default KpiCharts;