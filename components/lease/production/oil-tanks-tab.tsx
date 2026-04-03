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

export interface OilTankRecord {
  dateAndTime: string; // e.g. "03/18/2026 01:00:00 am"
  tankId: string; // e.g. "Tank 1"
  levelIn: string; // e.g. "72.45 In"
  volumeBbl: string; // e.g. "150.30 BBL"
  temperatureF: string; // e.g. "65.00 °F"
  netVolumeBbl: string; // e.g. "148.90 BBL"
  grossVolumeBbl: string; // e.g. "150.30 BBL"
  apiGravity: string; // e.g. "38.5 °API"
  bsAndW: string; // e.g. "0.50 %"
}

interface OilTankTableProps {
  data: OilTankRecord[];
  isLoading?: boolean;
}

export function OilTankTable({ data, isLoading = false }: OilTankTableProps) {
  const gridRef = React.useRef<AgGridReact<OilTankRecord>>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { exportCsv, exportOds, exportPng } = useTableExport(gridRef, {
    fileName: "oil-tank-data",
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

  const columnDefs: ColDef<OilTankRecord>[] = React.useMemo(
    () => [
      {
        field: "tankId",
        headerName: "Tank ID ↕",
        sortable: true,
        flex: 1,
        minWidth: 110,
      },
      {
        field: "levelIn",
        headerName: "Level (In) ↕",
        sortable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        field: "volumeBbl",
        headerName: "Volume (BBL) ↕",
        sortable: true,
        flex: 1,
        minWidth: 140,
      },
      {
        field: "temperatureF",
        headerName: "Temp (°F) ↕",
        sortable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        field: "netVolumeBbl",
        headerName: "Net Vol (BBL) ↕",
        sortable: true,
        flex: 1,
        minWidth: 145,
      },
      {
        field: "grossVolumeBbl",
        headerName: "Gross Vol (BBL) ↕",
        sortable: true,
        flex: 1,
        minWidth: 155,
      },
      {
        field: "apiGravity",
        headerName: "API Gravity ↕",
        sortable: true,
        flex: 1,
        minWidth: 130,
      },
      {
        field: "bsAndW",
        headerName: "BS&W % ↕",
        sortable: true,
        flex: 1,
        minWidth: 110,
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
        No oil tank data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <TableExportBar
        title="Oil Tank Data"
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
