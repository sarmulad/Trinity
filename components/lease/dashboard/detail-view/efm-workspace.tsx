"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import { AgGridReact as AgGridReactBase } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ExcelExportModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
  ExcelExportModule,
]);

const AgGridReact = AgGridReactBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

export type EfmCategory =
  | "daily"
  | "logPeriod"
  | "spot"
  | "configuration"
  | "events"
  | "alarms";

type EfmViewMode = "table" | "chart" | "both";

export interface EfmCurrentValue {
  label: string;
  value: string;
}

export interface EfmDataRow {
  [key: string]: string | number;
}

export interface EfmDataset {
  key: EfmCategory;
  label: string;
  updatedAt: string;
  chartYLabel: string;
  rows: EfmDataRow[];
  chartData: { date: string; value: number }[];
}

export interface EfmWorkspaceData {
  currentValues: EfmCurrentValue[];
  datasets: EfmDataset[];
}

interface EfmWorkspaceProps {
  data: EfmWorkspaceData;
}

function titleize(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

export function EfmWorkspace({ data }: EfmWorkspaceProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeCategory, setActiveCategory] = React.useState<EfmCategory>(
    data.datasets[0]?.key ?? "spot",
  );
  const [viewMode, setViewMode] = React.useState<EfmViewMode>("table");
  const [gridApi, setGridApi] = React.useState<GridApi | null>(null);

  const activeDataset =
    data.datasets.find((d) => d.key === activeCategory) ?? data.datasets[0];

  const rowData = activeDataset?.rows ?? [];

  const columnDefs = React.useMemo<ColDef<EfmDataRow>[]>(
    () =>
      rowData.length
        ? Object.keys(rowData[0]).map((field) => ({
            field,
            headerName: field,
            sortable: true,
            filter: true,
            resizable: true,
            minWidth: 120,
            flex: field.toLowerCase().includes("description") ? 1.6 : 1,
          }))
        : [],
    [rowData],
  );

  const gridTheme = React.useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: isDark ? "#16181d" : "#ffffff",
        headerBackgroundColor: isDark ? "#1a1d23" : "#f7f8fa",
        oddRowBackgroundColor: isDark ? "#1e2025" : "#f8fafc",
        rowHoverColor: isDark ? "#2a303a" : "rgba(0,0,0,0.04)",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        foregroundColor: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)",
        headerTextColor: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
        selectedRowBackgroundColor: "rgba(52,199,89,0.12)",
        fontSize: 12,
      }),
    [isDark],
  );

  const chartOptions = React.useMemo<AgChartOptions>(
    () => ({
      data: activeDataset?.chartData ?? [],
      background: { fill: isDark ? "#16181d" : "#ffffff" },
      padding: { top: 16, right: 20, bottom: 36, left: 16 },
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
              content: `${datum.date}: ${datum.value}`,
            }),
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          line: { enabled: false },
          tick: { enabled: false },
          label: {
            color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
            fontSize: 11,
          },
          gridLine: {
            enabled: true,
            style: [
              {
                stroke: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                lineDash: [4, 4],
              },
            ],
          },
        },
        {
          type: "number",
          position: "left",
          line: { enabled: false },
          label: {
            color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
            fontSize: 11,
          },
          gridLine: {
            enabled: true,
            style: [
              {
                stroke: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                lineDash: [4, 4],
              },
            ],
          },
          title: {
            text: activeDataset?.chartYLabel ?? "",
            color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
            fontSize: 11,
          },
        },
      ],
      legend: { enabled: false },
    }),
    [activeDataset, isDark],
  );

  const onGridReady = React.useCallback((event: GridReadyEvent<EfmDataRow>) => {
    setGridApi(event.api);
  }, []);

  const downloadCsv = React.useCallback(() => {
    if (!gridApi || !activeDataset) return;
    gridApi.exportDataAsCsv({
      fileName: `efm-${activeDataset.key}.csv`,
    });
  }, [activeDataset, gridApi]);

  const downloadExcel = React.useCallback(() => {
    if (!gridApi || !activeDataset) return;
    const apiWithExcel = gridApi as GridApi & {
      exportDataAsExcel?: (params?: { fileName?: string }) => void;
    };
    apiWithExcel.exportDataAsExcel?.({
      fileName: `efm-${activeDataset.key}.xlsx`,
    });
  }, [activeDataset, gridApi]);

  if (!activeDataset) {
    return (
      <div className="rounded-xl border border-black/10 bg-black/[0.03] p-5 text-sm text-black/60 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60">
        No EFM data available.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-black dark:text-white">
            Current Values
          </p>
          {/* <span className="text-xs text-black/45 dark:text-white/45">
            {activeDataset.updatedAt}
          </span> */}
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-2">
          {data.currentValues.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#1a1d23]"
            >
              <p className="text-[11px] text-black/45 dark:text-white/45">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-black dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#1a1d23]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-black/10 p-0.5 dark:border-white/10">
              {(["table", "chart", "both"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`rounded-md px-2.5 py-1 text-xs capitalize transition-colors ${
                    viewMode === mode
                      ? "bg-[#34C759] text-black"
                      : "text-black/65 hover:text-black dark:text-white/65 dark:hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <select
              value={activeCategory}
              onChange={(event) =>
                setActiveCategory(event.target.value as EfmCategory)
              }
              className="h-9 min-w-[180px] rounded-lg border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-[#34C759]/50 dark:border-white/10 dark:bg-[#252930] dark:text-white"
            >
              {data.datasets.map((dataset) => (
                <option key={dataset.key} value={dataset.key}>
                  {dataset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadCsv}
              className="rounded-md border border-black/15 px-2.5 py-1 text-xs text-black/80 hover:bg-black/5 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
            >
              Download CSV
            </button>
            <button
              onClick={downloadExcel}
              className="rounded-md border border-black/15 px-2.5 py-1 text-xs text-black/80 hover:bg-black/5 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
            >
              Download Excel
            </button>
          </div>
        </div>

        <div
          className={`${viewMode === "both" ? "grid grid-cols-1 xl:grid-cols-2 gap-4" : ""}`}
        >
          {(viewMode === "chart" || viewMode === "both") && (
            <div className="rounded-lg border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-[#16181d]">
              <p className="mb-2 text-xs text-black/45 dark:text-white/45">
                {activeDataset.label} Trend
              </p>
              <AgCharts options={chartOptions} style={{ height: 320 }} />
            </div>
          )}

          {(viewMode === "table" || viewMode === "both") && (
            <div className="rounded-lg border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-[#16181d]">
              <p className="mb-2 text-xs text-black/45 dark:text-white/45">
                {activeDataset.label} Records
              </p>
              <div style={{ height: 360 }}>
                <AgGridReact
                  theme={gridTheme}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true,
                  }}
                  suppressMovableColumns
                  rowHeight={34}
                  headerHeight={36}
                  pagination
                  paginationPageSize={12}
                  onGridReady={onGridReady}
                />
              </div>
              {activeDataset.key === "alarms" && (
                <p className="mt-2 text-right text-xs text-black/45 dark:text-white/45">
                  {rowData.length} alarms
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
