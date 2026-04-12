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
import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

import { useTableExport } from "./use-table-export";
import { TableExportBar } from "./table-export-bar";
import { GasMeterRecord } from "./types";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

interface GasMeterTableProps {
  data: GasMeterRecord[];
  isLoading?: boolean;
  height?: number;
}

export function GasMeterTable({
  data,
  isLoading = false,
  height = 700,
}: GasMeterTableProps) {
  const gridRef = React.useRef<AgGridReact<GasMeterRecord>>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { exportCsv, exportOds, exportPng } = useTableExport(gridRef, {
    fileName: "gas-meter-daily-data",
    containerRef,
  });

  const meterNames = React.useMemo(
    () => Array.from(new Set(data.map((row) => row.meterName))),
    [data],
  );
  const [selectedMeter, setSelectedMeter] = React.useState("");

  React.useEffect(() => {
    if (!meterNames.length) {
      setSelectedMeter("");
      return;
    }

    setSelectedMeter((current) =>
      meterNames.includes(current) ? current : meterNames[0],
    );
  }, [meterNames]);

  const visibleRows = React.useMemo(
    () => data.filter((row) => row.meterName === selectedMeter),
    [data, selectedMeter],
  );

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
        headerName: "DP",
        sortable: true,
        flex: 1,
        minWidth: 130,
      },
      {
        field: "sp",
        headerName: "SP",
        sortable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        field: "temp",
        headerName: "Temp",
        sortable: true,
        flex: 1,
        minWidth: 110,
      },
      {
        field: "volume",
        headerName: "Volume",
        sortable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        field: "energy",
        headerName: "Energy",
        sortable: true,
        flex: 1,
        minWidth: 130,
      },
      {
        field: "flowPct",
        headerName: "Flow %",
        sortable: true,
        flex: 1,
        minWidth: 110,
      },
      {
        field: "backFlowPct",
        headerName: "Back Flow %",
        sortable: true,
        flex: 1,
        minWidth: 140,
      },
      {
        field: "maxDp",
        headerName: "Max DP",
        sortable: true,
        flex: 1,
        minWidth: 130,
      },
      {
        field: "dateAndTime",
        headerName: "Timestamp",
        sortable: true,
        flex: 1.4,
        minWidth: 185,
      },
    ],
    [],
  );

  const meterSwitcher = (
    <div className="relative">
      <select
        value={selectedMeter}
        onChange={(event) => setSelectedMeter(event.target.value)}
        className="appearance-none rounded-lg border border-black/10 bg-white py-2 pl-3 pr-9 text-sm text-black shadow-sm outline-none transition-colors hover:border-black/20 focus:border-[#34C759]/60 dark:border-white/10 dark:bg-[#252930] dark:text-white"
      >
        {meterNames.map((meterName) => (
          <option key={meterName} value={meterName}>
            {meterName}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
    </div>
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
        No gas meter data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <TableExportBar
        title="Gas Meter Daily Data"
        controls={meterSwitcher}
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
          rowData={visibleRows}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            suppressHeaderMenuButton: true,
          }}
          rowHeight={36}
          headerHeight={38}
          animateRows
          pagination
          paginationPageSize={16}
        />
      </div>
    </div>
  );
}
