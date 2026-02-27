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
import {
  Plus,
  ChevronDown,
  Download,
  Calendar as CalendarIcon,
  AlertCircle,
  Info,
} from "lucide-react";
import { format } from "date-fns";

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
import type { ReportListItem } from "@/types";

ModuleRegistry.registerModules([AllCommunityModule]);

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
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();

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
    if (ids.length) {
      // TODO: trigger download for selected report IDs
      console.log("Download reports:", ids);
    } else {
      console.log("Download all / no selection");
    }
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
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "reportName",
        headerName: "Report Name",
        flex: 2,
        minWidth: 200,
        cellRenderer: ReportNameCell,
      },
      {
        field: "author",
        headerName: "Author",
        flex: 1.2,
        minWidth: 120,
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 100,
      },
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

        <Card className="border-white/10 bg-[#1A1C1E]/95">
          <CardContent className="p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-6">
              {/* Left: Actions label, ? icon, Download dropdown */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    Actions
                  </span>
                  <span
                    className="flex h-4 w-4 shrink-0 items-center font-bold justify-center rounded-full bg-[#34C759] text-[#000000]  text-base "
                    title="Actions help"
                  >
                    ?
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="min-w-[140px] justify-between border-white/20 bg-[#252930] text-white hover:bg-white/10"
                    >
                      Download
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-[#34C759]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="border-white/10 bg-[#252930]"
                  >
                    <DropdownMenuItem
                      className="text-white hover:bg-white/10"
                      onClick={handleDownloadSelected}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-white hover:bg-white/10"
                      onClick={() => mutate()}
                    >
                      Download all (refresh)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right: From and To date pickers */}
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-white">
                      From
                    </label>
                    <Info className="h-3.5 w-3.5 text-white/60" aria-hidden />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="min-w-[160px] justify-between border-white/20 bg-[#252930] text-left font-normal text-white"
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
                      className="w-auto border-white/10 bg-[#252930] p-0"
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
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-white">To</label>
                    <Info className="h-3.5 w-3.5 text-white/60" aria-hidden />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="min-w-[160px] justify-between border-white/20 bg-[#252930] text-left font-normal text-white"
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
                      className="w-auto border-white/10 bg-[#252930] p-0"
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

            {isLoading ? (
              <div className="space-y-4">
                <div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-muted" />
                <div className="h-96 animate-pulse rounded-md bg-muted/50" />
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <p className="text-lg font-medium">No reports found</p>
                <p className="text-sm">
                  Adjust the date range or create a new report.
                </p>
              </div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <div style={{ height: 400 }}>
                  <AgGridReact<ReportListItem>
                    ref={gridRef}
                    theme={darkTheme}
                    rowData={reports}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: true, sortable: true }}
                    suppressMovableColumns
                    rowHeight={48}
                    headerHeight={44}
                    rowSelection="multiple"
                    getRowId={(params) => params.data.id}
                    pagination
                    paginationPageSize={10}
                    loading={isLoading}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
