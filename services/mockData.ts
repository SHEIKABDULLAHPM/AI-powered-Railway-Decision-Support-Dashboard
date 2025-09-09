// services/mockData.ts - Seeded mock data for development and testing
import { 
  Train, 
  Recommendation, 
  Alternative, 
  KPI, 
  AuditLog, 
  ChatbotMessage, 
  SimulationResult, 
  Prediction,
  ChatSession,
  ChartDataPoint,
  SystemState
} from '@/lib/types';

// Mock Trains - 4 trains with different statuses
export const mockTrains: Train[] = [
  {
    id: "train-001",
    number: "IC-2847",
    origin: "London Paddington",
    destination: "Cardiff Central",
    scheduledArrival: "14:30",
    scheduledDeparture: "09:15",
    delayMinutes: 12,
    status: "delayed",
    currentLocation: "Reading",
    capacity: 400,
    passengers: 287
  },
  {
    id: "train-002", 
    number: "HST-1205",
    origin: "Edinburgh Waverley",
    destination: "London King's Cross",
    scheduledArrival: "16:45",
    scheduledDeparture: "11:30",
    delayMinutes: 0,
    status: "on-time",
    currentLocation: "York",
    capacity: 550,
    passengers: 423
  },
  {
    id: "train-003",
    number: "REG-4401",
    origin: "Manchester Piccadilly", 
    destination: "Liverpool Lime Street",
    scheduledArrival: "15:20",
    scheduledDeparture: "14:35",
    delayMinutes: 25,
    status: "delayed",
    currentLocation: "Warrington",
    capacity: 200,
    passengers: 145
  },
  {
    id: "train-004",
    number: "EXP-7739",
    origin: "Bristol Temple Meads",
    destination: "London Paddington", 
    scheduledArrival: "17:10",
    scheduledDeparture: "15:45",
    delayMinutes: 0,
    status: "at-platform",
    currentLocation: "Bristol Temple Meads",
    capacity: 350,
    passengers: 298
  }
];

// Mock Alternatives for recommendations
export const mockAlternatives: Alternative[] = [
  {
    id: "alt-001",
    action: "Reroute via Oxford",
    description: "Alternative route through Oxford to avoid congestion at Reading",
    kpis: {
      delayReduction: 8,
      throughput: 95,
      safety: "high",
      cost: 1200,
      passengerImpact: 15
    },
    estimatedDuration: 45,
    riskLevel: "low"
  },
  {
    id: "alt-002", 
    action: "Priority scheduling at next junction",
    description: "Give train priority at next signal to minimize further delays",
    kpis: {
      delayReduction: 5,
      throughput: 88,
      safety: "medium",
      cost: 300,
      passengerImpact: 8
    },
    estimatedDuration: 15,
    riskLevel: "medium"
  }
];

// Mock Recommendations - 1 active recommendation with alternatives
export const mockRecommendations: Recommendation[] = [
  {
    id: "rec-001",
    trainId: "train-001",
    action: "Implement dynamic rerouting for IC-2847",
    rationale: "Train IC-2847 is experiencing 12-minute delay due to signal failure at Reading. Rerouting via Oxford will reduce delay and improve overall network throughput.",
    confidence: 0.87,
    kpis: {
      delayReduction: 8,
      throughput: 95,
      safety: "high", 
      cost: 1200,
      passengerImpact: 15
    },
    alternatives: mockAlternatives,
    createdAt: new Date().toISOString(),
    priority: "high",
    status: "pending",
    estimatedImpact: {
      delayReduction: 8,
      costSavings: 2500,
      passengerBenefit: 287
    }
  }
];

// Mock KPIs - Key performance indicators
export const mockKPIs: KPI[] = [
  {
    name: "Throughput",
    value: 142,
    unit: "trains/hour",
    target: 150,
    trend: "up",
    change: 5,
    changePercent: 3.6,
    status: "good"
  },
  {
    name: "Average Delay", 
    value: 8.4,
    unit: "minutes",
    target: 5.0,
    trend: "down",
    change: -1.2,
    changePercent: -12.5,
    status: "warning"
  },
  {
    name: "Network Utilization",
    value: 78.3,
    unit: "%",
    target: 85.0,
    trend: "stable",
    change: 0.1,
    changePercent: 0.1,
    status: "good"
  },
  {
    name: "AI Acceptance Rate",
    value: 89.2,
    unit: "%", 
    target: 90.0,
    trend: "up",
    change: 2.3,
    changePercent: 2.6,
    status: "good"
  }
];

// Mock Audit Logs - 3 recent entries
export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    recId: "rec-001",
    trainId: "train-001", 
    action: "Recommendation Generated",
    actor: "AI System",
    reason: "Automatic optimization trigger due to delay threshold exceeded",
    details: {
      triggerType: "delay_threshold",
      delayMinutes: 12,
      confidence: 0.87
    },
    outcome: "success"
  },
  {
    id: "audit-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    recId: "rec-002", 
    trainId: "train-002",
    action: "Recommendation Accepted",
    actor: "Controller: Sarah Mitchell",
    reason: "Approved priority scheduling to maintain on-time performance",
    details: {
      originalDelay: 3,
      projectedImprovement: 2,
      approvalTime: 30
    },
    outcome: "success",
    impactMetrics: {
      delayChange: -2,
      throughputChange: 3,
      costImpact: 150
    }
  },
  {
    id: "audit-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    recId: "rec-003",
    trainId: "train-003",
    action: "Recommendation Overridden",
    actor: "Controller: James Wilson", 
    reason: "Alternative route selected due to passenger comfort considerations",
    details: {
      originalRecommendation: "Express routing",
      selectedAlternative: "Standard routing with additional stops",
      overrideReason: "passenger_comfort"
    },
    outcome: "partial",
    impactMetrics: {
      delayChange: 5,
      throughputChange: -2,
      costImpact: -300
    }
  }
];

// Mock Predictions
export const mockPredictions: Prediction[] = [
  {
    trainId: "train-001",
    delayMinutes: 15,
    confidence: 0.92,
    predictedArrival: "14:45",
    factors: ["signal_failure", "track_congestion"],
    modelVersion: "v2.1.3"
  },
  {
    trainId: "train-002", 
    delayMinutes: 2,
    confidence: 0.78,
    predictedArrival: "16:47",
    factors: ["normal_variation"],
    modelVersion: "v2.1.3"
  },
  {
    trainId: "train-003",
    delayMinutes: 30,
    confidence: 0.85,
    predictedArrival: "15:50", 
    factors: ["weather_conditions", "equipment_issue"],
    modelVersion: "v2.1.3"
  },
  {
    trainId: "train-004",
    delayMinutes: 0,
    confidence: 0.95,
    predictedArrival: "17:10",
    factors: ["optimal_conditions"],
    modelVersion: "v2.1.3"
  }
];

// Mock Chat Messages - 3 canned examples
export const mockChatMessages: ChatbotMessage[] = [
  {
    id: "msg-001",
    role: "user",
    text: "Why is train IC-2847 recommended for rerouting?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    intent: "explain_recommendation"
  },
  {
    id: "msg-002", 
    role: "assistant",
    text: "Train IC-2847 is recommended for rerouting because it's currently delayed by 12 minutes due to signal failure at Reading. The AI system identified that rerouting via Oxford would reduce the delay by 8 minutes and improve overall network throughput to 95%. This recommendation has 87% confidence based on current network conditions.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    references: [
      {
        source: "recommendation",
        id: "rec-001",
        title: "Dynamic Rerouting Recommendation"
      }
    ],
    actionable: false
  },
  {
    id: "msg-003",
    role: "user", 
    text: "Simulate 15 minute delay for train HST-1205",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    intent: "simulate_scenario"
  }
];

// Mock Chat Session
export const mockChatSession: ChatSession = {
  sessionId: "session-001",
  messages: mockChatMessages,
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  lastActive: new Date().toISOString(),
  context: {
    currentPage: "dashboard",
    selectedTrains: ["train-001"],
    activeRecommendations: ["rec-001"]
  }
};

// Mock Simulation Result
export const mockSimulationResult: SimulationResult = {
  scenarioId: "sim-001",
  projectedKPIs: {
    delay: 6.2,
    throughput: 148,
    safety: "high",
    cost: 1200,
    utilization: 82.1
  },
  chartData: [
    { time: "09:00", delay: 8.4, throughput: 142, utilization: 78.3 },
    { time: "09:15", delay: 7.8, throughput: 144, utilization: 79.1 },
    { time: "09:30", delay: 7.2, throughput: 146, utilization: 80.5 },
    { time: "09:45", delay: 6.8, throughput: 147, utilization: 81.2 },
    { time: "10:00", delay: 6.2, throughput: 148, utilization: 82.1 }
  ],
  comparisonData: {
    baseline: { delay: 8.4, throughput: 142, safety: "medium" },
    projected: { delay: 6.2, throughput: 148, safety: "high" }
  },
  recommendations: [
    "Implement rerouting for IC-2847 immediately",
    "Monitor REG-4401 for potential cascading delays",
    "Prepare contingency for weather impact on HST-1205"
  ]
};

// Mock Chart Data for various visualizations
export const mockChartData: ChartDataPoint[] = [
  { time: "08:00", value: 145, label: "Throughput", category: "performance" },
  { time: "09:00", value: 142, label: "Throughput", category: "performance" },
  { time: "10:00", value: 148, label: "Throughput", category: "performance" },
  { time: "11:00", value: 151, label: "Throughput", category: "performance" },
  { time: "12:00", value: 147, label: "Throughput", category: "performance" }
];

export const mockDelayTrendData: ChartDataPoint[] = [
  { time: "08:00", value: 9.2, label: "Average Delay", category: "delay" },
  { time: "09:00", value: 8.4, label: "Average Delay", category: "delay" },
  { time: "10:00", value: 7.8, label: "Average Delay", category: "delay" },
  { time: "11:00", value: 6.9, label: "Average Delay", category: "delay" },
  { time: "12:00", value: 6.2, label: "Average Delay", category: "delay" }
];

// Mock System State
export const mockSystemState: SystemState = {
  trains: mockTrains,
  recommendations: mockRecommendations,
  kpis: mockKPIs,
  timestamp: new Date().toISOString(),
  networkStatus: "normal",
  activeIncidents: 1
};

// Helper functions for generating additional mock data
export const generateMockTrain = (id: string, number: string): Train => ({
  id,
  number,
  origin: "Mock Origin",
  destination: "Mock Destination", 
  scheduledArrival: "12:00",
  scheduledDeparture: "10:00",
  delayMinutes: Math.floor(Math.random() * 30),
  status: Math.random() > 0.7 ? "delayed" : "on-time",
  capacity: 300 + Math.floor(Math.random() * 300),
  passengers: Math.floor(Math.random() * 400)
});

export const generateMockRecommendation = (id: string, trainId: string): Recommendation => ({
  id,
  trainId,
  action: `Optimization recommendation for ${trainId}`,
  rationale: "Generated recommendation based on current system state",
  confidence: 0.7 + Math.random() * 0.3,
  kpis: {
    delayReduction: Math.floor(Math.random() * 15),
    throughput: 80 + Math.floor(Math.random() * 20),
    safety: Math.random() > 0.5 ? "high" : "medium"
  },
  alternatives: [],
  createdAt: new Date().toISOString(),
  priority: "medium",
  status: "pending"
});

export const generateMockAuditLog = (id: string, action: string, actor: string): AuditLog => ({
  id,
  timestamp: new Date().toISOString(),
  action,
  actor,
  reason: "Mock audit entry",
  outcome: "success"
});

// Export all mock data as default collection
export const mockData = {
  trains: mockTrains,
  recommendations: mockRecommendations,
  alternatives: mockAlternatives,
  kpis: mockKPIs,
  auditLogs: mockAuditLogs,
  predictions: mockPredictions,
  chatMessages: mockChatMessages,
  chatSession: mockChatSession,
  simulationResult: mockSimulationResult,
  chartData: mockChartData,
  delayTrendData: mockDelayTrendData,
  systemState: mockSystemState
};

export default mockData;