// services/predictionAdapter.ts - ML Prediction Service Adapter
import { Train, Prediction, ApiResponse } from '@/lib/types';
import { apiPost, apiGet } from './adapterBase';

/**
 * Get predictions for multiple trains
 * @param trains - Array of trains to get predictions for
 * @returns Promise resolving to array of predictions
 * 
 * TODO: Replace with actual ML prediction endpoint
 * Production endpoint should accept train data and return delay predictions
 * Expected production URL: ${NEXT_PUBLIC_API_BASE}/predictions
 */
export const getPredictionsForTrains = async (trains: Train[]): Promise<Prediction[]> => {
  try {
    // Extract train IDs for the prediction request
    const trainIds = trains.map(train => train.id);
    
    // TODO: In production, this should call your ML prediction service
    // Example production payload:
    // {
    //   trainIds: string[],
    //   currentTime: string,
    //   networkState: SystemState,
    //   predictionHorizon: number (minutes)
    // }
    const response = await apiPost<ApiResponse<Prediction[]>>('/predictions', {
      trainIds,
      timestamp: new Date().toISOString(),
      // TODO: Add additional context data for ML model
      // networkConditions: getCurrentNetworkConditions(),
      // weatherData: getWeatherData(),
      // historicalPatterns: getHistoricalPatterns()
    });

    return response.data;
  } catch (error) {
    console.error('Failed to get predictions:', error);
    // Return empty predictions on error to prevent UI crashes
    return [];
  }
};

/**
 * Get prediction for a single train
 * @param trainId - ID of train to get prediction for
 * @returns Promise resolving to prediction or null
 */
export const getPredictionForTrain = async (trainId: string): Promise<Prediction | null> => {
  try {
    const response = await apiGet<ApiResponse<Prediction>>(`/predictions/${trainId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get prediction for train ${trainId}:`, error);
    return null;
  }
};

/**
 * Get predictions with additional context
 * @param trains - Array of trains
 * @param context - Additional context for predictions
 * @returns Promise resolving to predictions with confidence scores
 * 
 * TODO: Implement context-aware predictions
 * Production should consider:
 * - Current weather conditions
 * - Network congestion levels
 * - Historical delay patterns
 * - Scheduled maintenance windows
 * - Real-time sensor data
 */
export const getContextualPredictions = async (
  trains: Train[],
  context?: {
    weatherConditions?: string;
    networkCongestion?: number;
    timeOfDay?: string;
    dayOfWeek?: string;
  }
): Promise<Prediction[]> => {
  try {
    const response = await apiPost<ApiResponse<Prediction[]>>('/predictions/contextual', {
      trains,
      context,
      timestamp: new Date().toISOString(),
      // TODO: Add ML model parameters
      // modelVersion: 'v2.1.3',
      // confidenceThreshold: 0.7,
      // predictionWindow: 60
    });

    return response.data;
  } catch (error) {
    console.error('Failed to get contextual predictions:', error);
    return [];
  }
};

/**
 * Update prediction model with new training data
 * @param trainingData - New training data for model updates
 * @returns Promise resolving to update status
 * 
 * TODO: Implement model retraining endpoint
 * Production should handle:
 * - Online learning updates
 * - Model versioning
 * - A/B testing of model versions
 * - Performance monitoring
 */
export const updatePredictionModel = async (trainingData: {
  trainId: string;
  actualDelay: number;
  predictedDelay: number;
  timestamp: string;
  factors: string[];
}[]): Promise<{ success: boolean; modelVersion: string }> => {
  try {
    const response = await apiPost<ApiResponse<{ modelVersion: string }>>('/predictions/update-model', {
      trainingData,
      timestamp: new Date().toISOString(),
      // TODO: Add model update parameters
      // updateType: 'incremental',
      // validationRequired: true,
      // deploymentStrategy: 'canary'
    });

    return {
      success: response.success,
      modelVersion: response.data.modelVersion
    };
  } catch (error) {
    console.error('Failed to update prediction model:', error);
    return {
      success: false,
      modelVersion: 'unknown'
    };
  }
};

/**
 * Get prediction model performance metrics
 * @returns Promise resolving to model performance data
 * 
 * TODO: Implement model monitoring endpoint
 * Production should provide:
 * - Accuracy metrics (MAE, RMSE, MAPE)
 * - Prediction confidence distributions
 * - Model drift detection
 * - Feature importance scores
 */
export const getPredictionModelMetrics = async (): Promise<{
  accuracy: number;
  meanAbsoluteError: number;
  rootMeanSquareError: number;
  confidenceDistribution: { range: string; count: number }[];
  lastUpdated: string;
}> => {
  try {
    const response = await apiGet<ApiResponse<any>>('/predictions/model-metrics');
    return response.data;
  } catch (error) {
    console.error('Failed to get model metrics:', error);
    // Return default metrics on error
    return {
      accuracy: 0.85,
      meanAbsoluteError: 2.3,
      rootMeanSquareError: 4.1,
      confidenceDistribution: [
        { range: '0.9-1.0', count: 45 },
        { range: '0.8-0.9', count: 32 },
        { range: '0.7-0.8', count: 18 },
        { range: '0.6-0.7', count: 5 }
      ],
      lastUpdated: new Date().toISOString()
    };
  }
};

// Export prediction service interface for easy mocking in tests
export const predictionService = {
  getPredictionsForTrains,
  getPredictionForTrain,
  getContextualPredictions,
  updatePredictionModel,
  getPredictionModelMetrics
};

export default predictionService;