"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
import {
  Check,
  X,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Minus,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";
import { EXAMPLE_ALARMS } from "./example-data";
import { AddSetpointModal } from "./add-setpoint-modal";
import { FilterModal, type AlarmFilters } from "./filter-modal";
import type { AlarmRow } from "./types";
import {
  AG_GRID_CLIPBOARD_OPTIONS,
  AG_GRID_MULTI_ROW_SELECTION,
} from "@/lib/ag-grid-clipboard";
import { useAgGridSelectionStats } from "@/hooks/use-ag-grid-selection-stats";
import { AgGridSelectionStatsBar } from "@/components/ui/ag-grid-selection-stats-bar";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

const darkTheme = themeQuartz.withParams({
  backgroundColor: "#1a1d23",
  headerBackgroundColor: "#1e2127",
  oddRowBackgroundColor: "#1e2127",
  rowHoverColor: "#2d3440",
  borderColor: "rgba(255,255,255,0.07)",
  foregroundColor: "rgba(255,255,255,0.75)",
  headerTextColor: "rgba(255,255,255,0.45)",
  fontSize: 13,
  selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
});

const lightTheme = themeQuartz.withParams({
  backgroundColor: "#ffffff",
  headerBackgroundColor: "#f4f6f8",
  oddRowBackgroundColor: "#f9fafb",
  rowHoverColor: "#f0f2f4",
  borderColor: "rgba(0,0,0,0.07)",
  foregroundColor: "rgba(0,0,0,0.75)",
  headerTextColor: "rgba(0,0,0,0.45)",
  fontSize: 13,
  selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
});

function StatusCell({ value }: ICellRendererParams) {
  const isActive = value === "Active";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-red-500/15 text-red-400 border border-red-500/30"
          : "bg-black/5 text-black/50 border border-black/10 dark:bg-white/8 dark:text-white/50 dark:border-white/10"
      }`}
    >
      {value}
    </span>
  );
}

function AckCell({ value }: ICellRendererParams) {
  return value ? (
    <Check className="h-4 w-4 text-[#34C759]" />
  ) : (
    <span className="text-black/20 dark:text-white/20">—</span>
  );
}

interface AlarmsTabProps {
  alarms?: AlarmRow[];
  isLoading?: boolean;
  title?: string;
}

export function AlarmsTab({
  alarms = EXAMPLE_ALARMS,
  isLoading = false,
  title,
}: AlarmsTabProps) {
  const { stats: selectionStats, onSelectionChanged } =
    useAgGridSelectionStats<AlarmRow>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [search, setSearch] = React.useState("");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [filters, setFilters] = React.useState<AlarmFilters>({
    lease: "",
    status: "",
    byType: "",
  });
  const [selectedAlarm, setSelectedAlarm] = React.useState<AlarmRow | null>(
    null,
  );
  const [threshold, setThreshold] = React.useState("");
  const [alarmType, setAlarmType] = React.useState("Threshold Alarm");
  const [recipients, setRecipients] = React.useState("Operations Team");
  const [alarmState, setAlarmState] = React.useState<"Enabled" | "Disabled">(
    "Enabled",
  );
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [historySearch, setHistorySearch] = React.useState("");

  const recipientOptions = [
    "Operations Team",
    "Field Leads",
    "Production Engineers",
    "Lease Supervisors",
  ];

  const alarmTypeOptions = [
    "Threshold Alarm",
    "High Level Alarm",
    "Low Level Alarm",
    "Pressure Alarm",
    "Communication Alarm",
  ];

  const filteredAlarms = React.useMemo(() => {
    return alarms.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        a.asset.toLowerCase().includes(q) ||
        a.lease.toLowerCase().includes(q) ||
        (a.alarmType ?? "").toLowerCase().includes(q) ||
        (a.threshold ?? "").toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q) ||
        a.date.includes(q);

      const matchesLease = !filters.lease || a.lease === filters.lease;
      const matchesStatus = !filters.status || a.status === filters.status;
      const matchesType =
        !filters.byType ||
        a.asset.toLowerCase().includes(filters.byType.toLowerCase());

      return matchesSearch && matchesLease && matchesStatus && matchesType;
    });
  }, [alarms, search, filters]);

  const openAlarmConfig = React.useCallback((alarm: AlarmRow) => {
    setSelectedAlarm(alarm);
    const parsed =
      alarm.threshold ??
      alarm.sensorRange.split("-")[1]?.trim() ??
      alarm.lastValue;
    setThreshold(parsed);
    setAlarmType(alarm.alarmType ?? "Threshold Alarm");
    setRecipients(alarm.recipients ?? "Operations Team");
    setAlarmState("Enabled");
    setAcknowledged(alarm.acked);
    setHistorySearch("");
  }, []);

  const columnDefs: ColDef<AlarmRow>[] = React.useMemo(
    () => [
      { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
      { field: "asset", headerName: "Asset", flex: 1.5, minWidth: 130 },
      { field: "alarmType", headerName: "Alarm Type", flex: 1.2, minWidth: 130 },
      {
        field: "sensorRange",
        headerName: "Measurement Range",
        flex: 1.25,
        minWidth: 160,
      },
      { field: "threshold", headerName: "Alarm Limit", flex: 1, minWidth: 120 },
      { field: "lastValue", headerName: "Last Value", flex: 1, minWidth: 100 },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 100,
        cellRenderer: StatusCell,
      },
      {
        field: "acked",
        headerName: "ACK",
        flex: 0.7,
        minWidth: 70,
        cellRenderer: AckCell,
        cellStyle: { display: "flex", alignItems: "center" },
      },
    ],
    [],
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const thresholdNumber = Number.parseFloat(threshold);
  const canAdjustThreshold = Number.isFinite(thresholdNumber);

  const adjustThreshold = React.useCallback((delta: number) => {
    setThreshold((current) => {
      const parsed = Number.parseFloat(current);
      if (!Number.isFinite(parsed)) return current;

      const nextValue = Math.max(0, Math.round((parsed + delta) * 100) / 100);
      return nextValue.toString();
    });
  }, []);

  const filteredHistory = React.useMemo(() => {
    const history = selectedAlarm?.history ?? [];
    const query = historySearch.trim().toLowerCase();

    if (!query) return history;

    return history.filter((entry) => {
      return (
        entry.timestamp.toLowerCase().includes(query) ||
        entry.previousStatus.toLowerCase().includes(query) ||
        entry.nextStatus.toLowerCase().includes(query) ||
        (entry.note ?? "").toLowerCase().includes(query)
      );
    });
  }, [selectedAlarm, historySearch]);

  return (
    <>
      <div className="space-y-4">
        {title && (
          <h2 className="text-base font-bold text-black dark:text-white">
            {title}
          </h2>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="app-search-icon" />
              <input
                type="text"
                placeholder="Search Alarms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="app-search-input w-full"
              />
            </div>

            <button
              onClick={() => setShowFilterModal(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#34C759] text-black hover:bg-[#28a745] transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black hover:bg-[#28a745] transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Alarm
          </button>
        </div>

        <div className="rounded-xl border border-black/10 bg-white overflow-hidden dark:border-white/10 dark:bg-[#1a1d23]">
          <div style={{ height: 560 }}>
            <AgGridReact
              theme={isDark ? darkTheme : lightTheme}
              rowData={filteredAlarms}
              columnDefs={columnDefs}
              defaultColDef={{ resizable: true, sortable: true }}
              suppressMovableColumns
              rowHeight={44}
              headerHeight={44}
              rowSelection={AG_GRID_MULTI_ROW_SELECTION}
              pagination
              paginationPageSize={14}
              loading={isLoading}
              onSelectionChanged={onSelectionChanged}
              onRowClicked={(event) => {
                if (event.data) openAlarmConfig(event.data);
              }}
              getRowStyle={() => ({ cursor: "pointer" })}
              {...AG_GRID_CLIPBOARD_OPTIONS}
            />
          </div>
        </div>
        <AgGridSelectionStatsBar
          stats={selectionStats}
          showAggregates={false}
          className="mt-2 flex flex-wrap items-center justify-end gap-3 text-xs text-black/55 dark:text-white/60"
        />
      </div>

      <AddSetpointModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(data) => console.log("New setpoint:", data)}
      />
      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={(f) => setFilters(f)}
      />

      {selectedAlarm && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSelectedAlarm(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-5xl overflow-y-auto border-l border-black/10 bg-[#f8fafc] shadow-2xl dark:border-white/10 dark:bg-[#16181d]">
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    Manage Alarm
                  </h3>
                  <p className="mt-1 text-xs text-black/50 dark:text-white/45">
                    {selectedAlarm.asset} • {selectedAlarm.lease}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAlarm(null)}
                  className="rounded-md p-1 text-black/55 hover:bg-black/8 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <p className="text-xs text-black/50 dark:text-white/45">
                      Measurement Range
                    </p>
                    <p className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black dark:border-white/10 dark:bg-white/[0.03] dark:text-white">
                      {selectedAlarm.sensorRange}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-black/50 dark:text-white/45">
                      Alarm Type
                    </p>
                    <select
                      value={alarmType}
                      onChange={(e) => setAlarmType(e.target.value)}
                      className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                    >
                      {alarmTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-black/50 dark:text-white/45">
                      Alarm Limit
                    </p>
                    <div className="flex items-center rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.03]">
                      <button
                        type="button"
                        onClick={() => adjustThreshold(-1)}
                        disabled={!canAdjustThreshold}
                        className="flex h-10 w-10 items-center justify-center rounded-l-lg text-black/70 transition-colors hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:text-black/25 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:disabled:text-white/25"
                        aria-label="Decrease alarm limit"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="1"
                        min="0"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        className="h-10 w-full border-x border-black/10 bg-transparent px-3 text-center text-sm text-black placeholder:text-black/35 focus:outline-none dark:border-white/10 dark:text-white dark:placeholder:text-white/30"
                        placeholder="22"
                      />
                      <button
                        type="button"
                        onClick={() => adjustThreshold(1)}
                        disabled={!canAdjustThreshold}
                        className="flex h-10 w-10 items-center justify-center rounded-r-lg text-black/70 transition-colors hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:text-black/25 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:disabled:text-white/25"
                        aria-label="Increase alarm limit"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-black/50 dark:text-white/45">
                      Recipients / Group
                    </p>
                    <select
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                      className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                    >
                      {recipientOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-xs text-black/50 dark:text-white/45">
                        Alarm State
                      </p>
                      <select
                        value={alarmState}
                        onChange={(e) =>
                          setAlarmState(e.target.value as "Enabled" | "Disabled")
                        }
                        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                      >
                        <option value="Enabled">Enabled</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-black/50 dark:text-white/45">
                        Acknowledgement
                      </p>
                      <button
                        onClick={() => setAcknowledged((v) => !v)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                          acknowledged
                            ? "border-[#34C759]/50 bg-[#34C759]/20 text-[#15803d] dark:text-[#7DFF9F]"
                            : "border-black/10 bg-white text-black/70 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70"
                        }`}
                      >
                        {acknowledged ? "Acknowledged" : "Not Acknowledged"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-xs text-black/50 dark:text-white/45">
                      Latest Reading
                    </p>
                    <p className="mt-1 text-sm font-semibold text-black dark:text-white">
                      {selectedAlarm.lastValue} ({selectedAlarm.date})
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        Alarm History
                      </p>
                      <p className="mt-1 text-xs text-black/50 dark:text-white/45">
                        Search past state changes and notes for this alarm.
                      </p>
                    </div>
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="app-search-icon" />
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Search history"
                        className="app-search-input w-full"
                      />
                    </div>
                  </div>

                  {(selectedAlarm.history ?? []).length === 0 ? (
                    <div className="rounded-lg border border-dashed border-black/10 px-4 py-8 text-center text-sm text-black/55 dark:border-white/10 dark:text-white/55">
                      No status changes recorded yet.
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
                      <div className="max-h-[420px] overflow-auto">
                        <table className="min-w-full border-collapse">
                          <thead className="sticky top-0 bg-[#f4f6f8] dark:bg-[#20242b]">
                            <tr className="text-left">
                              <th className="px-3 py-2 text-xs font-medium text-black/55 dark:text-white/50">
                                Timestamp
                              </th>
                              <th className="px-3 py-2 text-xs font-medium text-black/55 dark:text-white/50">
                                Previous
                              </th>
                              <th className="px-3 py-2 text-xs font-medium text-black/55 dark:text-white/50">
                                Next
                              </th>
                              <th className="px-3 py-2 text-xs font-medium text-black/55 dark:text-white/50">
                                Note
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredHistory.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="px-3 py-8 text-center text-sm text-black/55 dark:text-white/55"
                                >
                                  No history entries match your search.
                                </td>
                              </tr>
                            ) : (
                              filteredHistory.map((h, idx) => (
                                <tr
                                  key={`${h.timestamp}-${idx}`}
                                  className="border-t border-black/10 bg-white align-top dark:border-white/10 dark:bg-transparent"
                                >
                                  <td className="px-3 py-2 text-xs text-black/80 dark:text-white/80">
                                    {h.timestamp}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-black/70 dark:text-white/70">
                                    {h.previousStatus}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-black/70 dark:text-white/70">
                                    {h.nextStatus}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-black/60 dark:text-white/60">
                                    {h.note ?? "—"}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-black/10 pt-2 dark:border-white/10">
                <button
                  onClick={() => setSelectedAlarm(null)}
                  className="rounded-lg border border-black/15 px-4 py-2 text-sm text-black/75 hover:bg-black/5 dark:border-white/15 dark:text-white/75 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setSelectedAlarm(null)}
                  className="rounded-lg bg-[#34C759] px-4 py-2 text-sm font-semibold text-black hover:bg-[#28a745]"
                >
                  Save Alarm Config
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
