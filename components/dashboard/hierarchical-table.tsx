"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
  },
  {
    id: "texas",
    orgHierarchy: ["Area", "Texas"],
    name: "Texas",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
  },
  {
    id: "oklahoma",
    orgHierarchy: ["Area", "Oklahoma"],
    name: "Oklahoma",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
  },
  {
    id: "routes",
    orgHierarchy: ["Routes"],
    name: "Routes",
    location: "",
    oilProd: "",
    gasVolume: "",
  },
  {
    id: "david-r",
    orgHierarchy: ["Routes", "David Route"],
    name: "David Route",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
  },
  {
    id: "john-r",
    orgHierarchy: ["Routes", "John Route"],
    name: "John Route",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
  },
  {
    id: "leases",
    orgHierarchy: ["Leases"],
    name: "Leases",
    location: "",
    oilProd: "",
    gasVolume: "",
  },
  {
    id: "johnson",
    orgHierarchy: ["Leases", "Johnson Lease"],
    name: "Johnson Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    leaseId: "johnson",
  },
  {
    id: "david",
    orgHierarchy: ["Leases", "David Lease"],
    name: "David Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    leaseId: "david",
  },
  {
    id: "riordan",
    orgHierarchy: ["Leases", "Riordan Lease"],
    name: "Riordan Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    leaseId: "riordan",
  },
  {
    id: "mark",
    orgHierarchy: ["Leases", "Mark Lease"],
    name: "Mark Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    leaseId: "mark",
  },
  {
    id: "roland",
    orgHierarchy: ["Leases", "Roland Lease"],
    name: "Roland Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
    leaseId: "roland",
  },
  {
    id: "ben",
    orgHierarchy: ["Leases", "Ben Lease"],
    name: "Ben Lease",
    location: "35.0090° N, 97.0801° W",
    oilProd: "3,500 BBLs",
    gasVolume: "250 MCF",
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

  const colDefs = React.useMemo<ColDef<RowData>[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        cellRenderer: "agGroupCellRenderer",
        cellRendererParams: {
          innerRenderer: NameCellRenderer,
          suppressCount: true,
        },
        flex: 2,
        minWidth: 180,
      },
      {
        field: "location",
        headerName: "Location",
        flex: 2,
        minWidth: 160,
      },
      {
        field: "oilProd",
        headerName: "Oil Prod",
        flex: 1,
        minWidth: 110,
      },
      {
        field: "gasVolume",
        headerName: "Gas Volume",
        flex: 1,
        minWidth: 110,
      },
    ],
    [],
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({ sortable: true, resizable: true }),
    [],
  );

  return (
    <div
      className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10"
      style={{ height: 520 }}
    >
      <AgGridReact<RowData>
        theme={gridTheme}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        treeData
        getDataPath={getDataPath}
        groupDefaultExpanded={1}
        animateRows
        suppressCellFocus
        rowHeight={48}
        headerHeight={44}
      />
    </div>
  );
}
