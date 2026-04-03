"use client";

import * as React from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
import {
  Plus,
  ChevronDown,
  Download,
  Calendar as CalendarIcon,
  AlertCircle,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { useTheme } from "next-themes";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useReports } from "@/hooks/use-api";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  AG_GRID_CLIPBOARD_OPTIONS,
  AG_GRID_MULTI_ROW_SELECTION_WITH_COPY,
} from "@/lib/ag-grid-clipboard";
import { useAgGridSelectionStats } from "@/hooks/use-ag-grid-selection-stats";
import { AgGridSelectionStatsBar } from "@/components/ui/ag-grid-selection-stats-bar";
import type { ReportListItem } from "@/types";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

function ReportNameCell({ data }: ICellRendererParams<ReportListItem>) {
  if (!data) return null;
  return (
    <Link
      href={`/dashboard/reports/${data.id}`}
      className="text-sm font-medium text-[#34C759] hover:underline"
    >
      {data.reportName}
    </Link>
  );
}

export function ReportsPage() {
  const gridRef = React.useRef<AgGridReact<ReportListItem>>(null);
  const { stats: selectionStats, onSelectionChanged } =
    useAgGridSelectionStats<ReportListItem>();
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const gridTheme = React.useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: isDark ? "#1A1C1E" : "#ffffff",
        headerBackgroundColor: isDark ? "#252930" : "#f4f6f8",
        oddRowBackgroundColor: isDark ? "#1A1C1E" : "#f9fafb",
        rowHoverColor: isDark ? "#2d3440" : "rgba(0,0,0,0.04)",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
        foregroundColor: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.80)",
        headerTextColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.50)",
        selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
        fontSize: 13,
      }),
    [isDark],
  );

  const params = React.useMemo(() => {
    const p: { from?: string; to?: string } = {};
    if (fromDate) p.from = fromDate.toISOString();
    if (toDate) p.to = toDate.toISOString();
    return p;
  }, [fromDate, toDate]);

  const { data, isLoading, error, mutate } = useReports(
    Object.keys(params).length ? params : undefined,
  );

  const reports = React.useMemo(() => data?.reports ?? [], [data]);

  const formatDateTime = (d: Date, time: "10a" | "12p") => {
    const base = format(d, "M/d/yy");
    return time === "10a" ? `${base} @ 10a` : `${base} @ 12p`;
  };

  const handleDownloadSelected = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    const ids = selected.map((r) => r.id);
    console.log(
      ids.length ? `Download reports: ${ids}` : "Download all / no selection",
    );
  };

  const columnDefs: ColDef<ReportListItem>[] = React.useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        sortable: false,
        flex: 0.4,
        minWidth: 48,
        maxWidth: 48,
      },
      { field: "date", headerName: "Date", flex: 1, minWidth: 90 },
      {
        field: "reportName",
        headerName: "Report Name",
        flex: 2,
        minWidth: 200,
        cellRenderer: ReportNameCell,
      },
      { field: "author", headerName: "Author", flex: 1.2, minWidth: 120 },
      { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
    ],
    [],
  );

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <PageHeader
          title="Reports"
          actions={
            <Button
              className="bg-[#34C759] text-black hover:bg-[#34C759]/90"
              asChild
            >
              <Link href="/dashboard/reports/new">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          }
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load reports. Please refresh or try again later.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]/95">
          <CardContent className="p-6">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-6">
              {/* Left: Actions */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-black dark:text-white">
                    Actions
                  </span>
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#34C759] text-base font-bold text-black"
                    title="Actions help"
                  >
                    ?
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="min-w-[140px] justify-between border-black/20 bg-gray-100 text-black hover:bg-black/5 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:hover:bg-white/10"
                    >
                      Download
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-[#34C759]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]"
                  >
                    <DropdownMenuItem
                      className="text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                      onClick={handleDownloadSelected}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                      onClick={() => mutate()}
                    >
                      Download all (refresh)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right: Date pickers */}
              <div className="flex flex-wrap items-end gap-4">
                {/* From */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-black dark:text-white">
                      From
                    </label>
                    <Info
                      className="h-3.5 w-3.5 text-black/60 dark:text-white/60"
                      aria-hidden
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="min-w-[160px] justify-between border-black/20 bg-gray-100 text-left font-normal text-black dark:border-white/20 dark:bg-[#252930] dark:text-white"
                      >
                        <span>
                          {fromDate
                            ? formatDateTime(fromDate, "10a")
                            : "1/5/24 @ 10a"}
                        </span>
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 text-[#34C759]" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto border-black/10 bg-white p-0 dark:border-white/10 dark:bg-[#252930]"
                      align="end"
                    >
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* To */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-black dark:text-white">
                      To
                    </label>
                    <Info
                      className="h-3.5 w-3.5 text-black/60 dark:text-white/60"
                      aria-hidden
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="min-w-[160px] justify-between border-black/20 bg-gray-100 text-left font-normal text-black dark:border-white/20 dark:bg-[#252930] dark:text-white"
                      >
                        <span>
                          {toDate
                            ? formatDateTime(toDate, "12p")
                            : "1/5/24 @ 12p"}
                        </span>
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 text-[#34C759]" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto border-black/10 bg-white p-0 dark:border-white/10 dark:bg-[#252930]"
                      align="end"
                    >
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Grid states */}
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
                <div className="h-96 animate-pulse rounded-md bg-black/5 dark:bg-white/5" />
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-medium text-black dark:text-white">
                  No reports found
                </p>
                <p className="text-sm text-black/50 dark:text-white/50">
                  Adjust the date range or create a new report.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-md border border-black/10 dark:border-white/10">
                <div style={{ height: 400 }}>
                  <AgGridReact<ReportListItem>
                    ref={gridRef}
                    theme={gridTheme}
                    rowData={reports}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: true, sortable: true }}
                    suppressMovableColumns
                    rowHeight={48}
                    headerHeight={44}
                    rowSelection="multiple"
                    getRowId={(p) => p.data.id}
                    pagination
                    paginationPageSize={10}
                    loading={isLoading}
                  />
                </div>
                <AgGridSelectionStatsBar stats={selectionStats} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
