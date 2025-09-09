// stores/useStore.ts - Global Zustand store for Railway Dashboard
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  StoreState, 
  StoreActions, 
  Train, 
  Recommendation, 
  Prediction, 
  KPI, 
  AuditLog, 
  ChatSession, 
  FilterState,
  WhatIfPayload,
  SimulationResult
} from '@/lib/types';

// Import service adapters
import predictionService from '@/services/predictionAdapter';
import optimizerService from '@/services/optimizerAdapter';
import simulatorService from '@/services/simulatorAdapter';
import auditService from '@/services/auditService';
import chatbotService from '@/services/chatbotAdapter';
import { apiGet } from '@/services/adapterBase';

// Combined store state and actions interface
interface RailwayStore extends StoreState, StoreActions {}

export const useStore = create<RailwayStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        trains: [],
        recommendations: [],
        predictions: [],
        auditLogs: [],
        kpis: [],
        chatSessions: [],
        
        // UI State
        loading: false,
        error: null,
        selectedTrains: [],
        activeFilters: {},
        
        // Last updated timestamps
        lastUpdated: {},

        // Data Actions
        setTrains: (trains: Train[]) => 
          set({ trains, lastUpdated: { ...get().lastUpdated, trains: new Date().toISOString() } }),
        
        setRecommendations: (recommendations: Recommendation[]) => 
          set({ recommendations, lastUpdated: { ...get().lastUpdated, recommendations: new Date().toISOString() } }),
        
        setPredictions: (predictions: Prediction[]) => 
          set({ predictions, lastUpdated: { ...get().lastUpdated, predictions: new Date().toISOString() } }),
        
        setKpis: (kpis: KPI[]) => 
          set({ kpis, lastUpdated: { ...get().lastUpdated, kpis: new Date().toISOString() } }),
        
        addAuditLog: (log: AuditLog) => 
          set(state => ({ auditLogs: [log, ...state.auditLogs] })),

        // Recommendation Actions
        acceptRecommendation: async (recId: string) => {
          const state = get();
          const recommendation = state.recommendations.find(r => r.id === recId);
          
          if (!recommendation) {
            throw new Error(`Recommendation ${recId} not found`);
          }

          try {
            set({ loading: true, error: null });

            // Create audit log for acceptance
            const auditLog = auditService.createAuditLog(
              'Recommendation Accepted',
              'System User', // TODO: Replace with actual user from auth context
              { recommendationId: recId, action: recommendation.action },
              recommendation.trainId,
              recId,
              'User accepted AI recommendation'
            );

            // Post audit log
            await auditService.postAudit(auditLog);

            // Update recommendation status
            const updatedRecommendations = state.recommendations.map(r =>
              r.id === recId ? { ...r, status: 'accepted' as const } : r
            );

            // Add audit log to state and update recommendations
            set({
              recommendations: updatedRecommendations,
              auditLogs: [{ ...auditLog, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() }, ...state.auditLogs],
              loading: false
            });

            // TODO: In production, trigger actual system changes based on recommendation
            // await implementRecommendation(recommendation);

          } catch (error) {
            console.error('Failed to accept recommendation:', error);
            set({ error: 'Failed to accept recommendation', loading: false });
            throw error;
          }
        },

        overrideRecommendation: async (recId: string, altId: string) => {
          const state = get();
          const recommendation = state.recommendations.find(r => r.id === recId);
          const alternative = recommendation?.alternatives.find(a => a.id === altId);
          
          if (!recommendation || !alternative) {
            throw new Error(`Recommendation ${recId} or alternative ${altId} not found`);
          }

          try {
            set({ loading: true, error: null });

            // Create audit log for override
            const auditLog = auditService.createAuditLog(
              'Recommendation Overridden',
              'System User', // TODO: Replace with actual user from auth context
              { 
                recommendationId: recId, 
                alternativeId: altId,
                originalAction: recommendation.action,
                selectedAction: alternative.action
              },
              recommendation.trainId,
              recId,
              `User selected alternative: ${alternative.action}`
            );

            // Post audit log
            await auditService.postAudit(auditLog);

            // Update recommendation status
            const updatedRecommendations = state.recommendations.map(r =>
              r.id === recId ? { ...r, status: 'accepted' as const, action: alternative.action } : r
            );

            // Add audit log to state and update recommendations
            set({
              recommendations: updatedRecommendations,
              auditLogs: [{ ...auditLog, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() }, ...state.auditLogs],
              loading: false
            });

          } catch (error) {
            console.error('Failed to override recommendation:', error);
            set({ error: 'Failed to override recommendation', loading: false });
            throw error;
          }
        },

        rejectRecommendation: async (recId: string, reason: string) => {
          const state = get();
          const recommendation = state.recommendations.find(r => r.id === recId);
          
          if (!recommendation) {
            throw new Error(`Recommendation ${recId} not found`);
          }

          try {
            set({ loading: true, error: null });

            // Create audit log for rejection
            const auditLog = auditService.createAuditLog(
              'Recommendation Rejected',
              'System User', // TODO: Replace with actual user from auth context
              { recommendationId: recId, action: recommendation.action },
              recommendation.trainId,
              recId,
              reason
            );

            // Post audit log
            await auditService.postAudit(auditLog);

            // Update recommendation status
            const updatedRecommendations = state.recommendations.map(r =>
              r.id === recId ? { ...r, status: 'rejected' as const } : r
            );

            // Add audit log to state and update recommendations
            set({
              recommendations: updatedRecommendations,
              auditLogs: [{ ...auditLog, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() }, ...state.auditLogs],
              loading: false
            });

          } catch (error) {
            console.error('Failed to reject recommendation:', error);
            set({ error: 'Failed to reject recommendation', loading: false });
            throw error;
          }
        },

        // Simulation Actions
        runSimulation: async (payload: WhatIfPayload): Promise<SimulationResult> => {
          try {
            set({ loading: true, error: null });

            // Run simulation through adapter
            const result = await simulatorService.runWhatIfScenario(payload);

            // Create audit log for simulation
            const auditLog = auditService.createAuditLog(
              'What-If Simulation Executed',
              'System User', // TODO: Replace with actual user from auth context
              { 
                scenario: payload,
                results: {
                  scenarioId: result.scenarioId,
                  projectedKPIs: result.projectedKPIs
                }
              },
              payload.trainId,
              undefined,
              `Simulated scenario: ${payload.scenarioName || 'Unnamed scenario'}`
            );

            // Post audit log
            await auditService.postAudit(auditLog);

            // Add audit log to state
            set(state => ({
              auditLogs: [{ ...auditLog, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() }, ...state.auditLogs],
              loading: false
            }));

            return result;

          } catch (error) {
            console.error('Failed to run simulation:', error);
            set({ error: 'Failed to run simulation', loading: false });
            throw error;
          }
        },

        // Chat Actions
        sendChatMessage: async (sessionId: string, text: string) => {
          const state = get();
          let session = state.chatSessions.find(s => s.sessionId === sessionId);
          
          if (!session) {
            // Create new session if not found
            session = {
              sessionId,
              messages: [],
              createdAt: new Date().toISOString(),
              lastActive: new Date().toISOString()
            };
          }

          try {
            // Add user message immediately for responsive UI
            const userMessage = {
              id: `msg-${Date.now()}-user`,
              role: 'user' as const,
              text,
              timestamp: new Date().toISOString()
            };

            const updatedSession = {
              ...session,
              messages: [...session.messages, userMessage],
              lastActive: new Date().toISOString()
            };

            // Update state with user message
            set(state => ({
              chatSessions: state.chatSessions.some(s => s.sessionId === sessionId)
                ? state.chatSessions.map(s => s.sessionId === sessionId ? updatedSession : s)
                : [...state.chatSessions, updatedSession]
            }));

            // Send message to chatbot service
            const responses = await chatbotService.sendChatMessage(sessionId, text);

            // Update session with bot responses
            const finalSession = {
              ...updatedSession,
              messages: [...updatedSession.messages, ...responses],
              lastActive: new Date().toISOString()
            };

            set(state => ({
              chatSessions: state.chatSessions.map(s => 
                s.sessionId === sessionId ? finalSession : s
              )
            }));

          } catch (error) {
            console.error('Failed to send chat message:', error);
            // Add error message to chat
            const errorMessage = {
              id: `msg-${Date.now()}-error`,
              role: 'assistant' as const,
              text: 'Sorry, I encountered an error processing your message. Please try again.',
              timestamp: new Date().toISOString()
            };

            set(state => ({
              chatSessions: state.chatSessions.map(s => 
                s.sessionId === sessionId 
                  ? { ...s, messages: [...s.messages, errorMessage] }
                  : s
              )
            }));
          }
        },

        createChatSession: (): string => {
          const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newSession: ChatSession = {
            sessionId,
            messages: [],
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };

          set(state => ({
            chatSessions: [...state.chatSessions, newSession]
          }));

          return sessionId;
        },

        getChatSession: (sessionId: string): ChatSession | undefined => {
          return get().chatSessions.find(s => s.sessionId === sessionId);
        },

        // UI Actions
        setLoading: (loading: boolean) => set({ loading }),
        
        setError: (error: string | null) => set({ error }),
        
        setSelectedTrains: (trainIds: string[]) => set({ selectedTrains: trainIds }),
        
        setActiveFilters: (filters: FilterState) => set({ activeFilters: filters }),

        // Data Fetching Actions
        fetchTrains: async () => {
          try {
            set({ loading: true, error: null });
            const response = await apiGet<{ data: Train[] }>('/trains');
            set({ 
              trains: response.data, 
              loading: false,
              lastUpdated: { ...get().lastUpdated, trains: new Date().toISOString() }
            });
          } catch (error) {
            console.error('Failed to fetch trains:', error);
            set({ error: 'Failed to fetch trains', loading: false });
          }
        },

        fetchRecommendations: async () => {
          try {
            set({ loading: true, error: null });
            const response = await apiGet<{ data: Recommendation[] }>('/recommendations');
            set({ 
              recommendations: response.data, 
              loading: false,
              lastUpdated: { ...get().lastUpdated, recommendations: new Date().toISOString() }
            });
          } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            set({ error: 'Failed to fetch recommendations', loading: false });
          }
        },

        fetchPredictions: async (trainIds?: string[]) => {
          try {
            set({ loading: true, error: null });
            const trains = trainIds 
              ? get().trains.filter(t => trainIds.includes(t.id))
              : get().trains;
            
            const predictions = await predictionService.getPredictionsForTrains(trains);
            set({ 
              predictions, 
              loading: false,
              lastUpdated: { ...get().lastUpdated, predictions: new Date().toISOString() }
            });
          } catch (error) {
            console.error('Failed to fetch predictions:', error);
            set({ error: 'Failed to fetch predictions', loading: false });
          }
        },

        fetchKpis: async () => {
          try {
            set({ loading: true, error: null });
            const response = await apiGet<{ data: KPI[] }>('/kpis');
            set({ 
              kpis: response.data, 
              loading: false,
              lastUpdated: { ...get().lastUpdated, kpis: new Date().toISOString() }
            });
          } catch (error) {
            console.error('Failed to fetch KPIs:', error);
            set({ error: 'Failed to fetch KPIs', loading: false });
          }
        },

        fetchAuditLogs: async (filters?: FilterState) => {
          try {
            set({ loading: true, error: null });
            const auditLogs = await auditService.getAudit(filters);
            set({ auditLogs, loading: false });
          } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            set({ error: 'Failed to fetch audit logs', loading: false });
          }
        },

      }),
      {
        name: 'railway-dashboard-store',
        partialize: (state) => ({
          // Only persist essential data, not loading states or errors
          trains: state.trains,
          recommendations: state.recommendations,
          predictions: state.predictions,
          kpis: state.kpis,
          selectedTrains: state.selectedTrains,
          activeFilters: state.activeFilters,
          lastUpdated: state.lastUpdated,
          // Don't persist chat sessions for privacy
          // Don't persist audit logs as they should be fetched fresh
        }),
      }
    ),
    {
      name: 'railway-dashboard-store',
    }
  )
);

// Selectors for derived state
export const useTrainById = (trainId: string) => 
  useStore(state => state.trains.find(t => t.id === trainId));

export const useRecommendationsByTrain = (trainId: string) => 
  useStore(state => state.recommendations.filter(r => r.trainId === trainId));

export const usePredictionByTrain = (trainId: string) => 
  useStore(state => state.predictions.find(p => p.trainId === trainId));

export const useDelayedTrains = () => 
  useStore(state => state.trains.filter(t => (t.delayMinutes || 0) > 0));

export const usePendingRecommendations = () => 
  useStore(state => state.recommendations.filter(r => r.status === 'pending'));

export const useKpiByName = (name: string) => 
  useStore(state => state.kpis.find(k => k.name === name));

export const useRecentAuditLogs = (limit: number = 10) => 
  useStore(state => state.auditLogs.slice(0, limit));

export const useActiveChatSession = () => 
  useStore(state => state.chatSessions[0]); // Most recent session

// Action hooks for easier component usage
export const useStoreActions = () => useStore(state => ({
  acceptRecommendation: state.acceptRecommendation,
  overrideRecommendation: state.overrideRecommendation,
  rejectRecommendation: state.rejectRecommendation,
  runSimulation: state.runSimulation,
  sendChatMessage: state.sendChatMessage,
  createChatSession: state.createChatSession,
  fetchTrains: state.fetchTrains,
  fetchRecommendations: state.fetchRecommendations,
  fetchPredictions: state.fetchPredictions,
  fetchKpis: state.fetchKpis,
  fetchAuditLogs: state.fetchAuditLogs,
  setSelectedTrains: state.setSelectedTrains,
  setActiveFilters: state.setActiveFilters,
}));

export default useStore;