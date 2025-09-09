// app/api/kpis/route.ts - API route for KPI data
import { NextRequest, NextResponse } from 'next/server';
import { mockKPIs, mockDelayTrendData, mockChartData } from '@/services/mockData';
import { KPI, ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHistory = searchParams.get('includeHistory') === 'true';
    const timeRange = searchParams.get('timeRange') || '1h';
    
    // TODO: In production, replace with actual KPI calculation service
    // const kpis = await kpiService.getCurrentKPIs({
    //   includeHistory,
    //   timeRange,
    //   calculations: ['throughput', 'delay', 'utilization', 'acceptance_rate'],
    //   aggregation: 'real_time'
    // });
    
    // Simulate real-time KPI updates with slight variations
    const updatedKPIs: KPI[] = mockKPIs.map(kpi => {
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const newValue = kpi.value * (1 + variation);
      
      // Calculate trend and change
      const change = newValue - kpi.value;
      const changePercent = (change / kpi.value) * 100;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (Math.abs(changePercent) > 1) {
        trend = changePercent > 0 ? 'up' : 'down';
      }
      
      // Determine status based on target and current value
      let status: 'good' | 'warning' | 'critical' = 'good';
      if (kpi.target) {
        const targetDiff = Math.abs(newValue - kpi.target) / kpi.target;
        if (targetDiff > 0.2) status = 'critical';
        else if (targetDiff > 0.1) status = 'warning';
      }
      
      return {
        ...kpi,
        value: Math.round(newValue * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        trend,
        status
      };
    });

    // Prepare response data
    const responseData: any = {
      kpis: updatedKPIs,
      lastUpdated: new Date().toISOString(),
      networkStatus: 'normal', // TODO: Calculate based on actual network conditions
      summary: {
        totalTrains: 4, // TODO: Get from actual train count
        delayedTrains: 2, // TODO: Calculate from actual delayed trains
        activeRecommendations: 1, // TODO: Get from recommendations service
        systemHealth: calculateSystemHealth(updatedKPIs)
      }
    };

    // Include historical data if requested
    if (includeHistory) {
      responseData.history = {
        throughput: generateHistoricalData('throughput', timeRange),
        delay: generateHistoricalData('delay', timeRange),
        utilization: generateHistoricalData('utilization', timeRange),
        acceptanceRate: generateHistoricalData('acceptanceRate', timeRange)
      };
    }

    const response: ApiResponse<typeof responseData> = {
      data: responseData,
      success: true,
      message: 'KPIs retrieved successfully',
      timestamp: new Date().toISOString(),
      metadata: {
        kpiCount: updatedKPIs.length,
        includeHistory,
        timeRange,
        systemHealth: responseData.summary.systemHealth
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    
    const errorResponse = {
      success: false,
      error: 'Failed to fetch KPIs',
      code: 'KPI_FETCH_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kpiName, customCalculation, timeRange } = body;
    
    // TODO: In production, implement custom KPI calculations
    // const result = await kpiService.calculateCustomKPI({
    //   name: kpiName,
    //   calculation: customCalculation,
    //   timeRange,
    //   dataSource: 'real_time'
    // });
    
    // For demo, generate a custom KPI based on request
    const customKPI: KPI = {
      name: kpiName || 'Custom Metric',
      value: Math.round((Math.random() * 100) * 100) / 100,
      unit: body.unit || 'units',
      target: body.target,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: Math.round((Math.random() * 10 - 5) * 100) / 100,
      changePercent: Math.round((Math.random() * 20 - 10) * 100) / 100,
      status: 'good'
    };

    const response: ApiResponse<{ kpi: KPI; calculation: string }> = {
      data: {
        kpi: customKPI,
        calculation: customCalculation || 'Standard calculation applied'
      },
      success: true,
      message: 'Custom KPI calculated successfully',
      timestamp: new Date().toISOString(),
      metadata: {
        customKPI: true,
        calculationTime: '0.1s'
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error calculating custom KPI:', error);
    
    const errorResponse = {
      success: false,
      error: 'Failed to calculate custom KPI',
      code: 'KPI_CALCULATION_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Helper function to calculate overall system health
function calculateSystemHealth(kpis: KPI[]): 'excellent' | 'good' | 'warning' | 'critical' {
  const statusCounts = kpis.reduce((counts, kpi) => {
    counts[kpi.status || 'good'] = (counts[kpi.status || 'good'] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const total = kpis.length;
  const criticalPercent = (statusCounts.critical || 0) / total;
  const warningPercent = (statusCounts.warning || 0) / total;
  const goodPercent = (statusCounts.good || 0) / total;

  if (criticalPercent > 0.3) return 'critical';
  if (criticalPercent > 0 || warningPercent > 0.5) return 'warning';
  if (goodPercent > 0.8) return 'excellent';
  return 'good';
}

// Helper function to generate historical data for KPIs
function generateHistoricalData(metric: string, timeRange: string) {
  const points = timeRange === '1h' ? 12 : timeRange === '6h' ? 24 : 48; // 5min, 15min, or 30min intervals
  const interval = timeRange === '1h' ? 5 : timeRange === '6h' ? 15 : 30; // minutes
  
  const data = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval * 60 * 1000);
    const timeStr = time.toTimeString().slice(0, 5);
    
    let value: number;
    switch (metric) {
      case 'throughput':
        value = 140 + Math.random() * 20 + Math.sin(i * 0.3) * 10; // Oscillating around 150
        break;
      case 'delay':
        value = 8 + Math.random() * 6 + Math.sin(i * 0.2) * 3; // Oscillating around 8-10
        break;
      case 'utilization':
        value = 75 + Math.random() * 15 + Math.sin(i * 0.4) * 8; // Oscillating around 80
        break;
      case 'acceptanceRate':
        value = 85 + Math.random() * 10 + Math.sin(i * 0.1) * 5; // Oscillating around 90
        break;
      default:
        value = Math.random() * 100;
    }
    
    data.push({
      time: timeStr,
      value: Math.round(Math.max(0, value) * 100) / 100,
      label: metric,
      category: 'historical'
    });
  }
  
  return data;
}