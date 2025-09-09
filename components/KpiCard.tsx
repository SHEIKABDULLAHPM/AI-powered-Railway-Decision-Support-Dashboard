// components/KpiCard.tsx - KPI display card component
'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Target, AlertTriangle } from 'lucide-react';
import { KPI } from '@/lib/types';
import { cn, formatNumber, getTrendDisplay, getKpiStatusColor } from '@/lib/utils';

interface KpiCardProps {
  kpi: KPI;
  className?: string;
  showTarget?: boolean;
  animated?: boolean;
}

export function KpiCard({ kpi, className, showTarget = true, animated = true }: KpiCardProps) {
  const trend = getTrendDisplay(kpi.trend || 'stable', kpi.changePercent);
  const statusColor = getKpiStatusColor(kpi.status || 'good');
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const valueVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: 0.1, duration: 0.4, type: 'spring', stiffness: 100 }
    }
  };

  const CardComponent = animated ? motion.div : 'div';
  const ValueComponent = animated ? motion.div : 'div';

  return (
    <CardComponent
      className={cn('kpi-card group', className)}
      variants={animated ? cardVariants : undefined}
      initial={animated ? 'hidden' : undefined}
      animate={animated ? 'visible' : undefined}
      whileHover={animated ? 'hover' : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            {kpi.name}
          </h3>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              kpi.status === 'good' && 'bg-green-500',
              kpi.status === 'warning' && 'bg-yellow-500',
              kpi.status === 'critical' && 'bg-red-500'
            )} />
            <span className={cn('text-xs font-medium', statusColor)}>
              {kpi.status?.toUpperCase() || 'GOOD'}
            </span>
          </div>
        </div>

        {/* Status icon */}
        {kpi.status === 'critical' && (
          <AlertTriangle className="h-4 w-4 text-red-500" />
        )}
      </div>

      {/* Main Value */}
      <ValueComponent
        className="mb-4"
        variants={animated ? valueVariants : undefined}
        initial={animated ? 'hidden' : undefined}
        animate={animated ? 'visible' : undefined}
      >
        <div className="flex items-baseline gap-2">
          <span className="kpi-value">
            {formatNumber(kpi.value, { 
              decimals: kpi.name.includes('Rate') || kpi.name.includes('Utilization') ? 1 : 0,
              compact: kpi.value > 1000 
            })}
          </span>
          {kpi.unit && (
            <span className="text-sm text-muted-foreground">
              {kpi.unit}
            </span>
          )}
        </div>
      </ValueComponent>

      {/* Trend and Change */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {kpi.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
          {kpi.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
          {kpi.trend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
          
          <span className={cn('text-sm font-medium', trend.color)}>
            {trend.text}
          </span>
        </div>

        {kpi.change !== undefined && (
          <span className="text-xs text-muted-foreground">
            {kpi.change > 0 ? '+' : ''}{formatNumber(kpi.change, { decimals: 1 })}
            {kpi.unit && ` ${kpi.unit}`}
          </span>
        )}
      </div>

      {/* Target Progress */}
      {showTarget && kpi.target && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Target</span>
            <span className="font-medium">
              {formatNumber(kpi.target, { 
                decimals: kpi.name.includes('Rate') || kpi.name.includes('Utilization') ? 1 : 0 
              })}
              {kpi.unit && ` ${kpi.unit}`}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={cn(
                'absolute top-0 left-0 h-full rounded-full',
                kpi.value >= kpi.target ? 'bg-green-500' : 'bg-primary'
              )}
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` 
              }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            />
            
            {/* Target indicator line */}
            <div 
              className="absolute top-0 w-0.5 h-full bg-muted-foreground opacity-50"
              style={{ left: '100%' }}
            />
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Target className="h-3 w-3" />
            <span>
              {kpi.value >= kpi.target ? 'Target achieved' : 
               `${formatNumber(kpi.target - kpi.value, { decimals: 1 })} to target`}
            </span>
          </div>
        </div>
      )}

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </CardComponent>
  );
}

export default KpiCard;