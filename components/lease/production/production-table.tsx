"use client";
import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
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

const darkTheme = themeQuartz.withParams({
  backgroundColor: "#252930",
  headerBackgroundColor: "#1e2025",
  oddRowBackgroundColor: "#252930",
  rowHoverColor: "#2d3440",
  borderColor: "rgba(255,255,255,0.08)",
  foregroundColor: "rgba(255,255,255,0.8)",
  headerTextColor: "rgba(255,255,255,0.45)",
  fontSize: 13,
  // rowBorderColor: "rgba(255,255,255,0.05)",
  selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
});

interface ProductionTableProps {
  data: ProductionRecord[];
  isLoading?: boolean;
}

export function ProductionTable({
  data,
  isLoading = false,
}: ProductionTableProps) {
  const gridRef = React.useRef<AgGridReact>(null);
  const { stats: selectionStats, onSelectionChanged } =
    useAgGridSelectionStats<ProductionRecord>();

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
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-[#252930] text-sm text-white/20">
        Loading…
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-[#252930] text-sm text-white/20">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div style={{ height: "300px", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          theme={darkTheme}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
          }}
          suppressMovableColumns={true}
          rowHeight={40}
          headerHeight={45}
          animateRows={true}
          rowSelection={AG_GRID_MULTI_ROW_SELECTION}
          onSelectionChanged={onSelectionChanged}
          {...AG_GRID_CLIPBOARD_OPTIONS}
        />
      </div>
      <AgGridSelectionStatsBar stats={selectionStats} />
    </div>
  );
}
