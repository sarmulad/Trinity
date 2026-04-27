"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

type TicketRow = {
  id: string;
  ticketType: "Gauge Ticket" | "Well Test" | "Equipment Ticket";
  ticketNumber: string;
  ticketDate: string;
  submissionDate: string;
  submittedBy: string;
  status: "Submitted" | "Reviewed" | "Pending";
  asset: string;
  notes: string;
};

const EXAMPLE_ROWS: TicketRow[] = [
  {
    id: "tt-101",
    ticketType: "Gauge Ticket",
    ticketNumber: "GT-24031",
    ticketDate: "04/22/26 06:00 AM",
    submissionDate: "04/22/26 06:14 AM",
    submittedBy: "Luis Marcus",
    status: "Submitted",
    asset: "Oil Tank #1",
    notes:
      "Manual gauge entered during morning route. No variance outside expected operating range.",
  },
  {
    id: "tt-102",
    ticketType: "Well Test",
    ticketNumber: "WT-18304",
    ticketDate: "04/21/26 01:30 PM",
    submissionDate: "04/21/26 02:01 PM",
    submittedBy: "Jacob Jones",
    status: "Reviewed",
    asset: "Johnson #2",
    notes:
      "Three-point test completed and attached to route submission. Flow stabilized after separator adjustment.",
  },
  {
    id: "tt-103",
    ticketType: "Equipment Ticket",
    ticketNumber: "ET-98124",
    ticketDate: "04/20/26 09:10 AM",
    submissionDate: "04/20/26 09:42 AM",
    submittedBy: "Wade Warren",
    status: "Pending",
    asset: "EFM/Chart #201",
    notes:
      "Differential pressure reading was outside target band. Field review still pending.",
  },
];

export function TicketsTestsTab() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [search, setSearch] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState<TicketRow | null>(null);

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return EXAMPLE_ROWS;
    return EXAMPLE_ROWS.filter((row) =>
      [
        row.ticketType,
        row.ticketNumber,
        row.ticketDate,
        row.submissionDate,
        row.submittedBy,
        row.asset,
        row.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [search]);

  const gridTheme = React.useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: isDark ? "#252930" : "#ffffff",
        headerBackgroundColor: isDark ? "#1e2025" : "#f4f6f8",
        oddRowBackgroundColor: isDark ? "#252930" : "#f9fafb",
        rowHoverColor: isDark ? "#2d3440" : "rgba(0,0,0,0.04)",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        foregroundColor: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
        headerTextColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
        selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
        fontSize: 13,
      }),
    [isDark],
  );

  const columnDefs = React.useMemo<ColDef<TicketRow>[]>(
    () => [
      {
        field: "ticketType",
        headerName: "Ticket Type",
        flex: 1.2,
        minWidth: 150,
      },
      {
        field: "ticketNumber",
        headerName: "Ticket Number",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "ticketDate",
        headerName: "Ticket Date",
        flex: 1,
        minWidth: 150,
        sort: "desc",
      },
      {
        field: "submissionDate",
        headerName: "Submission Date",
        flex: 1,
        minWidth: 160,
      },
      {
        field: "submittedBy",
        headerName: "Submitted By",
        flex: 1,
        minWidth: 150,
      },
      { field: "status", headerName: "Status", flex: 0.9, minWidth: 120 },
    ],
    [],
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-black dark:text-white">
              Tickets & Tests
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="app-search-icon" />
            <input
              type="text"
              placeholder="Search tickets & tests"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="app-search-input w-full dark:bg-[#252930]"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-black/10 bg-white/95 shadow-sm dark:border-white/10 dark:bg-[#1A1C1E]/95">
          <div style={{ height: 560 }}>
            <AgGridReact
              theme={gridTheme}
              rowData={rows}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                resizable: true,
                filter: true,
              }}
              rowHeight={44}
              headerHeight={42}
              pagination
              paginationPageSize={12}
              getRowStyle={() => ({ cursor: "pointer" })}
              onRowClicked={(event) => {
                if (event.data) setSelectedRow(event.data);
              }}
            />
          </div>
        </div>
      </div>

      <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <DialogContent className="max-w-2xl border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">
              {selectedRow?.ticketType}
            </DialogTitle>
            <DialogDescription>
              {selectedRow?.ticketNumber} · {selectedRow?.asset}
            </DialogDescription>
          </DialogHeader>

          {selectedRow && (
            <div className="grid gap-3">
              {[
                ["Ticket Number", selectedRow.ticketNumber],
                ["Ticket Date", selectedRow.ticketDate],
                ["Submission Date", selectedRow.submissionDate],
                ["Submitted By", selectedRow.submittedBy],
                ["Status", selectedRow.status],
                ["Asset", selectedRow.asset],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-black/10 bg-black/[0.02] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-black dark:text-white">
                    {value}
                  </span>
                </div>
              ))}

              <div className="rounded-lg border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
                  Submitted Result
                </p>
                <p className="text-sm leading-6 text-black/70 dark:text-white/70">
                  {selectedRow.notes}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
