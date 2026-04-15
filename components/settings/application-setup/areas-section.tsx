"use client";

import * as React from "react";
import { Search } from "lucide-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

import { SettingsDataGrid } from "../settings-data-grid";
import {
  GridEditDeleteActions,
  SettingsRoutesBadge,
} from "../settings-grid-cells";
import { MOCK_AREAS, type AreaRow } from "./mock-data";

export function AreasSection() {
  const [search, setSearch] = React.useState("");
  const [rows] = React.useState(MOCK_AREAS);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.routesLabel.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totalRoutes = React.useMemo(
    () =>
      rows.reduce((acc, a) => {
        const n = parseInt(a.routesLabel, 10);
        return acc + (Number.isFinite(n) ? n : 0);
      }, 0),
    [rows],
  );

  const columnDefs = React.useMemo<ColDef<AreaRow>[]>(
    () => [
      {
        field: "name",
        headerName: "Area name",
        flex: 1.2,
        minWidth: 140,
        cellClass: "font-medium",
      },
      {
        field: "routesLabel",
        headerName: "Routes",
        flex: 0.9,
        minWidth: 120,
        cellRenderer: (p: ICellRendererParams<AreaRow>) =>
          p.data ? (
            <SettingsRoutesBadge
              label={p.data.routesLabel}
              tone={p.data.routesTone}
            />
          ) : null,
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1.8,
        minWidth: 180,
        cellClass: "text-black/60 dark:text-white/60",
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
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
            Total areas
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-black dark:text-white">
            {rows.length}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
            Total routes
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-black dark:text-white">
            {totalRoutes}
          </p>
        </div>
      </div>

      <div className="relative w-64">
        <Search className="app-search-icon" aria-hidden />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search areas..."
          className="app-search-input w-full"
        />
      </div>

      <SettingsDataGrid<AreaRow>
        rowData={filtered}
        columnDefs={columnDefs}
        height={380}
        getRowId={(p) => p.data.id}
      />
    </div>
  );
}
