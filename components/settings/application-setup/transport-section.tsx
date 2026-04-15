"use client";

import * as React from "react";
import { Search } from "lucide-react";
import type { ColDef } from "ag-grid-community";

import { SettingsDataGrid } from "../settings-data-grid";
import { GridEditDeleteActions } from "../settings-grid-cells";
import { MOCK_TRANSPORT, type TransportRow } from "./mock-data";

export function TransportSection() {
  const [search, setSearch] = React.useState("");
  const [rows] = React.useState(MOCK_TRANSPORT);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.company.toLowerCase().includes(q) ||
        r.contact.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const columnDefs = React.useMemo<ColDef<TransportRow>[]>(
    () => [
      {
        field: "company",
        headerName: "Company",
        flex: 1.2,
        minWidth: 150,
        cellClass: "font-medium",
      },
      { field: "contact", headerName: "Contact", flex: 1, minWidth: 120 },
      {
        field: "phone",
        headerName: "Phone",
        flex: 1,
        minWidth: 130,
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
      <div className="relative w-64">
        <Search className="app-search-icon" aria-hidden />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transport companies..."
          className="app-search-input w-full"
        />
      </div>

      <SettingsDataGrid<TransportRow>
        rowData={filtered}
        columnDefs={columnDefs}
        height={360}
        getRowId={(p) => p.data.id}
      />
    </div>
  );
}
