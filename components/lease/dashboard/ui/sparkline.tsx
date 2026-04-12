"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import { cn } from "@/lib/utils";

interface SparklineProps {
  color?: string;
  points?: number[];
  height?: number;
  className?: string;
  tooltipFormatter?: (value: number, index: number) => string;
}

const DEFAULT_POINTS = [20, 20.2, 20.1, 20.3, 20.25, 20.35, 20.3, 20.4];

export function Sparkline({
  color = "#6B7280",
  points,
  height = 32,
  className,
  tooltipFormatter,
}: SparklineProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const data = useMemo(
    () =>
      (points && points.length > 1 ? points : DEFAULT_POINTS).map(
        (value, index) => ({
          index,
          value,
        }),
      ),
    [points],
  );

  const options = useMemo<AgChartOptions>(
    () => ({
      data,
      autoSize: true,
      background: {
        fill: "transparent",
      },
      padding: {
        top: 2,
        right: 0,
        bottom: 2,
        left: 0,
      },
      series: [
        {
          type: "line",
          xKey: "index",
          yKey: "value",
          stroke: color,
          strokeWidth: 2,
          marker: {
            enabled: false,
          },
          interpolation: {
            type: "smooth",
          },
          tooltip: {
            renderer: ({
              datum,
            }: {
              datum: { index: number; value: number };
            }) => ({
              content:
                tooltipFormatter?.(datum.value, datum.index) ??
                datum.value.toString(),
            }),
          },
        },
      ],
      axes: [
        {
          type: "number",
          position: "bottom",
          line: { enabled: false },
          label: { enabled: false },
          tick: { enabled: false },
          gridLine: { enabled: false },
        },
        {
          type: "number",
          position: "left",
          line: { enabled: false },
          label: { enabled: false },
          tick: { enabled: false },
          gridLine: { enabled: false },
          min: Math.min(...data.map((item) => item.value)) - 0.05,
          max: Math.max(...data.map((item) => item.value)) + 0.05,
        },
      ],
      legend: {
        enabled: false,
      },
      tooltip: {
        class: isDark ? "ag-sparkline-tooltip-dark" : "ag-sparkline-tooltip-light",
      },
    }),
    [color, data, isDark, tooltipFormatter],
  );

  return (
    <div
      className={cn("h-full w-full overflow-hidden", className)}
      style={{ height }}
    >
      <AgCharts options={options} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
