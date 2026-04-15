import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { GRID_FRAME_CLASS } from "./report-constants";
import type { HistoryStatus, ReportFormat } from "./types";

export function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-md border border-black/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-[#252930]">
      <p className="text-xs text-black/50 dark:text-white/50">{label}</p>
      <div
        className={cn(
          "mt-1 text-2xl font-semibold text-black dark:text-white",
          valueClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function FormatBadge({ format }: { format: ReportFormat }) {
  const isPdf = format === "pdf";
  return (
    <Badge
      className={cn(
        "rounded-md border-0 px-2 py-0.5 text-[11px] font-semibold",
        isPdf
          ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
          : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
      )}
    >
      {isPdf ? "PDF" : "Excel"}
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const categoryClasses: Record<string, string> = {
    Production: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    Waterflood:
      "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
    Inventory:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    Operations:
      "bg-gray-200 text-gray-700 dark:bg-white/20 dark:text-white/80",
    Financial:
      "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    Regulatory:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  };

  return (
    <Badge
      className={cn(
        "rounded-md border-0 px-2 py-0.5 text-[11px] font-semibold",
        categoryClasses[category] ??
          "bg-gray-200 text-gray-700 dark:bg-white/20 dark:text-white/80",
      )}
    >
      {category}
    </Badge>
  );
}

export function StatusBadge({
  status,
}: {
  status: HistoryStatus | "Active" | "Paused";
}) {
  const statusClasses: Record<HistoryStatus | "Active" | "Paused", string> = {
    Delivered:
      "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
    Downloaded:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    Failed: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    Active: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
    Paused: "bg-gray-200 text-gray-700 dark:bg-white/20 dark:text-white/80",
  };

  return (
    <Badge
      className={cn(
        "rounded-md border-0 px-2 py-0.5 text-[11px] font-semibold",
        statusClasses[status],
      )}
    >
      {status}
    </Badge>
  );
}

export function GridFrame({
  height,
  children,
}: {
  height: number;
  children: React.ReactNode;
}) {
  return (
    <div className={GRID_FRAME_CLASS}>
      <div style={{ height }}>{children}</div>
    </div>
  );
}
