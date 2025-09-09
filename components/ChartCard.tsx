// components/ChartCard.tsx - Reusable chart container component
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Download, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  loading?: boolean;
  error?: string;
  onExport?: () => void;
  onExpand?: () => void;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  actions,
  loading = false,
  error,
  onExport,
  onExpand
}: ChartCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className={cn('chart-container group', className)}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="chart-title">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onExport && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onExport}
              className="h-8 w-8"
              aria-label="Export chart"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          
          {onExpand && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onExpand}
              className="h-8 w-8"
              aria-label="Expand chart"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}

          {actions}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Chart options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="loading-spinner" />
              <span>Loading chart data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded">
            <div className="text-center p-4">
              <div className="text-sm text-destructive font-medium mb-2">
                Failed to load chart
              </div>
              <div className="text-xs text-muted-foreground">
                {error}
              </div>
            </div>
          </div>
        )}

        <div className={cn(
          'transition-opacity duration-200',
          (loading || error) && 'opacity-30'
        )}>
          {children}
        </div>
      </div>

      {/* Loading skeleton overlay */}
      {loading && (
        <motion.div
          className="absolute inset-0 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default ChartCard;