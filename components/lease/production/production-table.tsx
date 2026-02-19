"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ProductionRecord } from "./types";

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS: ColDef<ProductionRecord>[] = [
  {
    field: "date",
    headerName: "Date",
    sortable: true,
    flex: 1,
  },
  {
    field: "h2o",
    headerName: "H20 BBLs",
    sortable: true,
    flex: 1,
    headerClass: "!text-[#34C759]",
  },
  {
    field: "oil",
    headerName: "Oil BBLs",
    sortable: true,
    flex: 1,
  },
  {
    field: "gas",
    headerName: "Gas MCF",
    sortable: true,
    flex: 1,
  },
];

// ─── AG Grid dark theme tokens ────────────────────────────────────────────────

const AG_STYLES: React.CSSProperties = {
  height: 300,
  "--ag-background-color": "#252930",
  "--ag-header-background-color": "#1e2025",
  "--ag-row-hover-color": "#2d3440",
  "--ag-border-color": "rgba(255,255,255,0.08)",
  "--ag-foreground-color": "rgba(255,255,255,0.8)",
  "--ag-header-foreground-color": "rgba(255,255,255,0.45)",
  "--ag-font-size": "12px",
  "--ag-row-border-color": "rgba(255,255,255,0.05)",
  "--ag-selected-row-background-color": "rgba(52,199,89,0.08)",
} as React.CSSProperties;

// ─── Component ────────────────────────────────────────────────────────────────

interface ProductionTableProps {
  data: ProductionRecord[];
  isLoading?: boolean;
}

export function ProductionTable({
  data,
  isLoading = false,
}: ProductionTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-[#252930] text-sm text-white/20">
        Loading…
      </div>
    );
  }

  return (
    <div
      className="ag-theme-alpine-dark w-full overflow-hidden rounded-lg"
      style={AG_STYLES}
    >
      <AgGridReact
        rowData={data}
        columnDefs={COLUMNS}
        suppressMovableColumns
        rowHeight={38}
      />
    </div>
  );
}
