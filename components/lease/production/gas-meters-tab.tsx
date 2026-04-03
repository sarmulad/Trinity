"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
import { useTheme } from "next-themes";
import { useTableExport } from "./use-table-export";
import { TableExportBar } from "./table-export-bar";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

export interface GasMeterRecord {
  dateAndTime: string; // e.g. "03/18/2026 01:00:00 am"
  dp: string; // e.g. "7.45 In. H2O"
  sp: string; // e.g. "16.95 PSIA"
  temp: string; // e.g. "60.00 °F"
  volume: string; // e.g. "22.74 MCF"
  energy: string; // e.g. "34.26 MMBTU"
  flowPct: string; // e.g. "100.00 %"
  backFlowPct: string; // e.g. "0.000 %"
  maxDp: string; // e.g. "91.59 In. H2O"
}

interface GasMeterTableProps {
  data: GasMeterRecord[];
  isLoading?: boolean;
}

export function GasMeterTable({ data, isLoading = false }: GasMeterTableProps) {
  const gridRef = React.useRef<AgGridReact<GasMeterRecord>>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { exportCsv, exportOds, exportPng } = useTableExport(gridRef, {
    fileName: "gas-meter-data",
    containerRef,
  });

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

  const columnDefs: ColDef<GasMeterRecord>[] = React.useMemo(
    () => [
      {
        field: "dp",
        headerName: "DP ↕",
        sortable: true,
        flex: 1,
        minWidth: 130,
      },
      {
        field: "sp",
        headerName: "SP ↕",
        sortable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        field: "temp",
        headerName: "Temp ↕",
        sortable: true,
        flex: 1,
        minWidth: 110,
      },
      {
        field: "volume",
        headerName: "Volume ↕",
        sortable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        field: "energy",
        headerName: "Energy ↕",
        sortable: true,
        flex: 1,
        minWidth: 130,
      },
      {
        field: "flowPct",
        headerName: "Flow % ↕",
        sortable: true,
        flex: 1,
        minWidth: 110,
      },
      {
        field: "backFlowPct",
        headerName: "Back Flow % ↕",
        sortable: true,
        flex: 1,
        minWidth: 140,
      },
      {
        field: "maxDp",
        headerName: "Max DP ↕",
        sortable: true,
        flex: 1,
        minWidth: 130,
      },
      {
        field: "dateAndTime",
        headerName: "Date and Time ↕",
        sortable: true,
        flex: 1.5,
        minWidth: 180,
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
        No gas meter data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <TableExportBar
        title="Gas Meter Data"
        onExportCsv={exportCsv}
        onExportOds={exportOds}
        onExportPng={exportPng}
      />
      <div
        ref={containerRef}
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
          pagination
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}
