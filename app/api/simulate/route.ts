// app/api/simulate/route.ts - API route for what-if simulations
import { NextRequest, NextResponse } from 'next/server';
import { mockSimulationResult, mockTrains } from '@/services/mockData';
import { WhatIfPayload, SimulationResult, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload: WhatIfPayload = body;
    
    // TODO: In production, call actual discrete event simulation engine
    // Example production call:
    // const result = await simulationEngine.runScenario({
    //   scenario: payload,
    //   simulationParams: {
    //     timeHorizon: 240, // minutes
    //     timeStep: 1, // minute resolution
    //     monteCarloRuns: 100,
    //     confidenceLevel: 0.95
    //   },
    //   networkModel: {
    //     topology: getNetworkTopology(),
    //     capacityConstraints: getCapacityConstraints(),
    //     signalSystems: getSignalSystems()
    //   },
    //   externalFactors: {
    //     weather: getCurrentWeather(),
    //     maintenance: getScheduledMaintenance(),
    //     events: getSpecialEvents()
    //   }
    // });
    
    // Simulate processing time for realistic experience
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find the train being simulated
    const train = mockTrains.find(t => t.id === payload.trainId);
    if (!train) {
      throw new Error(`Train ${payload.trainId} not found`);
    }

    // Generate simulation result based on payload
    const scenarioId = `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate projected KPIs based on scenario
    const baselineDelay = train.delayMinutes || 0;
    const additionalDelay = payload.delayMinutes || 0;
    const totalDelay = baselineDelay + additionalDelay;
    
    // Simulate impact calculations
    const delayImpact = calculateDelayImpact(totalDelay, payload.rerouteTo);
    const throughputImpact = calculateThroughputImpact(totalDelay, payload.rerouteTo);
    const safetyImpact = calculateSafetyImpact(totalDelay, payload.rerouteTo);
    const costImpact = calculateCostImpact(totalDelay, payload.rerouteTo);
    
    // Generate time series data for charts
    const chartData = generateSimulationChartData(totalDelay, payload.rerouteTo);
    
    const simulationResult: SimulationResult = {
      scenarioId,
      projectedKPIs: {
        delay: delayImpact.finalDelay,
        throughput: throughputImpact.finalThroughput,
        safety: safetyImpact.level,
        cost: costImpact.totalCost,
        utilization: Math.max(0, Math.min(100, 78.3 + (totalDelay * -0.5) + (payload.rerouteTo ? 5 : 0)))
      },
      chartData,
      comparisonData: {
        baseline: {
          delay: baselineDelay,
          throughput: 142,
          safety: 'medium'
        },
        projected: {
          delay: delayImpact.finalDelay,
          throughput: throughputImpact.finalThroughput,
          safety: safetyImpact.level
        }
      },
      recommendations: generateRecommendations(payload, delayImpact, throughputImpact, safetyImpact)
    };

    const response: ApiResponse<SimulationResult> = {
      data: simulationResult,
      success: true,
      message: 'Simulation completed successfully',
      timestamp: new Date().toISOString(),
      metadata: {
        processingTime: '0.8s',
        scenarioType: payload.rerouteTo ? 'reroute_simulation' : 'delay_simulation',
        trainId: payload.trainId
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error running simulation:', error);
    
    const errorResponse = {
      success: false,
      error: 'Failed to run simulation',
      code: 'SIMULATION_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Helper functions to simulate various impact calculations

function calculateDelayImpact(totalDelay: number, rerouteTo?: string) {
  let finalDelay = totalDelay;
  
  // Rerouting can reduce delay but adds some base time
  if (rerouteTo) {
    finalDelay = Math.max(0, totalDelay * 0.7 + 5); // 30% delay reduction but 5 min reroute time
  }
  
  // Network congestion effects
  if (totalDelay > 30) {
    finalDelay += Math.random() * 10; // Cascading delays
  }
  
  return {
    finalDelay: Math.round(finalDelay * 10) / 10,
    cascadingEffect: totalDelay > 30 ? 'high' : totalDelay > 15 ? 'medium' : 'low'
  };
}

function calculateThroughputImpact(totalDelay: number, rerouteTo?: string) {
  let baseThroughput = 142;
  
  // Delays reduce throughput
  let throughputReduction = totalDelay * 0.3;
  
  // Rerouting can help maintain throughput
  if (rerouteTo) {
    throughputReduction *= 0.6; // Rerouting mitigates 40% of throughput loss
  }
  
  const finalThroughput = Math.max(100, baseThroughput - throughputReduction);
  
  return {
    finalThroughput: Math.round(finalThroughput * 10) / 10,
    reductionPercent: Math.round((throughputReduction / baseThroughput) * 100)
  };
}

function calculateSafetyImpact(totalDelay: number, rerouteTo?: string): { level: string; score: number } {
  let safetyScore = 90; // Base safety score
  
  // High delays can impact safety
  if (totalDelay > 40) {
    safetyScore -= 15;
  } else if (totalDelay > 20) {
    safetyScore -= 8;
  }
  
  // Rerouting maintains better safety
  if (rerouteTo) {
    safetyScore += 5;
  }
  
  const level = safetyScore >= 85 ? 'high' : safetyScore >= 70 ? 'medium' : 'low';
  
  return {
    level,
    score: Math.max(0, Math.min(100, safetyScore))
  };
}

function calculateCostImpact(totalDelay: number, rerouteTo?: string) {
  let baseCost = 500; // Base operational cost
  
  // Delays increase costs
  let delayCost = totalDelay * 50; // $50 per minute of delay
  
  // Rerouting has additional costs
  let rerouteCost = rerouteTo ? 800 : 0;
  
  const totalCost = baseCost + delayCost + rerouteCost;
  
  return {
    totalCost,
    breakdown: {
      operational: baseCost,
      delay: delayCost,
      reroute: rerouteCost
    }
  };
}

function generateSimulationChartData(totalDelay: number, rerouteTo?: string) {
  const chartData = [];
  const startTime = new Date();
  startTime.setHours(9, 0, 0, 0); // Start at 9:00 AM
  
  for (let i = 0; i <= 60; i += 15) { // 15-minute intervals for 1 hour
    const time = new Date(startTime.getTime() + i * 60 * 1000);
    const timeStr = time.toTimeString().slice(0, 5);
    
    // Simulate delay progression
    let currentDelay = totalDelay;
    if (rerouteTo && i >= 30) {
      // Rerouting effect kicks in after 30 minutes
      currentDelay = Math.max(0, totalDelay * 0.7);
    }
    
    // Add some realistic variation
    currentDelay += (Math.random() - 0.5) * 2;
    
    // Calculate corresponding throughput
    const throughput = Math.max(100, 142 - (currentDelay * 0.3));
    
    // Calculate utilization
    const utilization = Math.max(0, Math.min(100, 78.3 - (currentDelay * 0.2)));
    
    chartData.push({
      time: timeStr,
      delay: Math.round(Math.max(0, currentDelay) * 10) / 10,
      throughput: Math.round(throughput * 10) / 10,
      utilization: Math.round(utilization * 10) / 10
    });
  }
  
  return chartData;
}

function generateRecommendations(
  payload: WhatIfPayload, 
  delayImpact: any, 
  throughputImpact: any, 
  safetyImpact: any
): string[] {
  const recommendations = [];
  
  if (delayImpact.finalDelay > 20) {
    recommendations.push('Consider implementing priority scheduling to reduce cascading delays');
  }
  
  if (throughputImpact.reductionPercent > 15) {
    recommendations.push('Network throughput significantly impacted - evaluate alternative routing options');
  }
  
  if (safetyImpact.level === 'low') {
    recommendations.push('Safety concerns identified - recommend additional monitoring and contingency planning');
  }
  
  if (payload.rerouteTo) {
    recommendations.push(`Rerouting to ${payload.rerouteTo} shows positive impact - consider implementation`);
  } else {
    recommendations.push('Evaluate rerouting options to mitigate delay impact');
  }
  
  if (delayImpact.cascadingEffect === 'high') {
    recommendations.push('High risk of cascading delays - prepare network-wide contingency measures');
  }
  
  return recommendations;
}