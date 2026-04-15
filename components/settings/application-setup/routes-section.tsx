"use client";

import * as React from "react";
import { Search } from "lucide-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

import { SettingsDataGrid } from "../settings-data-grid";
import {
  GridEditDeleteActions,
  SettingsCountBadge,
} from "../settings-grid-cells";
import { MOCK_ROUTES, type RouteRow } from "./mock-data";

export function RoutesSection() {
  const [search, setSearch] = React.useState("");
  const [rows] = React.useState(MOCK_ROUTES);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.pumper.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const columnDefs = React.useMemo<ColDef<RouteRow>[]>(
    () => [
      {
        field: "name",
        headerName: "Route",
        flex: 1.4,
        minWidth: 160,
        cellClass: "font-medium",
      },
      { field: "area", headerName: "Area", flex: 1, minWidth: 120 },
      { field: "pumper", headerName: "Pumper", flex: 1, minWidth: 100 },
      {
        field: "leasesCount",
        headerName: "Leases",
        flex: 0.7,
        minWidth: 100,
        cellRenderer: (p: ICellRendererParams<RouteRow>) =>
          p.data ? (
            <SettingsCountBadge
              value={p.data.leasesCount}
              tone={p.data.leasesTone}
            />
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
          placeholder="Search routes..."
          className="app-search-input w-full"
        />
      </div>

      <SettingsDataGrid<RouteRow>
        rowData={filtered}
        columnDefs={columnDefs}
        height={380}
        getRowId={(p) => p.data.id}
      />
    </div>
  );
}
