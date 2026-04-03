/**
 * Application-wide constants and configuration
 */

export const APP_NAME = 'Trinity Energy';
export const APP_DESCRIPTION = 'Oil & Gas Production Monitoring and Analytics Platform';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Storage keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar-state',
  USER_PREFERENCES: 'user-preferences',
} as const;

// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Chart colors
export const CHART_COLORS = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  tertiary: 'hsl(var(--chart-3))',
  quaternary: 'hsl(var(--chart-4))',
  quinary: 'hsl(var(--chart-5))',
} as const;

// Status colors
export const STATUS_COLORS = {
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',
} as const;

/**
 * Oil & Gas Production Constants
 */

// Production units
export const PRODUCTION_UNITS = {
  OIL: 'bbl/d', // barrels per day
  GAS: 'mcf/d', // thousand cubic feet per day
  WATER: 'bbl/d',
  PRESSURE: 'psi', // pounds per square inch
  TEMPERATURE: '°F',
} as const;

// Well status mapping
export const WELL_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  ALERT: 'alert',
} as const;

export const WELL_STATUS_COLORS = {
  active: 'text-chart-2',
  inactive: 'text-muted-foreground',
  maintenance: 'text-chart-3',
  alert: 'text-destructive',
} as const;

// Alert severity mapping
export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const ALERT_SEVERITY_COLORS = {
  critical: 'text-destructive',
  high: 'text-orange-600',
  medium: 'text-chart-3',
  low: 'text-blue-600',
} as const;

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  REAL_TIME: 5000, // 5 seconds
  FREQUENT: 30000, // 30 seconds
  NORMAL: 60000, // 1 minute
  SLOW: 300000, // 5 minutes
} as const;

// Data range options
export const TIME_RANGES = {
  '1h': { label: 'Last Hour', value: '1h' },
  '6h': { label: 'Last 6 Hours', value: '6h' },
  '12h': { label: 'Last 12 Hours', value: '12h' },
  '24h': { label: 'Last 24 Hours', value: '24h' },
  '7d': { label: 'Last 7 Days', value: '7d' },
  '30d': { label: 'Last 30 Days', value: '30d' },
  '90d': { label: 'Last 90 Days', value: '90d' },
} as const;

// Tago.io Configuration
export const TAGO_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_TAGO_API_URL || 'https://api.tago.io',
  TOKEN: process.env.TAGO_TOKEN,
  DEVICE_TOKEN: process.env.TAGO_DEVICE_TOKEN,
} as const;
