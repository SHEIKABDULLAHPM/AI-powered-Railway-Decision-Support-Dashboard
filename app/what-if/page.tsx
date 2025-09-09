// app/what-if/page.tsx - What-if scenario analysis page
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Download } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { WhatIfFormData, SimulationResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChartCard } from '@/components/ChartCard';
import { KpiCard } from '@/components/KpiCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function WhatIfPage() {
  const { trains, runSimulation, fetchTrains } = useStore();
  const [formData, setFormData] = useState<WhatIfFormData>({
    trainId: '',
    delayMinutes: 15,
    rerouteTo: '',
    scenarioName: '',
    runSimulation: false
  });
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetchTrains();
  }, [fetchTrains]);

  const handleInputChange = (field: keyof WhatIfFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRunSimulation = async () => {
    if (!formData.trainId) return;

    setIsRunning(true);
    try {
      const result = await runSimulation({
        trainId: formData.trainId,
        delayMinutes: formData.delayMinutes,
        rerouteTo: formData.rerouteTo || undefined,
        scenarioName: formData.scenarioName || undefined
      });
      setSimulationResult(result);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setFormData({
      trainId: '',
      delayMinutes: 15,
      rerouteTo: '',
      scenarioName: '',
      runSimulation: false
    });
    setSimulationResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground">What-If Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Simulate scenarios to understand potential impacts on network performance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <ChartCard title="Scenario Configuration" subtitle="Define your what-if scenario">
            <div className="space-y-4">
              {/* Train Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Train</label>
                <select
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={formData.trainId}
                  onChange={(e) => handleInputChange('trainId', e.target.value)}
                >
                  <option value="">Choose a train...</option>
                  {trains.map(train => (
                    <option key={train.id} value={train.id}>
                      {train.number} - {train.origin} → {train.destination}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delay Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Additional Delay (minutes)</label>
                <Input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.delayMinutes}
                  onChange={(e) => handleInputChange('delayMinutes', parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Reroute Option */}
              <div>
                <label className="block text-sm font-medium mb-2">Reroute To (optional)</label>
                <Input
                  type="text"
                  placeholder="e.g., Oxford, Birmingham"
                  value={formData.rerouteTo}
                  onChange={(e) => handleInputChange('rerouteTo', e.target.value)}
                />
              </div>

              {/* Scenario Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Scenario Name (optional)</label>
                <Input
                  type="text"
                  placeholder="e.g., Signal failure at Reading"
                  value={formData.scenarioName}
                  onChange={(e) => handleInputChange('scenarioName', e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleRunSimulation}
                  disabled={!formData.trainId || isRunning}
                  className="flex-1"
                >
                  {isRunning ? (
                    <>
                      <div className="loading-spinner mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </ChartCard>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          {simulationResult ? (
            <div className="space-y-6">
              {/* KPI Comparison */}
              <ChartCard 
                title="Projected Impact" 
                subtitle={`Scenario: ${simulationResult.scenarioId}`}
                onExport={() => console.log('Export results')}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <KpiCard
                    kpi={{
                      name: 'Projected Delay',
                      value: simulationResult.projectedKPIs.delay,
                      unit: 'min',
                      trend: simulationResult.projectedKPIs.delay > 10 ? 'up' : 'down',
                      status: simulationResult.projectedKPIs.delay > 20 ? 'critical' : 
                              simulationResult.projectedKPIs.delay > 10 ? 'warning' : 'good'
                    }}
                    showTarget={false}
                  />
                  <KpiCard
                    kpi={{
                      name: 'Throughput Impact',
                      value: simulationResult.projectedKPIs.throughput,
                      unit: 'trains/hr',
                      trend: simulationResult.projectedKPIs.throughput > 140 ? 'up' : 'down',
                      status: simulationResult.projectedKPIs.throughput < 120 ? 'critical' : 'good'
                    }}
                    showTarget={false}
                  />
                  <KpiCard
                    kpi={{
                      name: 'Safety Level',
                      value: simulationResult.projectedKPIs.safety === 'high' ? 100 : 
                             simulationResult.projectedKPIs.safety === 'medium' ? 75 : 50,
                      unit: '%',
                      trend: 'stable',
                      status: simulationResult.projectedKPIs.safety === 'high' ? 'good' : 
                              simulationResult.projectedKPIs.safety === 'medium' ? 'warning' : 'critical'
                    }}
                    showTarget={false}
                  />
                </div>
              </ChartCard>

              {/* Comparison Chart */}
              {simulationResult.comparisonData && (
                <ChartCard title="Before vs After Comparison" subtitle="Impact analysis">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      {
                        metric: 'Delay',
                        before: simulationResult.comparisonData.baseline.delay,
                        after: simulationResult.comparisonData.projected.delay
                      },
                      {
                        metric: 'Throughput',
                        before: simulationResult.comparisonData.baseline.throughput,
                        after: simulationResult.comparisonData.projected.throughput
                      }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Bar dataKey="before" fill="hsl(var(--muted))" name="Before" />
                      <Bar dataKey="after" fill="hsl(var(--primary))" name="After" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* Timeline Chart */}
              {simulationResult.chartData && (
                <ChartCard title="Impact Timeline" subtitle="Projected changes over time">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={simulationResult.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="delay" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        name="Delay (min)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="throughput" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Throughput"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* Recommendations */}
              {simulationResult.recommendations && simulationResult.recommendations.length > 0 && (
                <ChartCard title="AI Recommendations" subtitle="Suggested actions based on simulation">
                  <div className="space-y-2">
                    {simulationResult.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              )}
            </div>
          ) : (
            <ChartCard title="Simulation Results" subtitle="Run a simulation to see results here">
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Configure and run a simulation to see projected impacts</p>
                </div>
              </div>
            </ChartCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}