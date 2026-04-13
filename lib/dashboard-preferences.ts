"use client";

import * as React from "react";

export type BenchmarkKey =
  | "WTI Oil"
  | "Brent Oil"
  | "Kansas Oil"
  | "Oklahoma Oil"
  | "Henry Hub"
  | "Natural Gas"
  | "NYMEX Gas";

export interface DashboardPreferences {
  showPriceTicker: boolean;
  defaultOilBenchmark: BenchmarkKey;
  defaultGasBenchmark: BenchmarkKey;
}

const STORAGE_KEY = "dashboard_preferences";
const UPDATE_EVENT = "dashboard-preferences-updated";

export const DEFAULT_DASHBOARD_PREFERENCES: DashboardPreferences = {
  showPriceTicker: true,
  defaultOilBenchmark: "WTI Oil",
  defaultGasBenchmark: "Henry Hub",
};

function readStoredPreferences(): DashboardPreferences {
  if (typeof window === "undefined") return DEFAULT_DASHBOARD_PREFERENCES;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DASHBOARD_PREFERENCES;

    const parsed = JSON.parse(raw) as Partial<DashboardPreferences>;
    return {
      ...DEFAULT_DASHBOARD_PREFERENCES,
      ...parsed,
    };
  } catch {
    return DEFAULT_DASHBOARD_PREFERENCES;
  }
}

function writeStoredPreferences(value: DashboardPreferences) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: value }));
}

export function useDashboardPreferences() {
  const [preferences, setPreferences] = React.useState<DashboardPreferences>(
    DEFAULT_DASHBOARD_PREFERENCES,
  );

  React.useEffect(() => {
    setPreferences(readStoredPreferences());

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== STORAGE_KEY) return;
      setPreferences(readStoredPreferences());
    };

    const handleCustomUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<DashboardPreferences>;
      setPreferences(customEvent.detail ?? readStoredPreferences());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(UPDATE_EVENT, handleCustomUpdate as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        UPDATE_EVENT,
        handleCustomUpdate as EventListener,
      );
    };
  }, []);

  const updatePreferences = React.useCallback(
    (
      updater:
        | Partial<DashboardPreferences>
        | ((current: DashboardPreferences) => DashboardPreferences),
    ) => {
      setPreferences((current) => {
        const next =
          typeof updater === "function"
            ? updater(current)
            : { ...current, ...updater };
        writeStoredPreferences(next);
        return next;
      });
    },
    [],
  );

  return { preferences, updatePreferences };
}
