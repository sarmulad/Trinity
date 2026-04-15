"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GetRowIdParams } from "ag-grid-community";

import { AG_GRID_CLIPBOARD_OPTIONS } from "@/lib/ag-grid-clipboard";

import { useSettingsAgGridTheme } from "./settings-ag-grid-theme";

type SettingsDataGridProps<T> = {
  rowData: T[];
  columnDefs: ColDef<T>[];
  height?: number;
  getRowId?: (params: GetRowIdParams<T, string>) => string;
};

export function SettingsDataGrid<T>({
  rowData,
  columnDefs,
  height = 360,
  getRowId,
}: SettingsDataGridProps<T>) {
  const theme = useSettingsAgGridTheme();

  return (
    <div className="overflow-hidden rounded-md border border-black/10 dark:border-white/10">
      <div style={{ height }}>
        <AgGridReact<T>
          theme={theme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, sortable: true }}
          suppressMovableColumns
          rowHeight={44}
          headerHeight={44}
          pagination
          paginationPageSize={10}
          getRowId={getRowId}
          {...AG_GRID_CLIPBOARD_OPTIONS}
        />
      </div>
    </div>
  );
}
