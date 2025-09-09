// app/audit/page.tsx - Audit trail page
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, Search } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChartCard } from '@/components/ChartCard';
import { formatRelativeTime, cn } from '@/lib/utils';

export default function AuditPage() {
  const { auditLogs, fetchAuditLogs, loading } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActor, setFilterActor] = useState('');

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.trainId && log.trainId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesActor = !filterActor || log.actor.includes(filterActor);
    
    return matchesSearch && matchesActor;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('Accept')) return '✅';
    if (action.includes('Reject')) return '❌';
    if (action.includes('Override')) return '🔄';
    if (action.includes('Simulation')) return '🧪';
    if (action.includes('Generated')) return '🤖';
    return '📝';
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'success': return 'text-green-600';
      case 'failure': return 'text-red-600';
      case 'partial': return 'text-yellow-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Trail</h1>
            <p className="text-muted-foreground mt-1">
              Complete record of all system decisions and actions
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => fetchAuditLogs()} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ChartCard title="Filters" subtitle="Filter audit entries">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search actions, actors, trains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Actor</label>
              <select
                className="w-full p-2 border border-border rounded-md bg-background"
                value={filterActor}
                onChange={(e) => setFilterActor(e.target.value)}
              >
                <option value="">All actors</option>
                <option value="AI System">AI System</option>
                <option value="Controller">Controllers</option>
                <option value="System User">System Users</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => { setSearchTerm(''); setFilterActor(''); }}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </ChartCard>
      </motion.div>

      {/* Audit Log Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ChartCard 
          title="Audit Entries" 
          subtitle={`${filteredLogs.length} entries found`}
        >
          <div className="space-y-3">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{getActionIcon(log.action)}</span>
                        <div>
                          <h4 className="font-medium">{log.action}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{log.actor}</span>
                            {log.trainId && (
                              <>
                                <span>•</span>
                                <span>Train {log.trainId}</span>
                              </>
                            )}
                            {log.outcome && (
                              <>
                                <span>•</span>
                                <span className={cn('font-medium', getOutcomeColor(log.outcome))}>
                                  {log.outcome.toUpperCase()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {log.reason && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Reason:</strong> {log.reason}
                        </p>
                      )}

                      {log.details && (
                        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded mt-2">
                          <strong>Details:</strong> {JSON.stringify(log.details, null, 2)}
                        </div>
                      )}

                      {log.impactMetrics && (
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          {log.impactMetrics.delayChange !== undefined && (
                            <div>
                              <span className="text-muted-foreground">Delay Impact:</span>
                              <span className={cn('ml-2 font-medium', 
                                log.impactMetrics.delayChange > 0 ? 'text-red-600' : 'text-green-600'
                              )}>
                                {log.impactMetrics.delayChange > 0 ? '+' : ''}{log.impactMetrics.delayChange} min
                              </span>
                            </div>
                          )}
                          {log.impactMetrics.throughputChange !== undefined && (
                            <div>
                              <span className="text-muted-foreground">Throughput:</span>
                              <span className={cn('ml-2 font-medium',
                                log.impactMetrics.throughputChange > 0 ? 'text-green-600' : 'text-red-600'
                              )}>
                                {log.impactMetrics.throughputChange > 0 ? '+' : ''}{log.impactMetrics.throughputChange}
                              </span>
                            </div>
                          )}
                          {log.impactMetrics.costImpact !== undefined && (
                            <div>
                              <span className="text-muted-foreground">Cost:</span>
                              <span className="ml-2 font-medium">
                                ${log.impactMetrics.costImpact}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{formatRelativeTime(log.timestamp)}</div>
                      <div className="text-xs">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium mb-2">No audit entries found</h3>
                <p className="text-sm">
                  {searchTerm || filterActor 
                    ? 'Try adjusting your filters to see more results'
                    : 'Audit entries will appear here as actions are performed'
                  }
                </p>
              </div>
            )}
          </div>
        </ChartCard>
      </motion.div>
    </div>
  );
}