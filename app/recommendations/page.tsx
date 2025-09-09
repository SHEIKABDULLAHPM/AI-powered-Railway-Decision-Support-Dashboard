// app/recommendations/page.tsx - AI recommendations page
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, AlertTriangle, Brain, TrendingUp } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { ChartCard } from '@/components/ChartCard';
import { cn, formatRelativeTime, getPriorityColor, getPriorityBadgeClass } from '@/lib/utils';

export default function RecommendationsPage() {
  const { 
    recommendations, 
    trains,
    loading,
    acceptRecommendation,
    overrideRecommendation,
    rejectRecommendation,
    fetchRecommendations,
    fetchTrains
  } = useStore();

  const [selectedRec, setSelectedRec] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchRecommendations();
    fetchTrains();
  }, [fetchRecommendations, fetchTrains]);

  const handleAccept = async (recId: string) => {
    try {
      await acceptRecommendation(recId);
    } catch (error) {
      console.error('Failed to accept recommendation:', error);
    }
  };

  const handleOverride = async (recId: string, altId: string) => {
    try {
      await overrideRecommendation(recId, altId);
    } catch (error) {
      console.error('Failed to override recommendation:', error);
    }
  };

  const handleReject = async (recId: string) => {
    try {
      await rejectRecommendation(recId, rejectReason || 'No reason provided');
      setSelectedRec(null);
      setRejectReason('');
    } catch (error) {
      console.error('Failed to reject recommendation:', error);
    }
  };

  const pendingRecommendations = recommendations.filter(r => r.status === 'pending');
  const completedRecommendations = recommendations.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Recommendations</h1>
            <p className="text-muted-foreground mt-1">
              Intelligent suggestions for optimizing railway operations
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchRecommendations} disabled={loading}>
              Refresh
            </Button>
            <Button>
              <Brain className="w-4 h-4 mr-2" />
              Generate New
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">{pendingRecommendations.length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Check className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">
                {completedRecommendations.filter(r => r.status === 'accepted').length}
              </div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <X className="h-8 w-8 text-red-500" />
            <div>
              <div className="text-2xl font-bold">
                {completedRecommendations.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">
                {Math.round((completedRecommendations.filter(r => r.status === 'accepted').length / 
                  Math.max(completedRecommendations.length, 1)) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Acceptance Rate</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pending Recommendations */}
      {pendingRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChartCard title="Pending Recommendations" subtitle="Requires your attention">
            <div className="space-y-4">
              {pendingRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'recommendation-card',
                    getPriorityBadgeClass(rec.priority || 'medium')
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn('text-sm font-medium', getPriorityColor(rec.priority || 'medium'))}>
                          {rec.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
                        </span>
                        {rec.trainId && (
                          <span className="text-sm text-muted-foreground">
                            • Train {trains.find(t => t.id === rec.trainId)?.number || rec.trainId}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{rec.action}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{rec.rationale}</p>
                    </div>
                    
                    <div className="text-right text-sm text-muted-foreground">
                      <div>Confidence: {Math.round(rec.confidence * 100)}%</div>
                      {rec.createdAt && (
                        <div>{formatRelativeTime(rec.createdAt)}</div>
                      )}
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        -{rec.kpis.delayReduction} min
                      </div>
                      <div className="text-xs text-muted-foreground">Delay Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {rec.kpis.throughput}%
                      </div>
                      <div className="text-xs text-muted-foreground">Throughput</div>
                    </div>
                    <div className="text-center">
                      <div className={cn(
                        'text-lg font-bold',
                        rec.kpis.safety === 'high' ? 'text-green-600' : 
                        rec.kpis.safety === 'medium' ? 'text-yellow-600' : 'text-red-600'
                      )}>
                        {rec.kpis.safety.toUpperCase()}
                      </div>
                      <div className="text-xs text-muted-foreground">Safety</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleAccept(rec.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={loading}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>

                    {rec.alternatives.length > 0 && (
                      <div className="relative">
                        <Button variant="outline" disabled={loading}>
                          Override ({rec.alternatives.length} options)
                        </Button>
                        {/* TODO: Add dropdown for alternatives */}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => setSelectedRec(selectedRec === rec.id ? null : rec.id)}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>

                  {/* Reject Form */}
                  {selectedRec === rec.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-3 border-t border-border"
                    >
                      <div className="space-y-3">
                        <label className="block text-sm font-medium">
                          Reason for rejection:
                        </label>
                        <textarea
                          className="w-full p-2 border border-border rounded-md bg-background text-sm"
                          rows={3}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Please provide a reason for rejecting this recommendation..."
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReject(rec.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Confirm Rejection
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRec(null);
                              setRejectReason('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Alternatives Preview */}
                  {rec.alternatives.length > 0 && selectedRec !== rec.id && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm font-medium mb-2">Available Alternatives:</div>
                      <div className="space-y-1">
                        {rec.alternatives.slice(0, 2).map((alt) => (
                          <div key={alt.id} className="text-sm text-muted-foreground">
                            • {alt.action}
                          </div>
                        ))}
                        {rec.alternatives.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            • And {rec.alternatives.length - 2} more options...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </motion.div>
      )}

      {/* Recent Decisions */}
      {completedRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ChartCard title="Recent Decisions" subtitle="Previously handled recommendations">
            <div className="space-y-3">
              {completedRecommendations.slice(0, 5).map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{rec.action}</div>
                    <div className="text-sm text-muted-foreground">
                      {rec.trainId && `Train ${trains.find(t => t.id === rec.trainId)?.number || rec.trainId} • `}
                      {rec.createdAt && formatRelativeTime(rec.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'status-indicator',
                      rec.status === 'accepted' && 'status-on-time',
                      rec.status === 'rejected' && 'status-delayed'
                    )}>
                      {rec.status?.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </motion.div>
      )}

      {/* Empty State */}
      {recommendations.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChartCard title="No Recommendations" subtitle="System is running optimally">
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">No recommendations available at this time</p>
                <p className="text-sm">The AI system will generate suggestions when optimization opportunities are detected</p>
              </div>
            </div>
          </ChartCard>
        </motion.div>
      )}
    </div>
  );
}