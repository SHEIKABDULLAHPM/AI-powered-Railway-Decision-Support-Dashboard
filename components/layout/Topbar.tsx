// components/layout/Topbar.tsx - Top navigation bar component
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Search, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DarkModeToggle from './DarkModeToggle';
import { useStore } from '@/stores/useStore';
import { cn, formatRelativeTime } from '@/lib/utils';

interface TopbarProps {
  className?: string;
}

export function Topbar({ className }: TopbarProps) {
  const { kpis, recommendations, loading, error } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'warning' as const,
      message: 'Train IC-2847 experiencing delays',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '2', 
      type: 'success' as const,
      message: 'Recommendation accepted for HST-1205',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '3',
      type: 'info' as const,
      message: 'System health check completed',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: true
    }
  ]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending').length;
  const systemHealth = getSystemHealth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Implement search functionality
    }
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  };

  return (
    <header className={cn(
      'sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      'border-b border-border shadow-sm',
      className
    )}>
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section - Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trains, recommendations..."
              className="pl-10 pr-4 focus-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
          </form>
        </div>

        {/* Center section - System status */}
        <div className="hidden md:flex items-center gap-4">
          {/* Connection status */}
          <div className="flex items-center gap-2 text-sm">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-muted-foreground">Offline</span>
              </>
            )}
          </div>

          {/* System health indicator */}
          <div className="flex items-center gap-2 text-sm">
            <div className={cn(
              'w-2 h-2 rounded-full',
              systemHealth === 'excellent' && 'bg-green-500',
              systemHealth === 'good' && 'bg-green-400',
              systemHealth === 'warning' && 'bg-yellow-500',
              systemHealth === 'critical' && 'bg-red-500'
            )} />
            <span className="text-muted-foreground capitalize">{systemHealth}</span>
          </div>

          {/* Current time */}
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="loading-spinner" />
              <span className="hidden sm:inline">Loading...</span>
            </div>
          )}

          {/* Error indicator */}
          {error && (
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Error</span>
            </Button>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="relative focus-ring"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </Button>

            {/* TODO: Add notification dropdown */}
          </div>

          {/* Pending recommendations indicator */}
          {pendingRecommendations > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">
                {pendingRecommendations} Pending
              </span>
            </Button>
          )}

          {/* Dark mode toggle */}
          <DarkModeToggle />

          {/* User menu */}
          <Button
            variant="outline"
            size="icon"
            className="focus-ring"
            aria-label="User menu"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile status bar */}
      <div className="md:hidden px-4 py-2 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {isOnline ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={cn(
                'w-1.5 h-1.5 rounded-full',
                systemHealth === 'excellent' && 'bg-green-500',
                systemHealth === 'good' && 'bg-green-400',
                systemHealth === 'warning' && 'bg-yellow-500',
                systemHealth === 'critical' && 'bg-red-500'
              )} />
              <span className="capitalize">{systemHealth}</span>
            </div>
          </div>
          <div>
            {currentTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

// Helper function to determine system health
function getSystemHealth(): 'excellent' | 'good' | 'warning' | 'critical' {
  // TODO: Implement actual system health calculation based on KPIs
  // For now, return a mock value
  const healthScore = Math.random();
  
  if (healthScore > 0.9) return 'excellent';
  if (healthScore > 0.7) return 'good';
  if (healthScore > 0.5) return 'warning';
  return 'critical';
}

export default Topbar;