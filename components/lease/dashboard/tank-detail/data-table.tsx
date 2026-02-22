"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import type { ColDef } from "ag-grid-community";
import type { TankDataRow } from "./types";

ModuleRegistry.registerModules([AllCommunityModule]);

const darkTheme = themeQuartz.withParams({
  backgroundColor: "#1a1d23",
  headerBackgroundColor: "#1a1d23",
  oddRowBackgroundColor: "#1e2025",
  rowHoverColor: "#2d3440",
  borderColor: "rgba(255,255,255,0.08)",
  foregroundColor: "rgba(255,255,255,0.6)",
  headerTextColor: "rgba(255,255,255,0.5)",
  fontSize: 12,
  //   rowBorderColor: "rgba(255,255,255,0.05)",
  selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
});

interface DataTableProps {
  rows: TankDataRow[];
  totalEntries: number;
  lastUpdated?: string;
}

export function DataTable({
  rows,
  totalEntries,
  lastUpdated = "15 minutes ago",
}: DataTableProps) {
  const columnDefs: ColDef<TankDataRow>[] = React.useMemo(
    () => [
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
    <div className="rounded-xl border border-white/10 bg-[#1a1d23] p-5">
      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm font-semibold text-white">Last 150 Data Table</p>
        <span className="text-xs text-white/30">– {lastUpdated}</span>
      </div>

      <div style={{ height: 280 }}>
        <AgGridReact
          theme={darkTheme}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, sortable: true }}
          suppressMovableColumns
          rowHeight={38}
          headerHeight={40}
          pagination
          paginationPageSize={7}
          suppressPaginationPanel={false}
        />
      </div>

      <p className="text-xs text-white/30 mt-2 text-right">
        {totalEntries} daily entries
      </p>
    </div>
  );
}
