// lib/types.ts - Single source of truth for all type definitions

export type TrainStatus = "on-time" | "delayed" | "stopped" | "at-platform";

export type Train = {
  id: string;
  number: string;
  origin?: string;
  destination?: string;
  scheduledArrival?: string; // ISO datetime or HH:MM
  scheduledDeparture?: string;
  delayMinutes?: number;
  status?: TrainStatus;
  currentLocation?: string;
  capacity?: number;
  passengers?: number;
};

export type Alternative = {
  id: string;
  action: string;
  kpis: { 
    delayReduction: number; 
    throughput: number; 
    safety: string;
    cost?: number;
    passengerImpact?: number;
  };
  description?: string;
  estimatedDuration?: number;
  riskLevel?: "low" | "medium" | "high";
};

export type Recommendation = {
  id: string;
  trainId?: string;
  action: string;
  rationale: string;
  confidence: number; // 0..1
  kpis: { 
    delayReduction: number; 
    throughput: number; 
    safety: string;
    cost?: number;
    passengerImpact?: number;
  };
  alternatives: Alternative[];
  createdAt?: string;
  priority?: "low" | "medium" | "high" | "critical";
  status?: "pending" | "accepted" | "rejected" | "expired";
  estimatedImpact?: {
    delayReduction: number;
    costSavings: number;
    passengerBenefit: number;
  };
};

export type Prediction = { 
  trainId: string; 
  delayMinutes: number; 
  confidence?: number;
  predictedArrival?: string;
  factors?: string[];
  modelVersion?: string;
};

export type SimulationResult = { 
  scenarioId: string; 
  projectedKPIs: { 
    delay: number; 
    throughput: number; 
    safety: string;
    cost?: number;
    utilization?: number;
  }; 
  chartData?: { 
    time: string; 
    delay: number;
    throughput?: number;
    utilization?: number;
  }[];
  comparisonData?: {
    baseline: { delay: number; throughput: number; safety: string };
    projected: { delay: number; throughput: number; safety: string };
  };
  recommendations?: string[];
};

export type AuditLog = { 
  id: string; 
  timestamp: string; 
  recId?: string; 
  trainId?: string; 
  action: string; 
  actor: string; 
  reason?: string; 
  details?: any;
  outcome?: "success" | "failure" | "partial";
  impactMetrics?: {
    delayChange: number;
    throughputChange: number;
    costImpact: number;
  };
};

export type KPI = { 
  name: string; 
  value: number; 
  unit?: string;
  target?: number;
  trend?: "up" | "down" | "stable";
  change?: number;
  changePercent?: number;
  status?: "good" | "warning" | "critical";
};

export type SystemState = { 
  trains: Train[]; 
  recommendations?: Recommendation[]; 
  kpis?: KPI[];
  timestamp?: string;
  networkStatus?: "normal" | "congested" | "disrupted";
  activeIncidents?: number;
};

export type WhatIfPayload = { 
  trainId: string; 
  delayMinutes?: number; 
  rerouteTo?: string;
  scenarioName?: string;
  additionalConstraints?: {
    maxDelay?: number;
    priorityTrains?: string[];
    excludeRoutes?: string[];
  };
};

export type ChatbotMessage = { 
  id: string; 
  role: "user" | "assistant" | "system"; 
  text: string; 
  timestamp: string; 
  references?: { 
    source: string; 
    id?: string;
    title?: string;
    url?: string;
  }[];
  intent?: string;
  confidence?: number;
  actionable?: boolean;
};

export type ChatbotResponse = ChatbotMessage;

export type ChatSession = { 
  sessionId: string; 
  messages: ChatbotMessage[];
  createdAt: string;
  lastActive: string;
  context?: {
    currentPage?: string;
    selectedTrains?: string[];
    activeRecommendations?: string[];
  };
};

// Chart and visualization types
export type ChartDataPoint = {
  time: string;
  value: number;
  label?: string;
  category?: string;
};

export type TimeSeriesData = {
  name: string;
  data: ChartDataPoint[];
  color?: string;
};

export type ChartConfig = {
  title: string;
  type: "line" | "bar" | "area" | "pie" | "scatter";
  xAxis?: string;
  yAxis?: string;
  series: TimeSeriesData[];
};

// UI State types
export type FilterState = {
  dateRange?: {
    start: string;
    end: string;
  };
  trainIds?: string[];
  status?: TrainStatus[];
  priority?: string[];
};

export type SortConfig = {
  field: string;
  direction: "asc" | "desc";
};

export type TableState = {
  filters: FilterState;
  sort: SortConfig;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

// API Response types
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  metadata?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
  timestamp: string;
  details?: any;
};

// Form types
export type WhatIfFormData = {
  trainId: string;
  delayMinutes: number;
  rerouteTo?: string;
  scenarioName?: string;
  runSimulation: boolean;
};

export type RecommendationFormData = {
  trainId?: string;
  priority: "low" | "medium" | "high" | "critical";
  constraints?: {
    maxDelay: number;
    minThroughput: number;
    safetyThreshold: string;
  };
};

// Store types
export type StoreState = {
  // Data
  trains: Train[];
  recommendations: Recommendation[];
  predictions: Prediction[];
  auditLogs: AuditLog[];
  kpis: KPI[];
  chatSessions: ChatSession[];
  
  // UI State
  loading: boolean;
  error: string | null;
  selectedTrains: string[];
  activeFilters: FilterState;
  
  // Last updated timestamps
  lastUpdated: {
    trains?: string;
    recommendations?: string;
    predictions?: string;
    kpis?: string;
  };
};

export type StoreActions = {
  // Data actions
  setTrains: (trains: Train[]) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setPredictions: (predictions: Prediction[]) => void;
  setKpis: (kpis: KPI[]) => void;
  addAuditLog: (log: AuditLog) => void;
  
  // Recommendation actions
  acceptRecommendation: (recId: string) => Promise<void>;
  overrideRecommendation: (recId: string, altId: string) => Promise<void>;
  rejectRecommendation: (recId: string, reason: string) => Promise<void>;
  
  // Simulation actions
  runSimulation: (payload: WhatIfPayload) => Promise<SimulationResult>;
  
  // Chat actions
  sendChatMessage: (sessionId: string, text: string) => Promise<void>;
  createChatSession: () => string;
  getChatSession: (sessionId: string) => ChatSession | undefined;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTrains: (trainIds: string[]) => void;
  setActiveFilters: (filters: FilterState) => void;
  
  // Data fetching actions
  fetchTrains: () => Promise<void>;
  fetchRecommendations: () => Promise<void>;
  fetchPredictions: (trainIds?: string[]) => Promise<void>;
  fetchKpis: () => Promise<void>;
  fetchAuditLogs: (filters?: FilterState) => Promise<void>;
};

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;