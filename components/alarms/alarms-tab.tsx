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
  MoreVertical,
  PlusCircle,
  Search,
  SlidersHorizontal,
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

function ActionCell() {
  return (
    <button className="flex h-7 w-7 items-center justify-center rounded-md text-black/40 hover:bg-black/10 hover:text-black dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white transition-colors">
      <MoreVertical className="h-4 w-4" />
    </button>
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
  const [recipients, setRecipients] = React.useState("Operations Team");
  const [alarmState, setAlarmState] = React.useState<"Enabled" | "Disabled">(
    "Enabled",
  );
  const [acknowledged, setAcknowledged] = React.useState(false);

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
    setRecipients(alarm.recipients ?? "Operations Team");
    setAlarmState("Enabled");
    setAcknowledged(alarm.acked);
  }, []);

  const columnDefs: ColDef<AlarmRow>[] = React.useMemo(
    () => [
      { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
      { field: "asset", headerName: "Asset", flex: 1.5, minWidth: 130 },
      {
        field: "lease",
        headerName: "Lease",
        flex: 1.5,
        minWidth: 130,
        sort: "asc",
      },
      { field: "alarmType", headerName: "Alarm Type", flex: 1.2, minWidth: 130 },
      {
        field: "sensorRange",
        headerName: "Sensor Range",
        flex: 1.2,
        minWidth: 120,
      },
      { field: "threshold", headerName: "Threshold", flex: 1, minWidth: 110 },
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
      {
        field: "id",
        headerName: "Action",
        flex: 0.7,
        minWidth: 70,
        cellRenderer: ActionCell,
        sortable: false,
        cellStyle: { display: "flex", alignItems: "center" },
      },
    ],
    [],
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30 dark:text-white/30" />
              <input
                type="text"
                placeholder="Search Alarms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-black/5 py-2 pl-9 pr-3 text-sm text-black placeholder:text-black/30 focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-[#1e2127] dark:text-white dark:placeholder:text-white/30"
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
        <AgGridSelectionStatsBar stats={selectionStats} />
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
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto bg-[#16181d] shadow-2xl">
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Manage Alarm</h3>
                  <p className="text-xs text-white/45 mt-1">
                    {selectedAlarm.asset} • {selectedAlarm.lease}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAlarm(null)}
                  className="rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-white/45">Sensor Range</p>
                <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white">
                  {selectedAlarm.sensorRange}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-white/45">Alarm Type</p>
                <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white">
                  {selectedAlarm.alarmType ?? "Threshold Alarm"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-white/45">Threshold</p>
                <input
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#34C759]/50 focus:outline-none"
                  placeholder="e.g. 22 PSI"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs text-white/45">Recipients / Group</p>
                <input
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#34C759]/50 focus:outline-none"
                  placeholder="Operations Team, Field Leads"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-white/45">Alarm State</p>
                  <select
                    value={alarmState}
                    onChange={(e) =>
                      setAlarmState(e.target.value as "Enabled" | "Disabled")
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-[#34C759]/50 focus:outline-none"
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/45">Acknowledgement</p>
                  <button
                    onClick={() => setAcknowledged((v) => !v)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      acknowledged
                        ? "border-[#34C759]/50 bg-[#34C759]/20 text-[#7DFF9F]"
                        : "border-white/10 bg-white/[0.03] text-white/70"
                    }`}
                  >
                    {acknowledged ? "Acknowledged" : "Not Acknowledged"}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs text-white/45">Latest Reading</p>
                <p className="text-sm font-semibold text-white mt-1">
                  {selectedAlarm.lastValue} ({selectedAlarm.date})
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs text-white/45 mb-2">Alarm History</p>
                <div className="space-y-2">
                  {(selectedAlarm.history ?? []).length === 0 ? (
                    <p className="text-xs text-white/55">
                      No status changes recorded yet.
                    </p>
                  ) : (
                    selectedAlarm.history?.map((h, idx) => (
                      <div
                        key={`${h.timestamp}-${idx}`}
                        className="rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-2"
                      >
                        <p className="text-[11px] text-white/45">{h.timestamp}</p>
                        <p className="text-xs text-white/85">
                          {h.previousStatus} → {h.nextStatus}
                        </p>
                        {h.note && (
                          <p className="mt-0.5 text-[11px] text-white/55">
                            {h.note}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedAlarm(null)}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/75 hover:bg-white/10"
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
