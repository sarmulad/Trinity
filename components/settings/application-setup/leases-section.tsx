"use client";

import * as React from "react";
import { Search } from "lucide-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

import { SettingsDataGrid } from "../settings-data-grid";
import { GridEditDeleteActions, SettingsCountBadge } from "../settings-grid-cells";
import { MOCK_LEASES, type LeaseRow } from "./mock-data";

export function LeasesSection() {
  const [search, setSearch] = React.useState("");
  const [rows] = React.useState(MOCK_LEASES);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.route.toLowerCase().includes(q) ||
        r.leaseNumber.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const columnDefs = React.useMemo<ColDef<LeaseRow>[]>(
    () => [
      {
        field: "name",
        headerName: "Lease",
        flex: 1.2,
        minWidth: 140,
        cellClass: "font-medium",
      },
      { field: "route", headerName: "Route", flex: 1.2, minWidth: 150 },
      {
        field: "leaseNumber",
        headerName: "Lease #",
        flex: 0.8,
        minWidth: 100,
        cellClass: "text-black/60 dark:text-white/60",
      },
      {
        field: "batteriesCount",
        headerName: "Batteries",
        flex: 0.7,
        minWidth: 100,
        cellRenderer: (p: ICellRendererParams<LeaseRow>) =>
          p.data ? (
            <SettingsCountBadge value={p.data.batteriesCount} tone="info" />
          ) : null,
      },
      {
        headerName: "",
        sortable: false,
        flex: 0,
        minWidth: 150,
        maxWidth: 160,
        cellRenderer: () => <GridEditDeleteActions />,
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="relative w-64">
        <Search className="app-search-icon" aria-hidden />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leases..."
          className="app-search-input w-full"
        />
      </div>

      <SettingsDataGrid<LeaseRow>
        rowData={filtered}
        columnDefs={columnDefs}
        height={360}
        getRowId={(p) => p.data.id}
      />
    </div>
  );
}
