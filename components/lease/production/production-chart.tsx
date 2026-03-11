"use client";

import * as React from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { useTheme } from "next-themes";
import { ProductionRecord, ProductionStats, TIME_RANGES } from "./types";

interface ProductionChartProps {
  data: ProductionRecord[];
  stats: ProductionStats;
  isLoading?: boolean;
}

export function ProductionChart({
  data,
  stats,
  isLoading = false,
}: ProductionChartProps) {
  const [activeRange, setActiveRange] = React.useState("Y");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const chartOptions: AgChartOptions = React.useMemo(() => {
    return {
      data,
      background: {
        fill: isDark ? "#252930" : "#f4f6f8",
      },
      padding: { top: 20, right: 20, bottom: 40, left: 60 },
      series: [
        {
          type: "line",
          xKey: "date",
          yKey: "h2o",
          yName: "H2O",
          stroke: "#3b82f6",
          strokeWidth: 2,
        },
        {
          type: "line",
          xKey: "date",
          yKey: "oil",
          yName: "Oil",
          stroke: "#6b7280",
          strokeWidth: 2,
        },
        {
          type: "line",
          xKey: "date",
          yKey: "gas",
          yName: "Gas",
          stroke: "#9ca3af",
          strokeWidth: 2,
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            fontSize: 11,
          },
          gridLine: {
            enabled: true,
            style: [
              {
                stroke: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                lineDash: [3, 3],
              },
            ],
          },
        },
        {
          type: "number",
          position: "left",
          label: {
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            fontSize: 11,
          },
          title: {
            text: "BBLs",
            enabled: true,
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            fontSize: 12,
          },
          gridLine: {
            enabled: true,
            style: [
              {
                stroke: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                lineDash: [4, 4],
              },
            ],
          },
        },
      ],
      legend: { enabled: false },
    };
  }, [data, isDark]);

  const LEGEND = [
    { color: "#3b82f6", label: "H2O", shape: "line" },
    { color: "#6b7280", label: "Oil", shape: "line" },
    { color: "#9ca3af", label: "Gas", shape: "line" },
    { color: "#10b981", label: "Msg", shape: "circle" },
    { color: "#ef4444", label: "Alarms", shape: "triangle" },
  ];

  return (
    <>
      {/* Time range buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TIME_RANGES.map((r, i) => (
          <button
            key={`${r}-${i}`}
            onClick={() => setActiveRange(r)}
            className={`h-8 min-w-[36px] rounded px-3 text-xs font-medium transition-colors ${
              activeRange === r
                ? "bg-[#34C759] text-black"
                : "border border-black/10 bg-transparent text-black/40 hover:bg-black/5 dark:border-white/10 dark:text-white/40 dark:hover:bg-white/5"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart + side stats */}
      <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
        {/* Chart area */}
        <div className="min-h-[260px] rounded-lg bg-gray-100 p-4 dark:bg-[#252930]">
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-black/20 dark:text-white/20">
              Loading…
            </div>
          ) : (
            <>
              <div className="h-[220px] w-full">
                <AgCharts options={chartOptions} />
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-black/40 dark:text-white/40">
                {LEGEND.map(({ color, label, shape }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    {shape === "line" && (
                      <span
                        className="inline-block h-1.5 w-4 rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    {shape === "circle" && (
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    {shape === "triangle" && (
                      <span
                        className="inline-block"
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: "4px solid transparent",
                          borderRight: "4px solid transparent",
                          borderBottom: `7px solid ${color}`,
                        }}
                      />
                    )}
                    {label}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Side stats */}
        <div className="space-y-3">
          {[
            { label: "Oil Stock", value: stats.oilStock },
            { label: "Avg. Runs/Day", value: stats.avgRunsDay },
            { label: "Yest. Runs", value: stats.yesterdayRuns },
            { label: "Avg. Flow Time", value: stats.avgFlowTime },
            { label: "Avg. Prod. Time", value: stats.avgProdTime },
            { label: "Avg. Oil Prod.", value: stats.avgOilProd },
            { label: "Oil Tank #1 Stock", value: stats.oilTank1Stock },
            { label: "Oil Tank #1 Prod", value: stats.oilTank1Prod },
            { label: "Oil Tank #2 Stock", value: stats.oilTank2Stock },
            { label: "Oil Tank #2 Prod", value: stats.oilTank2Prod },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] text-black/40 dark:text-white/40">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-black dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
