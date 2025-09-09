// components/layout/Sidebar.tsx - Navigation sidebar component
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Brain, 
  FileText, 
  Home, 
  MessageCircle, 
  Settings, 
  TestTube2,
  TrendingUp,
  Train,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and KPIs'
  },
  {
    title: 'What-If Analysis',
    href: '/what-if',
    icon: TestTube2,
    description: 'Scenario simulation'
  },
  {
    title: 'Recommendations',
    href: '/recommendations',
    icon: Brain,
    description: 'AI suggestions'
  },
  {
    title: 'Audit Trail',
    href: '/audit',
    icon: FileText,
    description: 'Decision history'
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
    description: 'Performance analysis'
  },
  {
    title: 'Training Data',
    href: '/training',
    icon: BarChart3,
    description: 'Model training'
  },
  {
    title: 'Chat Assistant',
    href: '/chat',
    icon: MessageCircle,
    description: 'AI chat support'
  }
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapsed = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobile}
        aria-label="Toggle navigation menu"
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
          x: isMobileOpen ? 0 : '-100%'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border shadow-lg md:relative md:translate-x-0',
          'flex flex-col',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <motion.div
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Train className="h-8 w-8 text-primary" />
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-foreground">Railway AI</h1>
                <p className="text-xs text-muted-foreground">Decision Support</p>
              </div>
            )}
          </motion.div>

          {/* Collapse toggle - desktop only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="hidden md:flex"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    isActive && 'bg-primary text-primary-foreground shadow-sm'
                  )}
                >
                  <Icon 
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'
                    )} 
                  />
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: isCollapsed ? 0 : 1,
                      width: isCollapsed ? 0 : 'auto'
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {!isCollapsed && (
                      <div className="min-w-0">
                        <div className={cn(
                          'font-medium text-sm',
                          isActive ? 'text-primary-foreground' : 'text-foreground'
                        )}>
                          {item.title}
                        </div>
                        <div className={cn(
                          'text-xs truncate',
                          isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        )}>
                          {item.description}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-muted-foreground">{item.description}</div>
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <motion.div
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground text-center"
          >
            {!isCollapsed && (
              <div>
                <div>Railway AI Dashboard</div>
                <div>v1.0.0</div>
              </div>
            )}
          </motion.div>

          {/* Settings button */}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            className="w-full mt-2"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;