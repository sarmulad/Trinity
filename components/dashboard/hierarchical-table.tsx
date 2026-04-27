"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";
import {
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GetDataPath,
  type ICellRendererParams,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "next-themes";

ModuleRegistry.registerModules([AllEnterpriseModule]);

export interface RowData {
  id: string;
  orgHierarchy: string[];
  name: string;
  location: string;
  oilProd: string;
  gasVolume: string;
  timestamp?: string;
  leaseId?: string;
}

const rowData: RowData[] = [
  {
    id: "area",
    orgHierarchy: ["Area"],
    name: "Area",
    location: "",
    oilProd: "",
    gasVolume: "",
    timestamp: "",
  },
  {
    id: "texas",
    orgHierarchy: ["Area", "Texas"],
    name: "Texas",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-28 08:14:02",
  },
  {
    id: "oklahoma",
    orgHierarchy: ["Area", "Oklahoma"],
    name: "Oklahoma",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-28 09:30:45",
  },
  {
    id: "routes",
    orgHierarchy: ["Routes"],
    name: "Routes",
    location: "",
    oilProd: "",
    gasVolume: "",
    timestamp: "",
  },
  {
    id: "david-r",
    orgHierarchy: ["Routes", "David Route"],
    name: "David Route",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-27 14:22:10",
  },
  {
    id: "john-r",
    orgHierarchy: ["Routes", "John Route"],
    name: "John Route",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-27 16:05:33",
  },
  {
    id: "leases",
    orgHierarchy: ["Leases"],
    name: "Leases",
    location: "",
    oilProd: "",
    gasVolume: "",
    timestamp: "",
  },
  {
    id: "johnson",
    orgHierarchy: ["Leases", "Johnson Lease"],
    name: "Johnson Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-26 11:48:00",
    leaseId: "johnson",
  },
  {
    id: "david",
    orgHierarchy: ["Leases", "David Lease"],
    name: "David Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-26 12:01:17",
    leaseId: "david",
  },
  {
    id: "riordan",
    orgHierarchy: ["Leases", "Riordan Lease"],
    name: "Riordan Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-25 07:59:44",
    leaseId: "riordan",
  },
  {
    id: "mark",
    orgHierarchy: ["Leases", "Mark Lease"],
    name: "Mark Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-25 09:12:55",
    leaseId: "mark",
  },
  {
    id: "roland",
    orgHierarchy: ["Leases", "Roland Lease"],
    name: "Roland Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-24 15:30:08",
    leaseId: "roland",
  },
  {
    id: "ben",
    orgHierarchy: ["Leases", "Ben Lease"],
    name: "Ben Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    timestamp: "2025-03-24 17:44:29",
    leaseId: "ben",
  },
];

const getDataPath: GetDataPath<RowData> = (data) => data.orgHierarchy;

function NameCellRenderer(params: ICellRendererParams<RowData>) {
  const isLeaf = !params.node.group;
  const leaseId = params.data?.leaseId;

  if (isLeaf && leaseId) {
    return (
      <Link
        href={`/dashboard/lease/${leaseId}`}
        className="flex items-center gap-1 text-sm transition-colors hover:text-[#34C759]"
        onClick={(e) => e.stopPropagation()}
      >
        {params.value}
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#34C759]" />
      </Link>
    );
  }

  return <span className="text-sm font-semibold">{params.value}</span>;
}

export function HierarchicalTable() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const gridRef = React.useRef<AgGridReact<RowData>>(null);

  const gridTheme = React.useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: isDark ? "#21252A" : "#ffffff",
        headerBackgroundColor: isDark ? "#1E2126" : "#f4f6f8",
        oddRowBackgroundColor: isDark ? "#1E2126" : "#f9fafb",
        rowHoverColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        foregroundColor: isDark ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.80)",
        headerTextColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.50)",
        rowBorderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
        fontSize: 13,
      }),
    [isDark],
  );

  const autoGroupColumnDef = React.useMemo<ColDef<RowData>>(
    () => ({
      headerName: "Group",
      cellRendererParams: {
        innerRenderer: NameCellRenderer,
        suppressCount: true,
      },
      flex: 2,
      minWidth: 180,
      pinned: "left",
      lockPinned: true,
    }),
    [],
  );

  const colDefs = React.useMemo<ColDef<RowData>[]>(
    () => [
      {
        field: "location",
        headerName: "Location",
        flex: 2,
        minWidth: 160,
      },
      {
        field: "oilProd",
        headerName: "Oil Production",
        flex: 1,
        minWidth: 110,
      },
      {
        field: "gasVolume",
        headerName: "Gas Volume",
        flex: 1,
        minWidth: 110,
      },
      {
        field: "timestamp",
        headerName: "Timestamp",
        flex: 1.5,
        minWidth: 160,
      },
    ],
    [],
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({ sortable: true, resizable: true }),
    [],
  );

  const handleExportCsv = React.useCallback(() => {
    gridRef.current?.api.exportDataAsCsv({
      fileName: "hierarchical-table-export.csv",
      processCellCallback: (params) => {
        if (params.column.getColId() === "name") {
          return params.node?.data?.name ?? "";
        }
        return params.value;
      },
    });
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black/70 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10"
        style={{ height: 520 }}
      >
        <AgGridReact<RowData>
          ref={gridRef}
          theme={gridTheme}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          treeData
          getDataPath={getDataPath}
          groupDefaultExpanded={1}
          animateRows
          suppressCellFocus
          rowHeight={48}
          headerHeight={44}
        />
      </div>
    </div>
  );
}
