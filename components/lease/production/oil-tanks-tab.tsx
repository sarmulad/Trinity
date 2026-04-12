"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
import { useTheme } from "next-themes";

import { useTableExport } from "./use-table-export";
import { TableExportBar } from "./table-export-bar";
import { OilTankRecord } from "./types";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

interface OilTankTableProps {
  data: OilTankRecord[];
  isLoading?: boolean;
  height?: number;
}

export function OilTankTable({
  data,
  isLoading = false,
  height = 700,
}: OilTankTableProps) {
  const gridRef = React.useRef<AgGridReact<OilTankRecord>>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { exportCsv, exportOds, exportPng } = useTableExport(gridRef, {
    fileName: "oil-tank-daily-data",
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
        headerTextColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.55)",
        selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
        fontSize: 13,
      }),
    [isDark],
  );

  const tankNames = React.useMemo(() => {
    const names = new Set<string>();
    data.forEach((row) => {
      Object.keys(row.tanks).forEach((tankName) => names.add(tankName));
    });
    return Array.from(names);
  }, [data]);

  const columnDefs = React.useMemo<(ColDef<OilTankRecord> | ColGroupDef<OilTankRecord>)[]>(
    () => [
      ...tankNames.map((tankName) => ({
        headerName: tankName,
        marryChildren: true,
        headerClass: "ag-header-cell-centered",
        children: [
          {
            colId: `${tankName}-daily-gauge`,
            headerName: "Daily Gauge",
            width: 120,
            minWidth: 120,
            valueGetter: (params: { data?: OilTankRecord }) =>
              params.data?.tanks[tankName]?.dailyGauge ?? "—",
            suppressMovable: true,
            cellStyle: { textAlign: "center" },
          },
          {
            colId: `${tankName}-production`,
            headerName: "Production",
            width: 116,
            minWidth: 116,
            valueGetter: (params: { data?: OilTankRecord }) =>
              params.data?.tanks[tankName]?.production ?? "—",
            suppressMovable: true,
            cellStyle: { textAlign: "center" },
          },
          {
            colId: `${tankName}-runs`,
            headerName: "Runs",
            width: 92,
            minWidth: 92,
            valueGetter: (params: { data?: OilTankRecord }) =>
              params.data?.tanks[tankName]?.runs ?? "—",
            suppressMovable: true,
            cellStyle: { textAlign: "center" },
          },
        ],
      })),
      {
        field: "timestamp",
        headerName: "Timestamp",
        width: 180,
        minWidth: 180,
        sortable: true,
        pinned: undefined,
        suppressMovable: false,
        cellStyle: { textAlign: "right" },
      },
    ],
    [tankNames],
  );

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-gray-100 text-sm text-black/20 dark:bg-[#252930] dark:text-white/20"
        style={{ height }}
      >
        Loading…
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-gray-100 text-sm text-black/20 dark:bg-[#252930] dark:text-white/20"
        style={{ height }}
      >
        No oil tank data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <TableExportBar
        title="Oil Tank Daily Data"
        onExportCsv={exportCsv}
        onExportOds={exportOds}
        onExportPng={exportPng}
      />
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
        style={{ height }}
      >
        <AgGridReact
          ref={gridRef}
          theme={gridTheme}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            suppressMovable: true,
            suppressHeaderMenuButton: true,
            headerClass: "ag-header-cell-centered",
          }}
          rowHeight={34}
          headerHeight={34}
          groupHeaderHeight={34}
          animateRows
          suppressColumnMoveAnimation
          pagination
          paginationPageSize={16}
        />
      </div>
    </div>
  );
}
