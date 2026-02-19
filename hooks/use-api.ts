"use client";

/**
 * Custom React Hooks for API Data Fetching
 * Implements SWR pattern with automatic revalidation and caching
 */

import { useEffect, useState, useCallback } from "react";
import type { Well, DashboardMetrics, Alert } from "@/types";

interface UseAPIOptions {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
}

interface UseAPIResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<void>;
}

/**
 * Generic hook for API data fetching with SWR pattern
 */
export function useAPI<T>(
  fetcher: () => Promise<T>,
  options: UseAPIOptions = {}
): UseAPIResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const {
    refreshInterval,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
  } = options;

  const fetchData = useCallback(
    async (isInitial = false) => {
      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsValidating(true);
      }
      setError(null);

      try {
        const result = await fetcher();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error(" API fetch error:", err);
      } finally {
        setIsLoading(false);
        setIsValidating(false);
      }
    },
    [fetcher]
  );

  // Initial fetch
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchData(false);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchData]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => fetchData(false);
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [revalidateOnFocus, fetchData]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleOnline = () => fetchData(false);
    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, [revalidateOnReconnect, fetchData]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate: () => fetchData(false),
  };
}

/**
 * Hook for fetching dashboard metrics
 */
export function useDashboardMetrics(options?: UseAPIOptions) {
  return useAPI<DashboardMetrics>(
    async () => {
      const response = await fetch("/api/dashboard/metrics");
      if (!response.ok) throw new Error("Failed to fetch metrics");
      return response.json();
    },
    { refreshInterval: 30000, ...options } // Refresh every 30 seconds
  );
}

/**
 * Hook for fetching alerts
 */
export function useAlerts(options?: UseAPIOptions) {
  return useAPI<{ alerts: Alert[] }>(
    async () => {
      const response = await fetch("/api/dashboard/alerts");
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json();
    },
    { refreshInterval: 60000, ...options } // Refresh every minute
  );
}

/**
 * Hook for fetching wells data
 */
export function useWells(
  filters?: { region?: string; status?: string },
  options?: UseAPIOptions
) {
  return useAPI<{ wells: Well[]; total: number }>(
    async () => {
      const params = new URLSearchParams(filters as any).toString();
      const url = params ? `/api/wells?${params}` : "/api/wells";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch wells");
      return response.json();
    },
    { refreshInterval: 45000, ...options } // Refresh every 45 seconds
  );
}

/**
 * Hook for fetching production history
 */
export function useProductionHistory(
  params?: { wellId?: string; range?: string },
  options?: UseAPIOptions
) {
  return useAPI<{ data: any[] }>(async () => {
    const queryParams = new URLSearchParams(params as any).toString();
    const url = queryParams
      ? `/api/production/history?${queryParams}`
      : "/api/production/history";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch production history");
    return response.json();
  }, options);
}
