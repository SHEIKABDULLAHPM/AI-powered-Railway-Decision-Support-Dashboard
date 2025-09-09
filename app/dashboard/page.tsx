// app/dashboard/page.tsx - Main dashboard page
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Train, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { KpiCard } from '@/components/KpiCard';
import { KpiCharts } from '@/components/KpiCharts';
import { ChartCard } from '@/components/ChartCard';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { 
    kpis, 
    trains, 
    recommendations, 
    predictions,
    loading,
    fetchKpis,
    fetchTrains,
    fetchRecommendations,
    fetchPredictions
  } = useStore();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchKpis(),
        fetchTrains(),
        fetchRecommendations(),
        fetchPredictions()
      ]);
    };

    fetchData();
  }, [fetchKpis, fetchTrains, fetchRecommendations, fetchPredictions]);

  const delayedTrains = trains.filter(t => (t.delayMinutes || 0) > 0);
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Railway Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time network monitoring and AI-powered decision support
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Data
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <Train className="h-8 w-8 text-primary" />
          <div>
            <div className="text-2xl font-bold">{trains.length}</div>
            <div className="text-sm text-muted-foreground">Active Trains</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div>
            <div className="text-2xl font-bold">{delayedTrains.length}</div>
            <div className="text-sm text-muted-foreground">Delayed</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-blue-500" />
          <div>
            <div className="text-2xl font-bold">{pendingRecommendations.length}</div>
            <div className="text-sm text-muted-foreground">Recommendations</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <div className="text-2xl font-bold">
              {Math.round((trains.length - delayedTrains.length) / trains.length * 100) || 0}%
            </div>
            <div className="text-sm text-muted-foreground">On Time</div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <KpiCard kpi={kpi} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
        <KpiCharts kpis={kpis} />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChartCard title="Recent Activity" subtitle="Latest system events and alerts">
          <div className="space-y-3">
            {trains.slice(0, 5).map((train) => (
              <div key={train.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Train className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{train.number}</div>
                    <div className="text-sm text-muted-foreground">
                      {train.origin} → {train.destination}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`status-indicator ${
                    train.status === 'on-time' ? 'status-on-time' :
                    train.status === 'delayed' ? 'status-delayed' :
                    train.status === 'stopped' ? 'status-stopped' :
                    'status-at-platform'
                  }`}>
                    {train.status?.replace('-', ' ').toUpperCase() || 'UNKNOWN'}
                  </div>
                  {train.delayMinutes && train.delayMinutes > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      +{train.delayMinutes} min
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </motion.div>

      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="loading-spinner" />
            <span>Loading dashboard data...</span>
          </div>
        </div>
      )}
    </div>
  );
}