"use client";

import * as React from "react";
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

const gridTheme = themeQuartz.withParams({
  backgroundColor: "#16181d",
  headerBackgroundColor: "#1a1d23",
  oddRowBackgroundColor: "#1e2025",
  rowHoverColor: "#2a303a",
  borderColor: "rgba(255,255,255,0.08)",
  foregroundColor: "rgba(255,255,255,0.75)",
  headerTextColor: "rgba(255,255,255,0.55)",
  selectedRowBackgroundColor: "rgba(52,199,89,0.12)",
  fontSize: 12,
});

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

  const chartOptions = React.useMemo<AgChartOptions>(
    () => ({
      data: activeDataset?.chartData ?? [],
      background: { fill: "#16181d" },
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
            renderer: ({ datum }: { datum: { date: string; value: number } }) => ({
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
          label: { color: "rgba(255,255,255,0.35)", fontSize: 11 },
          gridLine: {
            enabled: true,
            style: [{ stroke: "rgba(255,255,255,0.06)", lineDash: [4, 4] }],
          },
        },
        {
          type: "number",
          position: "left",
          line: { enabled: false },
          label: { color: "rgba(255,255,255,0.35)", fontSize: 11 },
          gridLine: {
            enabled: true,
            style: [{ stroke: "rgba(255,255,255,0.06)", lineDash: [4, 4] }],
          },
          title: {
            text: activeDataset?.chartYLabel ?? "",
            color: "rgba(255,255,255,0.35)",
            fontSize: 11,
          },
        },
      ],
      legend: { enabled: false },
    }),
    [activeDataset],
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
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/60">
        No EFM data available.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Current Values</p>
          <span className="text-xs text-white/45">{activeDataset.updatedAt}</span>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-2">
          {data.currentValues.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/10 bg-[#1a1d23] px-3 py-2"
            >
              <p className="text-[11px] text-white/45">{item.label}</p>
              <p className="text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1a1d23] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-white/10 p-0.5">
            {(["table", "chart", "both"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded-md px-2.5 py-1 text-xs capitalize transition-colors ${
                  viewMode === mode
                    ? "bg-[#34C759] text-black"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadCsv}
              className="rounded-md border border-white/15 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10"
            >
              Download CSV
            </button>
            <button
              onClick={downloadExcel}
              className="rounded-md border border-white/15 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10"
            >
              Download Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[170px_minmax(0,1fr)] gap-4">
          <aside className="space-y-1">
            {data.datasets.map((dataset) => (
              <button
                key={dataset.key}
                onClick={() => setActiveCategory(dataset.key)}
                className={`w-full rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                  activeCategory === dataset.key
                    ? "bg-[#34C759]/20 text-[#7DFF9F]"
                    : "text-white/70 hover:bg-white/[0.05]"
                }`}
              >
                {dataset.label}
              </button>
            ))}
          </aside>

          <div className={`${viewMode === "both" ? "grid grid-cols-1 xl:grid-cols-2 gap-4" : ""}`}>
            {(viewMode === "chart" || viewMode === "both") && (
              <div className="rounded-lg border border-white/10 bg-[#16181d] p-3">
                <p className="mb-2 text-xs text-white/45">
                  {activeDataset.label} Trend
                </p>
                <AgCharts options={chartOptions} style={{ height: 320 }} />
              </div>
            )}

            {(viewMode === "table" || viewMode === "both") && (
              <div className="rounded-lg border border-white/10 bg-[#16181d] p-3">
                <p className="mb-2 text-xs text-white/45">
                  {activeDataset.label} Records
                </p>
                <div style={{ height: 360 }}>
                  <AgGridReact
                    theme={gridTheme}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: true, sortable: true, filter: true }}
                    suppressMovableColumns
                    rowHeight={34}
                    headerHeight={36}
                    pagination
                    paginationPageSize={12}
                    onGridReady={onGridReady}
                  />
                </div>
                {activeDataset.key === "alarms" && (
                  <p className="mt-2 text-right text-xs text-white/45">
                    {rowData.length} alarms
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
