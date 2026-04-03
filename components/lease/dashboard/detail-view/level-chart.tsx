"use client";

import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";

interface LevelChartProps {
  data: { date: string; value: number }[];
  lastUpdated?: string;
  xAxisLabel?: string;
}

export function LevelChart({
  data,
  lastUpdated = "15 minutes ago",
  xAxisLabel = "Oil Tank (FT)",
}: LevelChartProps) {
  const options: AgChartOptions = useMemo(
    () => ({
      data,
      background: { fill: "#1a1d23" },
      padding: { top: 16, right: 24, bottom: 40, left: 16 },
      series: [
        {
          type: "line",
          xKey: "date",
          yKey: "value",
          stroke: "#34C759",
          strokeWidth: 2,
          marker: { enabled: false },
          tooltip: {
            renderer: ({
              datum,
            }: {
              datum: { date: string; value: number };
            }) => ({
              content: `${datum.date}: ${datum.value} FT`,
            }),
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            color: "rgba(255,255,255,0.35)",
            fontSize: 11,
          },
          line: { enabled: false },
          tick: { enabled: false },
          gridLine: {
            enabled: true,
            style: [{ stroke: "rgba(255,255,255,0.06)", lineDash: [4, 4] }],
          },
          title: {
            text: xAxisLabel,
            color: "#34C759",
            fontSize: 12,
            spacing: 16,
          },
        },
        {
          type: "number",
          position: "left",
          min: 0,
          max: 15,
          tick: { values: [0, 5, 10, 15] },
          label: {
            color: "rgba(255,255,255,0.35)",
            fontSize: 11,
          },
          line: { enabled: false },
          gridLine: {
            enabled: true,
            style: [{ stroke: "rgba(255,255,255,0.06)", lineDash: [4, 4] }],
          },
          title: {
            text: "Tank Height",
            color: "rgba(255,255,255,0.3)",
            fontSize: 11,
          },
        },
      ],
      legend: { enabled: false },
    }),
    [data, xAxisLabel],
  );

  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1d23] p-5">
      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm font-semibold text-white">
          Tank Level Line Chart
        </p>
        <span className="text-xs text-white/30">– {lastUpdated}</span>
      </div>
      <AgCharts options={options} style={{ height: 300 }} />
    </div>
  );
}
