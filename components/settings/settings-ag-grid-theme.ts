"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { themeQuartz } from "ag-grid-community";

export function useSettingsAgGridTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return React.useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: isDark ? "#1A1C1E" : "#ffffff",
        headerBackgroundColor: isDark ? "#252930" : "#f4f6f8",
        oddRowBackgroundColor: isDark ? "#1A1C1E" : "#f9fafb",
        rowHoverColor: isDark ? "#2d3440" : "#f0f2f4",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        foregroundColor: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)",
        headerTextColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
        fontSize: 13,
        selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
      }),
    [isDark],
  );
}
