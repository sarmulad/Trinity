"use client";

import * as React from "react";
import { Search } from "lucide-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

import { SettingsDataGrid } from "../settings-data-grid";
import {
  GridEditDeleteActions,
  SettingsCountBadge,
} from "../settings-grid-cells";
import { MOCK_BATTERIES, type BatteryRow } from "./mock-data";

type BatteriesSectionProps = {
  onOpenBattery: (row: BatteryRow) => void;
};

export function BatteriesSection({ onOpenBattery }: BatteriesSectionProps) {
  const [search, setSearch] = React.useState("");
  const [rows] = React.useState(MOCK_BATTERIES);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.leaseName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const columnDefs = React.useMemo<ColDef<BatteryRow>[]>(
    () => [
      {
        field: "name",
        headerName: "Battery",
        flex: 1.3,
        minWidth: 160,
        cellRenderer: (p: ICellRendererParams<BatteryRow>) =>
          p.data ? (
            <button
              type="button"
              className="font-medium text-[#1a7f37] underline-offset-2 hover:underline dark:text-[#34C759]"
              onClick={() => onOpenBattery(p.data!)}
            >
              {p.data.name}
            </button>
          ) : null,
      },
      { field: "leaseName", headerName: "Lease", flex: 1.1, minWidth: 130 },
      {
        field: "assetsCount",
        headerName: "Assets",
        flex: 0.6,
        minWidth: 90,
        cellRenderer: (p: ICellRendererParams<BatteryRow>) =>
          p.data ? (
            <SettingsCountBadge value={p.data.assetsCount} tone="info" />
          ) : null,
      },
      {
        field: "wellsCount",
        headerName: "Wells",
        flex: 0.6,
        minWidth: 90,
        cellRenderer: (p: ICellRendererParams<BatteryRow>) =>
          p.data ? (
            <SettingsCountBadge value={p.data.wellsCount} tone="success" />
          ) : null,
      },
      {
        field: "location",
        headerName: "Location",
        flex: 1,
        minWidth: 130,
        cellClass: "text-xs text-black/60 dark:text-white/60",
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
    [onOpenBattery],
  );

  return (
    <div className="space-y-4">
      <div className="relative w-64">
        <Search className="app-search-icon" aria-hidden />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search batteries..."
          className="app-search-input w-full"
        />
      </div>

      <SettingsDataGrid<BatteryRow>
        rowData={filtered}
        columnDefs={columnDefs}
        height={380}
        getRowId={(p) => p.data.id}
      />
    </div>
  );
}
