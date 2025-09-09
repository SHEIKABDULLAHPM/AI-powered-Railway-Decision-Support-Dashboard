// app/analytics/page.tsx - Performance analytics page
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { KpiCharts } from '@/components/KpiCharts';
import { ChartCard } from '@/components/ChartCard';
import { Button } from '@/components/ui/button';

export default function AnalyticsPage() {
  const { kpis, fetchKpis } = useStore();

  useEffect(() => {
    fetchKpis();
  }, [fetchKpis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive analysis of railway network performance and AI effectiveness
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Analytics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">94.2%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Daily Predictions</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <PieChart className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold">87.5%</div>
              <div className="text-sm text-muted-foreground">Model Accuracy</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">23</div>
              <div className="text-sm text-muted-foreground">Active Models</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <KpiCharts kpis={kpis} timeRange="24h" />
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ChartCard title="Performance Insights" subtitle="AI-generated analysis and recommendations">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Throughput Improvement</h4>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Network throughput has increased by 3.6% this week, primarily due to improved AI recommendation acceptance rates.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Delay Pattern Detected</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    Recurring delays between 14:00-16:00 suggest potential capacity constraints during peak hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">Model Performance</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Prediction accuracy has improved to 87.5%, with particularly strong performance in delay forecasting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </motion.div>
    </div>
  );
}