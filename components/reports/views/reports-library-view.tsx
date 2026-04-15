"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams, Theme } from "ag-grid-community";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AG_GRID_CLIPBOARD_OPTIONS,
  AG_GRID_MULTI_ROW_SELECTION,
} from "@/lib/ag-grid-clipboard";
import { cn } from "@/lib/utils";

import {
  INPUT_CLASS,
  OUTLINE_BUTTON_CLASS,
  REPORT_LIBRARY,
} from "../report-constants";
import { CategoryBadge, FormatBadge, GridFrame, StatCard } from "../report-ui";
import type { ReportDefinition } from "../types";

export type ReportsLibraryViewProps = {
  gridTheme: Theme;
  defaultColDef: ColDef;
  reportSearch: string;
  onReportSearchChange: (value: string) => void;
  reportCategory: string;
  onReportCategoryChange: (value: string) => void;
  reportCategories: string[];
  filteredReports: ReportDefinition[];
  activeSchedulesCount: number;
  onOpenDetail: (reportName: string) => void;
  onRunNow: (report: ReportDefinition, format: ReportDefinition["formats"][number]) => void;
  onOpenSchedule: (reportName: string) => void;
};

export function ReportsLibraryView({
  gridTheme,
  defaultColDef,
  reportSearch,
  onReportSearchChange,
  reportCategory,
  onReportCategoryChange,
  reportCategories,
  filteredReports,
  activeSchedulesCount,
  onOpenDetail,
  onRunNow,
  onOpenSchedule,
}: ReportsLibraryViewProps) {
  const columnDefs = React.useMemo<ColDef<ReportDefinition>[]>(
    () => [
      {
        field: "name",
        headerName: "Report name",
        flex: 2,
        minWidth: 260,
        cellRenderer: ({ data }: ICellRendererParams<ReportDefinition>) => {
          if (!data) return null;
          return (
            <button
              type="button"
              className="text-left text-sm font-medium text-[#34C759] hover:underline"
              onClick={(event) => {
                event.stopPropagation();
                onOpenDetail(data.name);
              }}
            >
              {data.name}
            </button>
          );
        },
      },
      {
        field: "category",
        headerName: "Category",
        flex: 1.1,
        minWidth: 140,
        cellRenderer: ({ value }: ICellRendererParams<ReportDefinition, string>) =>
          value ? <CategoryBadge category={value} /> : null,
      },
      {
        field: "formats",
        headerName: "Format",
        flex: 1.3,
        minWidth: 170,
        sortable: false,
        cellRenderer: ({
          value,
        }: ICellRendererParams<ReportDefinition, ReportDefinition["formats"]>) => (
          <div className="flex h-full flex-wrap items-center gap-1.5">
            {(value ?? []).map((format) => (
              <FormatBadge key={`library-format-${format}`} format={format} />
            ))}
          </div>
        ),
      },
      {
        field: "defaultFrequency",
        headerName: "Default freq.",
        flex: 1,
        minWidth: 130,
      },
      {
        headerName: "Actions",
        sortable: false,
        flex: 1.2,
        minWidth: 210,
        maxWidth: 220,
        cellRenderer: ({ data }: ICellRendererParams<ReportDefinition>) => {
          if (!data) return null;
          return (
            <div
              className="flex h-full items-center justify-start gap-2"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                onClick={() => onRunNow(data, data.formats[0])}
              >
                Run now
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                onClick={() => onOpenSchedule(data.name)}
              >
                Schedule
              </Button>
            </div>
          );
        },
      },
    ],
    [onOpenDetail, onOpenSchedule, onRunNow],
  );

  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Standard reports" value={REPORT_LIBRARY.length} />
        <StatCard label="Categories" value={reportCategories.length - 1} />
        <StatCard label="Scheduled" value={activeSchedulesCount} />
      </div>

      <div className="mb-4 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative shrink-0">
          <Search className="app-search-icon" />
          <Input
            className="app-search-input w-64"
            placeholder="Search reports..."
            value={reportSearch}
            onChange={(event) => onReportSearchChange(event.target.value)}
          />
        </div>

        <Select value={reportCategory} onValueChange={onReportCategoryChange}>
          <SelectTrigger
            className={cn("w-full md:w-[220px] md:shrink-0", INPUT_CLASS)}
          >
            <SelectValue placeholder="Filter category" />
          </SelectTrigger>
          <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
            {reportCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <GridFrame height={560}>
        <AgGridReact<ReportDefinition>
          theme={gridTheme}
          rowData={filteredReports}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressMovableColumns
          rowHeight={50}
          headerHeight={44}
          rowSelection={AG_GRID_MULTI_ROW_SELECTION}
          pagination
          paginationPageSize={10}
          getRowStyle={() => ({ cursor: "pointer" })}
          onRowClicked={(event) => {
            if (event.data) onOpenDetail(event.data.name);
          }}
          {...AG_GRID_CLIPBOARD_OPTIONS}
        />
      </GridFrame>
    </div>
  );
}
