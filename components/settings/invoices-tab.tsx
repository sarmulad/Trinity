"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
import { Search, ChevronDown, CheckSquare, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  AG_GRID_CLIPBOARD_OPTIONS,
  AG_GRID_MULTI_ROW_SELECTION_WITH_COPY,
} from "@/lib/ag-grid-clipboard";
import { useAgGridSelectionStats } from "@/hooks/use-ag-grid-selection-stats";
import { AgGridSelectionStatsBar } from "@/components/ui/ag-grid-selection-stats-bar";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

const darkTheme = themeQuartz.withParams({
  backgroundColor: "#1A1C1E",
  headerBackgroundColor: "#252930",
  oddRowBackgroundColor: "#1A1C1E",
  rowHoverColor: "#2d3440",
  borderColor: "rgba(255,255,255,0.1)",
  foregroundColor: "rgba(255,255,255,0.75)",
  headerTextColor: "rgba(255,255,255,0.45)",
  fontSize: 13,
  selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
});

export interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  cost: string;
  status: string;
  dateSent: string;
}

const MOCK_INVOICES: InvoiceRow[] = [
  { id: "1", invoiceNumber: "187-P14", cost: "$254.33", status: "Paid", dateSent: "3/1/24" },
  { id: "2", invoiceNumber: "222-J19", cost: "$254.33", status: "Paid", dateSent: "2/1/24" },
  { id: "3", invoiceNumber: "909-L14", cost: "$254.33", status: "Paid", dateSent: "1/1/24" },
];

export function InvoicesTab() {
  const { stats: selectionStats, onSelectionChanged } =
    useAgGridSelectionStats<InvoiceRow>();
  const [search, setSearch] = React.useState("");
  const [invoices] = React.useState<InvoiceRow[]>(MOCK_INVOICES);

  const filteredInvoices = React.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return invoices;
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.cost.includes(q) ||
        inv.status.toLowerCase().includes(q) ||
        inv.dateSent.includes(q),
    );
  }, [invoices, search]);

  const columnDefs: ColDef<InvoiceRow>[] = React.useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        sortable: false,
        flex: 0.4,
        minWidth: 48,
        maxWidth: 48,
      },
      {
        field: "invoiceNumber",
        headerName: "Invoice Number",
        flex: 1.2,
        minWidth: 140,
      },
      {
        field: "cost",
        headerName: "Cost",
        flex: 1,
        minWidth: 100,
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "dateSent",
        headerName: "Date Sent",
        flex: 1,
        minWidth: 100,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Invoices</h2>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white">Bulk Edit</span>
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-white/60"
                title="Bulk edit help"
              >
                <Info className="h-2.5 w-2.5" />
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[180px] justify-between border-white/20 bg-[#252930] text-white hover:bg-white/10"
                >
                  Select row/s to edit
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-[#34C759]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="border-white/10 bg-[#252930]"
              >
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Select all on page
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  Clear selection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white">Search</span>
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-white/60"
                title="Search help"
              >
                <Info className="h-2.5 w-2.5" />
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoices"
                className={cn(
                  "w-64 border-white/20 bg-[#252930] pl-9 text-white placeholder:text-white/40",
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-white/10 overflow-hidden">
        <div style={{ height: 320 }}>
          <AgGridReact<InvoiceRow>
            theme={darkTheme}
            rowData={filteredInvoices}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: true, sortable: true }}
            suppressMovableColumns
            rowHeight={48}
            headerHeight={44}
            rowSelection={AG_GRID_MULTI_ROW_SELECTION_WITH_COPY}
            getRowId={(params) => params.data.id}
            pagination
            paginationPageSize={10}
            onSelectionChanged={onSelectionChanged}
            {...AG_GRID_CLIPBOARD_OPTIONS}
          />
        </div>
      </div>
      <AgGridSelectionStatsBar stats={selectionStats} />
    </div>
  );
}
