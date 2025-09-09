// lib/utils.ts - Utility functions for the application
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

/**
 * Utility function to merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date object for display
 */
export function formatDate(date: string | Date, formatStr: string = "MMM dd, yyyy"): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, formatStr);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format time in HH:MM format
 */
export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  
  // If already in HH:MM format, return as is
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr;
  }
  
  // Try to parse ISO date string
  try {
    const date = parseISO(timeStr);
    if (isValid(date)) {
      return format(date, 'HH:mm');
    }
  } catch {
    // Fall through to return original string
  }
  
  return timeStr;
}

/**
 * Format delay minutes as human-readable string
 */
export function formatDelay(delayMinutes: number): string {
  if (delayMinutes === 0) return 'On time';
  if (delayMinutes < 0) return `${Math.abs(delayMinutes)} min early`;
  
  const hours = Math.floor(delayMinutes / 60);
  const minutes = delayMinutes % 60;
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m delayed` : `${hours}h delayed`;
  }
  
  return `${minutes} min delayed`;
}

/**
 * Get status color based on train status
 */
export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'on-time':
      return 'text-green-600 dark:text-green-400';
    case 'delayed':
      return 'text-red-600 dark:text-red-400';
    case 'stopped':
      return 'text-gray-600 dark:text-gray-400';
    case 'at-platform':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-muted-foreground';
  }
}

/**
 * Get status background color for badges
 */
export function getStatusBadgeClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'on-time':
      return 'status-on-time';
    case 'delayed':
      return 'status-delayed';
    case 'stopped':
      return 'status-stopped';
    case 'at-platform':
      return 'status-at-platform';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

/**
 * Get KPI status color based on value vs target
 */
export function getKpiStatusColor(status: 'good' | 'warning' | 'critical'): string {
  switch (status) {
    case 'good':
      return 'text-green-600 dark:text-green-400';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'critical':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-muted-foreground';
  }
}

/**
 * Get trend icon and color for KPI changes
 */
export function getTrendDisplay(trend: 'up' | 'down' | 'stable', changePercent?: number) {
  const absChange = Math.abs(changePercent || 0);
  
  switch (trend) {
    case 'up':
      return {
        icon: '↗️',
        color: 'kpi-trend-up',
        text: `+${absChange.toFixed(1)}%`
      };
    case 'down':
      return {
        icon: '↘️',
        color: 'kpi-trend-down',
        text: `-${absChange.toFixed(1)}%`
      };
    case 'stable':
    default:
      return {
        icon: '➡️',
        color: 'kpi-trend-stable',
        text: '0.0%'
      };
  }
}

/**
 * Format numbers with appropriate units and precision
 */
export function formatNumber(
  value: number, 
  options: {
    decimals?: number;
    unit?: string;
    compact?: boolean;
  } = {}
): string {
  const { decimals = 1, unit = '', compact = false } = options;
  
  if (compact && Math.abs(value) >= 1000) {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(decimals)}M${unit}`;
    }
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(decimals)}K${unit}`;
    }
  }
  
  return `${value.toFixed(decimals)}${unit}`;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Generate a random ID for components
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string for use in URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate color based on string hash (for consistent colors)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Check if current time is within business hours
 */
export function isBusinessHours(date: Date = new Date()): boolean {
  const hours = date.getHours();
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Monday to Friday, 6 AM to 10 PM
  return day >= 1 && day <= 5 && hours >= 6 && hours < 22;
}

/**
 * Get confidence level description
 */
export function getConfidenceLevel(confidence: number): {
  level: string;
  color: string;
  description: string;
} {
  if (confidence >= 0.9) {
    return {
      level: 'Very High',
      color: 'text-green-600 dark:text-green-400',
      description: 'Highly reliable prediction'
    };
  } else if (confidence >= 0.8) {
    return {
      level: 'High',
      color: 'text-green-600 dark:text-green-400',
      description: 'Reliable prediction'
    };
  } else if (confidence >= 0.7) {
    return {
      level: 'Medium',
      color: 'text-yellow-600 dark:text-yellow-400',
      description: 'Moderately reliable'
    };
  } else if (confidence >= 0.6) {
    return {
      level: 'Low',
      color: 'text-orange-600 dark:text-orange-400',
      description: 'Less reliable prediction'
    };
  } else {
    return {
      level: 'Very Low',
      color: 'text-red-600 dark:text-red-400',
      description: 'Unreliable prediction'
    };
  }
}

/**
 * Priority level utilities
 */
export function getPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return 'text-purple-600 dark:text-purple-400';
    case 'high':
      return 'text-red-600 dark:text-red-400';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'low':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-muted-foreground';
  }
}

export function getPriorityBadgeClass(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return 'recommendation-priority-critical';
    case 'high':
      return 'recommendation-priority-high';
    case 'medium':
      return 'recommendation-priority-medium';
    case 'low':
      return 'recommendation-priority-low';
    default:
      return 'border-l-4 border-l-muted';
  }
}