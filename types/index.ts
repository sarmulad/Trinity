import React from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface MetricData {
  label: string;
  value: number;
  unit: string;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

export interface ChartData {
  date: string;
  value: number;
  category?: string;
  label?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  loading?: boolean;
}

export interface DataTableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  column: string;
  direction: "asc" | "desc";
}

export interface TableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  emptyMessage?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  activeUsers: number;
  conversionRate: number;
}

export type ThemeMode = "light" | "dark" | "system";

export interface Well {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    region: string;
  };
  status: WellStatus;
  type: WellType;
  productionData: ProductionData;
  lastUpdated: string;
  alerts?: Alert[];
}

export type WellStatus = "active" | "inactive" | "maintenance" | "alert";
export type WellType = "oil" | "gas" | "water-injection" | "gas-injection";

export interface ProductionData {
  oil: ProductionMetric;
  gas: ProductionMetric;
  water: ProductionMetric;
  pressure: number;
  temperature: number;
}

export interface ProductionMetric {
  current: number;
  daily: number;
  monthly: number;
  unit: string;
  trend?: number;
}

export interface Alert {
  id: string;
  wellId: string;
  wellName: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export type AlertType =
  | "pressure-high"
  | "pressure-low"
  | "temperature-high"
  | "production-low"
  | "equipment-failure"
  | "safety"
  | "maintenance-due";

export type AlertSeverity = "critical" | "high" | "medium" | "low";

export interface ProductionReport {
  id: string;
  period: {
    start: string;
    end: string;
  };
  wells: string[];
  totalProduction: {
    oil: number;
    gas: number;
    water: number;
  };
  generatedAt: string;
  generatedBy: string;
}

/** List view item for reports table (date, name, author, status) */
export interface ReportListItem {
  id: string;
  date: string;
  reportName: string;
  author: string;
  status: "Ready" | "Generating" | "Failed";
}

export interface DashboardMetrics {
  totalProduction: {
    oil: number;
    gas: number;
    change: number;
  };
  activeWells: {
    count: number;
    change: number;
  };
  alerts: {
    count: number;
    critical: number;
  };
  efficiency: {
    percentage: number;
    change: number;
  };
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartOptions {
  title?: string;
  type: "line" | "bar" | "area" | "pie";
  data: TimeSeriesData[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
}

/**
 * Tago.io Integration Types
 */

export interface TagoDevice {
  id: string;
  name: string;
  type: string;
  tags?: string[];
  variables?: TagoVariable[];
}

export interface TagoVariable {
  variable: string;
  value: number | string | boolean;
  unit?: string;
  time: string;
  metadata?: Record<string, any>;
}

export interface TagoQuery {
  variables: string[];
  qty?: number;
  start_date?: string;
  end_date?: string;
}

export interface AuthUser extends User {
  role: UserRole;
  permissions: Permission[];
  organization: string;
}

export type UserRole = "admin" | "operator" | "engineer" | "viewer";

export type Permission =
  | "wells:view"
  | "wells:edit"
  | "alerts:view"
  | "alerts:acknowledge"
  | "reports:view"
  | "reports:generate"
  | "settings:manage"
  | "users:manage";
