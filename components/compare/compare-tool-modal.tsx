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
import {
  ArrowLeftRight,
  Download,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

type Scope = "company" | "lease";
type Range = "24h" | "7d" | "30d" | "90d" | "ytd";
type ViewMode = "table" | "chart" | "both";

interface CompareToolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: Scope;
  leaseId?: string;
  leaseName?: string;
}

interface VariableDef {
  key: string;
  label: string;
  unit: string;
  base: number;
  variance: number;
}

interface DeviceDef {
  id: string;
  name: string;
  variables: VariableDef[];
}

interface LeaseDeviceDef {
  leaseId: string;
  leaseName: string;
  devices: DeviceDef[];
}

interface SelectedSeries {
  id: string;
  leaseId: string;
  leaseName: string;
  deviceId: string;
  deviceName: string;
  variable: VariableDef;
}

const LEASE_DEVICE_CATALOG: LeaseDeviceDef[] = [
  {
    leaseId: "l1",
    leaseName: "Demo Lease #1",
    devices: [
      {
        id: "ot1",
        name: "Demo Lease #1 OT1",
        variables: [
          { key: "level", label: "level", unit: "ft", base: 17.16, variance: 0.35 },
          {
            key: "daily_data",
            label: "daily_data",
            unit: "BBL",
            base: 114.2,
            variance: 6.5,
          },
          {
            key: "accum_oil_sales",
            label: "accum_oil_sales",
            unit: "BBL",
            base: 7984,
            variance: 38,
          },
          {
            key: "accum_oil_production",
            label: "accum_oil_production",
            unit: "BBL",
            base: 9210,
            variance: 52,
          },
          {
            key: "yest_oil_production",
            label: "yest_oil_production",
            unit: "BBL",
            base: 17.2,
            variance: 0.55,
          },
          {
            key: "yest_oil_sales",
            label: "yest_oil_sales",
            unit: "BBL",
            base: 17.16,
            variance: 0.5,
          },
          { key: "new_alert", label: "new_alert", unit: "state", base: 1, variance: 1 },
          { key: "acknowledge", label: "acknowledge", unit: "state", base: 0, variance: 1 },
        ],
      },
      {
        id: "ot2",
        name: "Demo Lease #1 OT2",
        variables: [
          { key: "level", label: "level", unit: "ft", base: 17.2, variance: 0.38 },
          {
            key: "daily_data",
            label: "daily_data",
            unit: "BBL",
            base: 113.9,
            variance: 5.9,
          },
          {
            key: "accum_oil_sales",
            label: "accum_oil_sales",
            unit: "BBL",
            base: 7760,
            variance: 42,
          },
        ],
      },
      {
        id: "wt1",
        name: "Demo Lease #1 WT1",
        variables: [
          { key: "level", label: "level", unit: "ft", base: 9.82, variance: 0.3 },
          {
            key: "daily_data",
            label: "daily_data",
            unit: "BBL",
            base: 81.5,
            variance: 4.8,
          },
        ],
      },
    ],
  },
  {
    leaseId: "l2",
    leaseName: "Demo Lease #2",
    devices: [
      {
        id: "efm1",
        name: "Demo Lease #2 EFM1",
        variables: [
          {
            key: "flow_rate",
            label: "flow_rate",
            unit: "MCF/day",
            base: 286.4,
            variance: 11.5,
          },
          {
            key: "static_pressure",
            label: "static_pressure",
            unit: "PSIA",
            base: 15.61,
            variance: 0.45,
          },
        ],
      },
      {
        id: "sep1",
        name: "Demo Lease #2 SEP1",
        variables: [
          {
            key: "today_volume",
            label: "today_volume",
            unit: "BBL",
            base: 187.2,
            variance: 8.2,
          },
        ],
      },
    ],
  },
];

const SERIES_COLORS = [
  "#34C759",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
];

function normaliseLeaseName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function roundForUnit(value: number, unit: string): number | string {
  if (unit === "state") return Math.round(value) % 2 === 0 ? "Off" : "On";
  if (unit.includes("PSI") || unit.includes("ft")) return Number(value.toFixed(2));
  return Number(value.toFixed(2));
}

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function rangeToDates(range: Range): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);
  if (range === "24h") {
    start.setDate(end.getDate() - 1);
  } else if (range === "7d") {
    start.setDate(end.getDate() - 7);
  } else if (range === "30d") {
    start.setDate(end.getDate() - 30);
  } else if (range === "90d") {
    start.setDate(end.getDate() - 90);
  } else {
    start.setMonth(0, 1);
  }
  return { start, end };
}

function buildTimeAxis(startDate: string, endDate: string, range: Range): string[] {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:00:00`);
  const rows: string[] = [];

  if (range === "24h") {
    for (
      let cursor = new Date(start);
      cursor <= end && rows.length < 96;
      cursor.setHours(cursor.getHours() + 1)
    ) {
      rows.push(
        cursor.toLocaleString("en-US", { month: "2-digit", day: "2-digit", hour: "numeric" }),
      );
    }
    return rows;
  }

  for (
    let cursor = new Date(start);
    cursor <= end && rows.length < 365;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    rows.push(cursor.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }));
  }

  return rows;
}

export function CompareToolModal({
  open,
  onOpenChange,
  scope,
  leaseId,
  leaseName,
}: CompareToolModalProps) {
  const [range, setRange] = React.useState<Range>("7d");
  const [viewMode, setViewMode] = React.useState<ViewMode>("table");
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [expandedLeases, setExpandedLeases] = React.useState<string[]>([]);
  const [expandedDevices, setExpandedDevices] = React.useState<string[]>([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = React.useState<string[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [gridApi, setGridApi] = React.useState<GridApi | null>(null);
  const [startDate, setStartDate] = React.useState(() => {
    const { start } = rangeToDates("7d");
    return toDateInputValue(start);
  });
  const [endDate, setEndDate] = React.useState(() => {
    const { end } = rangeToDates("7d");
    return toDateInputValue(end);
  });

  const scopedCatalog = React.useMemo(() => {
    if (scope === "company") return LEASE_DEVICE_CATALOG;

    const byId =
      leaseId &&
      LEASE_DEVICE_CATALOG.filter((item) => item.leaseId.toLowerCase() === leaseId.toLowerCase());
    if (byId && byId.length > 0) return byId;

    const byName =
      leaseName &&
      LEASE_DEVICE_CATALOG.filter(
        (item) => normaliseLeaseName(item.leaseName) === normaliseLeaseName(leaseName),
      );
    return byName && byName.length > 0 ? byName : [LEASE_DEVICE_CATALOG[0]];
  }, [scope, leaseId, leaseName]);

  React.useEffect(() => {
    if (!open) return;
    setExpandedLeases(scopedCatalog.map((lease) => lease.leaseId));
    setSelectedDeviceIds([]);
    setSelectedIds([]);
    setPanelOpen(false);
  }, [open, scopedCatalog]);

  const availableSeries = React.useMemo<SelectedSeries[]>(() => {
    const rows: SelectedSeries[] = [];
    for (const lease of scopedCatalog) {
      for (const device of lease.devices) {
        for (const variable of device.variables) {
          rows.push({
            id: `${lease.leaseId}::${device.id}::${variable.key}`,
            leaseId: lease.leaseId,
            leaseName: lease.leaseName,
            deviceId: device.id,
            deviceName: device.name,
            variable,
          });
        }
      }
    }
    return rows;
  }, [scopedCatalog]);

  const selectedSeries = React.useMemo(
    () => availableSeries.filter((row) => selectedIds.includes(row.id)),
    [availableSeries, selectedIds],
  );

  const rowData = React.useMemo(() => {
    if (selectedSeries.length === 0) return [] as Record<string, string | number>[];

    const axis = buildTimeAxis(startDate, endDate, range);
    const keyById = new Map<string, string>();
    selectedSeries.forEach((series, index) => {
      keyById.set(series.id, `series_${index + 1}`);
    });

    return axis.map((timestamp, index) => {
      const row: Record<string, string | number> = { timestamp };
      selectedSeries.forEach((series, seriesIndex) => {
        const key = keyById.get(series.id);
        if (!key) return;
        const seasonal = Math.sin((index + seriesIndex) / 2.8) * series.variable.variance;
        const drift = Math.cos(index / 6.8) * (series.variable.variance * 0.42);
        row[key] = roundForUnit(series.variable.base + seasonal + drift, series.variable.unit);
      });
      return row;
    });
  }, [selectedSeries, range, startDate, endDate]);

  const columnDefs = React.useMemo<ColDef<Record<string, string | number>>[]>(
    () => {
      if (selectedSeries.length === 0) return [];
      return [
        {
          field: "timestamp",
          headerName: "DateTime",
          minWidth: 160,
          pinned: "left",
        },
        ...selectedSeries.map((series, index) => ({
          field: `series_${index + 1}`,
          headerName: `${series.deviceName} · ${series.variable.label}`,
          minWidth: 220,
          flex: 1,
        })),
      ];
    },
    [selectedSeries],
  );

  const chartOptions = React.useMemo<AgChartOptions>(
    () => ({
      data: rowData,
      background: { fill: "#16181d" },
      series: selectedSeries.map((series, index) => ({
        type: "line",
        xKey: "timestamp",
        yKey: `series_${index + 1}`,
        yName: `${series.deviceName} · ${series.variable.label}`,
        stroke: SERIES_COLORS[index % SERIES_COLORS.length],
        strokeWidth: 2,
        marker: { enabled: false },
      })),
      axes: [
        {
          type: "category",
          position: "bottom",
          label: { color: "rgba(255,255,255,0.45)", fontSize: 11 },
          gridLine: { enabled: true, style: [{ stroke: "rgba(255,255,255,0.08)" }] },
        },
        {
          type: "number",
          position: "left",
          label: { color: "rgba(255,255,255,0.45)", fontSize: 11 },
          gridLine: { enabled: true, style: [{ stroke: "rgba(255,255,255,0.08)" }] },
        },
      ],
      legend: { enabled: true, position: "bottom" },
      padding: { top: 10, right: 20, bottom: 24, left: 20 },
    }),
    [rowData, selectedSeries],
  );

  const onGridReady = React.useCallback(
    (event: GridReadyEvent<Record<string, string | number>>) => {
      setGridApi(event.api);
    },
    [],
  );

  const toggleLease = (id: string) => {
    setExpandedLeases((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const toggleDeviceExpand = (id: string) => {
    setExpandedDevices((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const toggleDevice = (lease: LeaseDeviceDef, device: DeviceDef) => {
    const deviceKey = `${lease.leaseId}::${device.id}`;
    const variableIds = device.variables.map(
      (variable) => `${lease.leaseId}::${device.id}::${variable.key}`,
    );
    const firstVariableId = variableIds[0];

    setSelectedDeviceIds((prev) =>
      prev.includes(deviceKey)
        ? prev.filter((id) => id !== deviceKey)
        : [...prev, deviceKey],
    );

    setSelectedIds((prev) => {
      if (prev.some((id) => variableIds.includes(id))) {
        return prev.filter((id) => !variableIds.includes(id));
      }
      if (!firstVariableId) return prev;
      return prev.includes(firstVariableId) ? prev : [...prev, firstVariableId];
    });
  };

  const toggleVariable = (seriesId: string) => {
    setSelectedIds((prev) =>
      prev.includes(seriesId) ? prev.filter((id) => id !== seriesId) : [...prev, seriesId],
    );
  };

  const applyRange = (nextRange: Range) => {
    setRange(nextRange);
    const { start, end } = rangeToDates(nextRange);
    setStartDate(toDateInputValue(start));
    setEndDate(toDateInputValue(end));
  };

  const downloadCsv = React.useCallback(() => {
    if (!gridApi) return;
    gridApi.exportDataAsCsv({
      fileName: `${scope}-comparison-${range}.csv`,
      allColumns: true,
    });
  }, [gridApi, scope, range]);

  const downloadExcel = React.useCallback(() => {
    if (!gridApi) return;
    const apiWithExcel = gridApi as GridApi & {
      exportDataAsExcel?: (params?: { fileName?: string }) => void;
    };
    apiWithExcel.exportDataAsExcel?.({
      fileName: `${scope}-comparison-${range}.xlsx`,
    });
  }, [gridApi, scope, range]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[97vw] max-w-[1500px] overflow-hidden border-white/10 bg-[#16181d] p-0 text-white">
        <DialogHeader className="border-b border-white/10 bg-[#1a1d23] px-4 py-2.5">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-white">
            <ArrowLeftRight className="h-4 w-4 text-[#34C759]" />
            {scope === "company" ? "Global Tag Widget" : "Lease Tag Widget"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Compare selected variables with table and chart views.
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex h-[calc(92vh-58px)] min-h-0 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#1a1d23] px-3 py-2">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className="rounded border border-[#34C759]/40 bg-[#34C759]/15 px-4 py-2 text-xs font-semibold text-[#34C759] hover:bg-[#34C759]/25"
            >
              Configure ({selectedDeviceIds.length} devices)
            </button>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center rounded border border-white/10 bg-[#16181d] p-0.5">
                {(["24h", "7d", "30d", "90d", "ytd"] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => applyRange(item)}
                    className={`rounded px-2 py-1 uppercase ${
                      range === item
                        ? "bg-[#34C759] text-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1">
                <span className="text-white/60">Start:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="rounded border border-white/10 bg-[#16181d] px-2 py-1 text-xs text-white"
                />
              </label>

              <label className="flex items-center gap-1">
                <span className="text-white/60">End:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="rounded border border-white/10 bg-[#16181d] px-2 py-1 text-xs text-white"
                />
              </label>

              <div className="ml-2 flex items-center rounded border border-white/10 bg-[#16181d] p-0.5">
                {(["table", "chart", "both"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`rounded px-2 py-1 text-xs capitalize ${
                      viewMode === mode
                        ? "bg-[#34C759] text-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {mode === "both" ? "Both" : mode === "chart" ? "Graph" : "Table"}
                  </button>
                ))}
              </div>

              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-1 rounded border border-white/15 bg-[#16181d] px-2 py-1 text-white/80 hover:bg-white/10"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </button>
              <button
                onClick={downloadExcel}
                className="inline-flex items-center gap-1 rounded border border-white/15 bg-[#16181d] px-2 py-1 text-white/80 hover:bg-white/10"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Excel
              </button>
            </div>
          </div>

          {panelOpen && (
            <div className="absolute left-3 top-[52px] z-20 w-[300px] rounded border border-white/10 bg-[#1a1d23] shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <p className="text-xs font-medium text-white/80">Select Devices & Variables</p>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="max-h-[420px] overflow-y-auto p-2">
                <div className="space-y-2">
                  {scopedCatalog.map((lease) => {
                    const leaseOpen = expandedLeases.includes(lease.leaseId);
                    return (
                      <div key={lease.leaseId} className="overflow-hidden rounded border border-white/10">
                        <button
                          type="button"
                          onClick={() => toggleLease(lease.leaseId)}
                          className="flex w-full items-center gap-1 bg-[#34C759]/15 px-2 py-1.5 text-left text-xs font-semibold text-[#34C759]"
                        >
                          {leaseOpen ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                          <span className="flex-1">{lease.leaseName}</span>
                          <span className="text-[10px] text-[#34C759]/75">
                            ({lease.devices.length} devices)
                          </span>
                        </button>

                        {leaseOpen && (
                          <div className="space-y-1 bg-[#16181d] p-2">
                            {lease.devices.map((device) => {
                              const deviceKey = `${lease.leaseId}::${device.id}`;
                              const deviceChecked = selectedDeviceIds.includes(deviceKey);
                              const deviceOpen = expandedDevices.includes(deviceKey);

                              return (
                                <div key={device.id} className="rounded border border-white/10 bg-[#1e2025] p-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="checkbox"
                                      checked={deviceChecked}
                                      onChange={() => toggleDevice(lease, device)}
                                      className="h-3.5 w-3.5 rounded border-white/20 accent-[#34C759]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => toggleDeviceExpand(deviceKey)}
                                      className="flex flex-1 items-center gap-1 text-left text-xs text-white/80"
                                    >
                                      {deviceOpen ? (
                                        <ChevronDown className="h-3.5 w-3.5 text-white/50" />
                                      ) : (
                                        <ChevronRight className="h-3.5 w-3.5 text-white/50" />
                                      )}
                                      <span className="truncate">{device.name}</span>
                                    </button>
                                  </div>

                                  {deviceOpen && (
                                    <div className="ml-5 mt-1 space-y-0.5 border-l border-[#34C759]/35 pl-2">
                                      {device.variables.map((variable) => {
                                        const id = `${lease.leaseId}::${device.id}::${variable.key}`;
                                        const checked = selectedIds.includes(id);
                                        return (
                                          <label
                                            key={id}
                                            className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs hover:bg-white/10"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={checked}
                                              onChange={() => toggleVariable(id)}
                                              className="h-3.5 w-3.5 rounded border-white/20 accent-[#34C759]"
                                            />
                                            <span className="flex-1 text-white/80">{variable.label}</span>
                                            <ChevronRight className="h-3 w-3 text-white/45" />
                                          </label>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="min-h-0 flex-1 p-3">
            {selectedSeries.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded border border-white/10 bg-[#1a1d23] text-sm text-white/55">
                No Rows To Show
              </div>
            ) : (
              <div
                className={`grid h-full gap-3 ${
                  viewMode === "both" ? "grid-rows-[280px_minmax(0,1fr)]" : "grid-rows-[minmax(0,1fr)]"
                }`}
              >
                {(viewMode === "chart" || viewMode === "both") && (
                  <div className="overflow-hidden rounded border border-white/10 bg-[#1a1d23] p-2">
                    <AgCharts options={chartOptions} style={{ height: "100%", width: "100%" }} />
                  </div>
                )}

                {(viewMode === "table" || viewMode === "both") && (
                  <div className="min-h-0 overflow-hidden rounded border border-white/10 bg-[#1a1d23] p-1">
                    <div className="h-full">
                      <AgGridReact
                        theme={gridTheme}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={{ sortable: true, filter: true, resizable: true }}
                        pagination
                        paginationPageSize={25}
                        suppressMovableColumns
                        animateRows
                        onGridReady={onGridReady}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
