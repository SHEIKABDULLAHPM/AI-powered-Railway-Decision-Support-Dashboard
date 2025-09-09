// app/api/trains/route.ts - API route for train data
import { NextRequest, NextResponse } from 'next/server';
import { mockTrains } from '@/services/mockData';
import { Train, ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // TODO: In production, replace with actual train data service
    // const trains = await trainDataService.getCurrentTrains();
    
    // Simulate API delay for realistic development experience
    await new Promise(resolve => setTimeout(resolve, 100));

    const response: ApiResponse<Train[]> = {
      data: mockTrains,
      success: true,
      message: 'Trains retrieved successfully',
      timestamp: new Date().toISOString(),
      metadata: {
        total: mockTrains.length,
        page: 1,
        pageSize: mockTrains.length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching trains:', error);
    
    const errorResponse = {
      success: false,
      error: 'Failed to fetch trains',
      code: 'TRAINS_FETCH_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: In production, implement train creation/update
    // const result = await trainDataService.updateTrain(body);
    
    // For now, return success response
    const response: ApiResponse<{ message: string }> = {
      data: { message: 'Train update received' },
      success: true,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating train:', error);
    
    const errorResponse = {
      success: false,
      error: 'Failed to update train',
      code: 'TRAIN_UPDATE_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}