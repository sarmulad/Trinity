"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AgGridReact as AgGridReactBase } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
import type { ColDef } from "ag-grid-community";
import type { TankDataRow } from "./types";
import {
  AG_GRID_CLIPBOARD_OPTIONS,
  AG_GRID_MULTI_ROW_SELECTION,
} from "@/lib/ag-grid-clipboard";
import { useAgGridSelectionStats } from "@/hooks/use-ag-grid-selection-stats";
import { AgGridSelectionStatsBar } from "@/components/ui/ag-grid-selection-stats-bar";
import { createSourceColumn } from "@/components/ui/source-indicator";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

interface DataTableProps {
  rows: TankDataRow[];
  totalEntries: number;
  lastUpdated?: string;
}

const AgGridReact = AgGridReactBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

export function DataTable({
  rows,
  totalEntries,
  lastUpdated = "15 minutes ago",
}: DataTableProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { stats: selectionStats, onSelectionChanged } =
    useAgGridSelectionStats<TankDataRow>();

  const gridTheme = React.useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: isDark ? "#1a1d23" : "#ffffff",
        headerBackgroundColor: isDark ? "#1a1d23" : "#f7f8fa",
        oddRowBackgroundColor: isDark ? "#1e2025" : "#f8fafc",
        rowHoverColor: isDark ? "#2d3440" : "rgba(0,0,0,0.04)",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        foregroundColor: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.72)",
        headerTextColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        fontSize: 12,
        selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
      }),
    [isDark],
  );

  const columnDefs: ColDef<TankDataRow>[] = React.useMemo(
    () => [
      createSourceColumn<TankDataRow>(),
      {
        field: "level",
        headerName: "Level",
        flex: 1,
        minWidth: 120,
        sort: "asc",
      },
      {
        field: "volume",
        headerName: "Volume",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "dateTime",
        headerName: "Date and Time",
        flex: 2,
        minWidth: 200,
      },
    ],
    [],
  );

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#1a1d23]">
      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm font-semibold text-black dark:text-white">
          Last 150 Data Table
        </p>
        <span className="text-xs text-black/30 dark:text-white/30">
          – {lastUpdated}
        </span>
      </div>

      <div style={{ height: 420 }}>
        <AgGridReact
          theme={gridTheme}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, sortable: true }}
          suppressMovableColumns
          rowHeight={38}
          headerHeight={40}
          rowSelection={AG_GRID_MULTI_ROW_SELECTION}
          pagination
          paginationPageSize={10}
          suppressPaginationPanel={false}
          onSelectionChanged={onSelectionChanged}
          {...AG_GRID_CLIPBOARD_OPTIONS}
        />
      </div>

      <AgGridSelectionStatsBar stats={selectionStats} />

      <p className="text-xs text-black/30 mt-2 text-right dark:text-white/30">
        {totalEntries} daily entries
      </p>
    </div>
  );
}
