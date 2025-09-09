// app/api/predictions/route.ts - API route for ML predictions
import { NextRequest, NextResponse } from 'next/server';
import { mockPredictions, mockTrains } from '@/services/mockData';
import { Prediction, Train, ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // TODO: In production, replace with actual ML prediction service
    // const predictions = await mlPredictionService.getCurrentPredictions();
    
    // Simulate ML processing delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const response: ApiResponse<Prediction[]> = {
      data: mockPredictions,
      success: true,
      message: 'Predictions retrieved successfully',
      timestamp: new Date().toISOString(),
      metadata: {
        total: mockPredictions.length,
        modelVersion: 'v2.1.3',
        accuracy: 0.87
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    
    const errorResponse = {
      success: false,
      error: 'Failed to fetch predictions',
      code: 'PREDICTIONS_FETCH_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trainIds, timestamp, networkConditions } = body;
    
    // TODO: In production, call actual ML prediction service
    // Example production call:
    // const predictions = await mlPredictionService.getPredictions({
    //   trainIds,
    //   currentTime: timestamp,
    //   networkState: networkConditions,
    //   predictionHorizon: 60, // minutes
    //   modelVersion: 'v2.1.3',
    //   includeConfidence: true,
    //   includeFactors: true
    // });
    
    // Simulate ML model processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate predictions for requested trains
    const requestedTrains = trainIds 
      ? mockTrains.filter((t: Train) => trainIds.includes(t.id))
      : mockTrains;

    const generatedPredictions: Prediction[] = requestedTrains.map((train: Train) => {
      // Simulate ML prediction logic
      const baseDelay = train.delayMinutes || 0;
      const variation = Math.random() * 10 - 5; // -5 to +5 minutes variation
      const predictedDelay = Math.max(0, Math.round(baseDelay + variation));
      
      // Simulate confidence based on various factors
      let confidence = 0.7 + Math.random() * 0.25; // Base confidence 0.7-0.95
      
      // Lower confidence for higher delays (more uncertainty)
      if (predictedDelay > 20) confidence *= 0.9;
      if (predictedDelay > 40) confidence *= 0.8;
      
      // Determine prediction factors
      const factors = [];
      if (baseDelay > 0) factors.push('current_delay');
      if (Math.random() > 0.7) factors.push('weather_conditions');
      if (Math.random() > 0.8) factors.push('track_congestion');
      if (Math.random() > 0.9) factors.push('equipment_issue');
      if (factors.length === 0) factors.push('normal_variation');

      return {
        trainId: train.id,
        delayMinutes: predictedDelay,
        confidence: Math.round(confidence * 100) / 100,
        predictedArrival: calculatePredictedArrival(train, predictedDelay),
        factors,
        modelVersion: 'v2.1.3'
      };
    });

    const response: ApiResponse<Prediction[]> = {
      data: generatedPredictions,
      success: true,
      message: 'Predictions generated successfully',
      timestamp: new Date().toISOString(),
      metadata: {
        total: generatedPredictions.length,
        modelVersion: 'v2.1.3',
        processingTime: '0.3s',
        averageConfidence: generatedPredictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / generatedPredictions.length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating predictions:', error);
    
    const errorResponse = {
      success: false,
      error: 'Failed to generate predictions',
      code: 'PREDICTIONS_GENERATION_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Helper function to calculate predicted arrival time
function calculatePredictedArrival(train: Train, delayMinutes: number): string {
  if (!train.scheduledArrival) return '';
  
  try {
    // Parse scheduled arrival (assuming HH:MM format)
    const [hours, minutes] = train.scheduledArrival.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // Add delay
    const predictedTime = new Date(scheduledTime.getTime() + delayMinutes * 60 * 1000);
    
    // Format as HH:MM
    return predictedTime.toTimeString().slice(0, 5);
  } catch (error) {
    // If parsing fails, return original scheduled time
    return train.scheduledArrival;
  }
}