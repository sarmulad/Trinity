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
  MoreVertical,
  PlusCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";
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
  //   rowBorderColor: "rgba(255,255,255,0.05)",
  selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
});

function StatusCell({ value }: ICellRendererParams) {
  const isActive = value === "Active";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-red-500/15 text-red-400 border border-red-500/30"
          : "bg-white/8 text-white/50 border border-white/10"
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
    <span className="text-white/20">—</span>
  );
}

function ActionCell() {
  return (
    <button className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-white transition-colors">
      <MoreVertical className="h-4 w-4" />
    </button>
  );
}

interface AlarmsTabProps {
  alarms?: AlarmRow[];
  isLoading?: boolean;
  /** Pass title="Alarm" for lease view, omit for standalone page */
  title?: string;
}

export function AlarmsTab({
  alarms = EXAMPLE_ALARMS,
  isLoading = false,
  title,
}: AlarmsTabProps) {
  const { stats: selectionStats, onSelectionChanged } =
    useAgGridSelectionStats<AlarmRow>();
  const [search, setSearch] = React.useState("");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [filters, setFilters] = React.useState<AlarmFilters>({
    lease: "",
    status: "",
    byType: "",
  });

  const filteredAlarms = React.useMemo(() => {
    return alarms.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        a.asset.toLowerCase().includes(q) ||
        a.lease.toLowerCase().includes(q) ||
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
      {
        field: "sensorRange",
        headerName: "Sensor Range",
        flex: 1.2,
        minWidth: 120,
      },
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
        {title && <h2 className="text-base font-bold text-white">{title}</h2>}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Search Alarms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#1e2127] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-[#34C759]/50 focus:outline-none"
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

        <div className="rounded-xl border border-white/10 bg-[#1a1d23] overflow-hidden">
          <div style={{ height: 560 }}>
            <AgGridReact
              theme={darkTheme}
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
    </>
  );
}
