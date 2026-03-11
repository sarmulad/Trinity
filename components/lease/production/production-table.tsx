"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
<<<<<<< HEAD
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
=======
import { useTheme } from "next-themes";
>>>>>>> c24871c (WIP: local changes)
import { ProductionRecord } from "./types";
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

interface ProductionTableProps {
  data: ProductionRecord[];
  isLoading?: boolean;
}

export function ProductionTable({
  data,
  isLoading = false,
}: ProductionTableProps) {
  const gridRef = React.useRef<AgGridReact>(null);
<<<<<<< HEAD
  const { stats: selectionStats, onSelectionChanged } =
    useAgGridSelectionStats<ProductionRecord>();
=======
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const gridTheme = React.useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: isDark ? "#252930" : "#ffffff",
        headerBackgroundColor: isDark ? "#1e2025" : "#f4f6f8",
        oddRowBackgroundColor: isDark ? "#252930" : "#f9fafb",
        rowHoverColor: isDark ? "#2d3440" : "rgba(0,0,0,0.04)",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        foregroundColor: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
        headerTextColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
        selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
        fontSize: 13,
      }),
    [isDark],
  );
>>>>>>> c24871c (WIP: local changes)

  const columnDefs: ColDef<ProductionRecord>[] = React.useMemo(
    () => [
      {
        field: "date",
        headerName: "Date",
        sortable: true,
        flex: 1,
        minWidth: 100,
      },
      {
        field: "h2o",
        headerName: "H20 BBLs",
        sortable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        field: "oil",
        headerName: "Oil BBLs",
        sortable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        field: "gas",
        headerName: "Gas MCF",
        sortable: true,
        flex: 1,
        minWidth: 120,
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-100 text-sm text-black/20 dark:bg-[#252930] dark:text-white/20">
        Loading…
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-100 text-sm text-black/20 dark:bg-[#252930] dark:text-white/20">
        No data available
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
      style={{ height: 300 }}
    >
      <AgGridReact
        ref={gridRef}
        theme={gridTheme}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: true, sortable: true }}
        suppressMovableColumns
        rowHeight={40}
        headerHeight={45}
        animateRows
      />
    </div>
  );
}
