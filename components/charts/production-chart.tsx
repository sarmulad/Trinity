"use client";

import * as React from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";

interface ProductionDataPoint {
  date: string;
  h2o: number;
  oil: number;
  gas: number;
  msg?: number;
  alarms?: number;
}

interface ProductionChartProps {
  data: ProductionDataPoint[];
  height?: number;
}

export function ProductionChart({ data, height = 400 }: ProductionChartProps) {
  const chartOptions = React.useMemo<AgChartOptions>(
    () => ({
      data,
      theme: {
        baseTheme: "ag-default-dark",
        palette: {
          fills: ["#3b82f6", "#f59e0b", "#6b7280", "#34C759", "#ef4444"],
          strokes: ["#3b82f6", "#f59e0b", "#6b7280", "#34C759", "#ef4444"],
        },
        overrides: {
          common: {
            background: {
              fill: "transparent",
            },
            axes: {
              category: {
                line: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                gridLine: {
                  style: [
                    {
                      stroke: "rgba(255, 255, 255, 0.05)",
                      lineDash: [4, 4],
                    },
                  ],
                },
                label: {
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: 12,
                },
              },
              number: {
                line: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                gridLine: {
                  style: [
                    {
                      stroke: "rgba(255, 255, 255, 0.05)",
                      lineDash: [4, 4],
                    },
                  ],
                },
                label: {
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: 12,
                },
                title: {
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: 12,
                },
              },
            },
            legend: {
              item: {
                label: {
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: 12,
                },
              },
            },
          },
        },
      },
      series: [
        {
          type: "bar",
          xKey: "date",
          yKey: "h2o",
          yName: "H2O",
          fill: "#3b82f6",
          stroke: "#3b82f6",
          cornerRadius: 4,
          tooltip: {
            renderer: ({ datum, yKey, yName }) => ({
              title: datum.date,
              content: `${yName}: ${datum[yKey]} BBLs`,
            }),
          },
        },
        {
          type: "line",
          xKey: "date",
          yKey: "oil",
          yName: "Oil",
          stroke: "#f59e0b",
          strokeWidth: 2,
          marker: {
            enabled: true,
            fill: "#f59e0b",
            stroke: "#f59e0b",
            size: 6,
          },
          tooltip: {
            renderer: ({ datum, yKey, yName }) => ({
              title: datum.date,
              content: `${yName}: ${datum[yKey]} BBLs`,
            }),
          },
        },
        {
          type: "line",
          xKey: "date",
          yKey: "gas",
          yName: "Gas",
          stroke: "#6b7280",
          strokeWidth: 2,
          marker: {
            enabled: true,
            fill: "#6b7280",
            stroke: "#6b7280",
            size: 6,
          },
          tooltip: {
            renderer: ({ datum, yKey, yName }) => ({
              title: datum.date,
              content: `${yName}: ${datum[yKey]} BBLs`,
            }),
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
        },
        {
          type: "number",
          position: "left",
          title: {
            text: "BBLs",
          },
          label: {
            formatter: ({ value }) => `${value}`,
          },
        },
      ],
      legend: {
        position: "bottom",
        spacing: 40,
      },
    }),
    [data]
  );

  return (
    <div className="h-full w-full" style={{ height }}>
      <AgCharts options={chartOptions} />
    </div>
  );
}
