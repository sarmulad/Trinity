"use client";

import { useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";

interface SparklineProps {
  color?: string;
  points?: number[];
  width?: number;
  height?: number;
}

const DEFAULT_POINTS = [20, 24, 22, 30, 27, 33, 31, 36];

export function Sparkline({
  color = "#6B7280",
  points,
  width = 72,
  height = 24,
}: SparklineProps) {
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
      autoSize: false,
      width,
      height,
      background: {
        fill: "transparent",
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      series: [
        {
          type: "line",
          xKey: "index",
          yKey: "value",
          stroke: color,
          strokeWidth: 1.6,
          marker: {
            enabled: false,
          },
          tooltip: {
            enabled: false,
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
        },
      ],
      legend: {
        enabled: false,
      },
    }),
    [color, data, height, width],
  );

  return (
    <div className="opacity-70" style={{ width, height }}>
      <AgCharts options={options} />
    </div>
  );
}
