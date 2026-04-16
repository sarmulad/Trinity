"use client";

import * as React from "react";
import type { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type SourceFlag = "manual" | "sensor";

export function formatSourceFlag(value?: string | null) {
  return value === "manual" ? "M" : value === "sensor" ? "S" : "—";
}

export function SourceIndicatorCell(params: ICellRendererParams<{ source?: SourceFlag }>) {
  const value = params.value as SourceFlag | undefined;
  const isManual = value === "manual";
  const label = formatSourceFlag(value);
  const badgeClasses =
    value === "sensor"
      ? "bg-[#e0f2fe] text-[#0369a1] dark:bg-sky-500/15 dark:text-sky-300"
      : isManual
        ? "bg-[#fef3c7] text-[#92400e] dark:bg-amber-500/15 dark:text-amber-300"
        : "bg-black/5 text-black/35 dark:bg-white/5 dark:text-white/35";
  const badge = (
    <span
      className={`inline-flex h-4 w-4 items-center justify-center rounded-[4px] text-[9px] font-bold tracking-[0.02em] transition-transform duration-150 hover:scale-110 ${badgeClasses}`}
      aria-label={isManual ? "Manual entry" : value === "sensor" ? "Sensor entry" : "Unknown source"}
    >
      {label}
    </span>
  );

  return (
    <div className="flex h-full items-center justify-center">
      {isManual ? (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{badge}</TooltipTrigger>
            <TooltipContent side="top" className="rounded-md bg-slate-800 px-2.5 py-1.5 text-[11px] font-normal text-slate-100">
              Manual entry
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        badge
      )}
    </div>
  );
}

export function sourceValueFormatter(params: ValueFormatterParams) {
  return formatSourceFlag(params.value as string | undefined);
}

export function createSourceColumn<TData extends { source?: SourceFlag }>(
  overrides?: Partial<ColDef<TData>>,
): ColDef<TData> {
  return {
    field: "source" as keyof TData & string,
    headerName: "Src",
    width: 84,
    minWidth: 84,
    maxWidth: 92,
    sortable: true,
    filter: "agSetColumnFilter",
    filterParams: {
      valueFormatter: sourceValueFormatter,
    },
    suppressHeaderMenuButton: false,
    valueFormatter: sourceValueFormatter,
    cellRenderer: SourceIndicatorCell as unknown as ColDef<TData>["cellRenderer"],
    cellStyle: { textAlign: "center" },
    ...overrides,
  };
}
