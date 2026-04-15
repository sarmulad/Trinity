"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SettingsRoutesBadge({
  label,
  tone,
}: {
  label: string;
  tone: "info" | "warning";
}) {
  return (
    <Badge
      className={cn(
        "font-medium",
        tone === "info" &&
          "border-transparent bg-sky-500/15 text-sky-900 dark:text-sky-200",
        tone === "warning" &&
          "border-transparent bg-amber-500/15 text-amber-950 dark:text-amber-200",
      )}
    >
      {label}
    </Badge>
  );
}

export function SettingsCountBadge({
  value,
  tone,
}: {
  value: number;
  tone: "info" | "warning" | "success";
}) {
  return (
    <Badge
      className={cn(
        "min-w-[2rem] justify-center font-medium tabular-nums",
        tone === "info" &&
          "border-transparent bg-sky-500/15 text-sky-900 dark:text-sky-200",
        tone === "warning" &&
          "border-transparent bg-amber-500/15 text-amber-950 dark:text-amber-200",
        tone === "success" &&
          "border-transparent bg-[#34C759]/18 text-[#14532d] dark:text-[#86efac]",
      )}
    >
      {value}
    </Badge>
  );
}

export function SettingsTypeBadge({
  label,
  tone,
}: {
  label: string;
  tone: "muted" | "info" | "warning" | "success";
}) {
  return (
    <Badge
      className={cn(
        "font-medium",
        tone === "muted" &&
          "border-transparent bg-black/[0.06] text-black/80 dark:bg-white/10 dark:text-white/80",
        tone === "info" &&
          "border-transparent bg-sky-500/15 text-sky-900 dark:text-sky-200",
        tone === "warning" &&
          "border-transparent bg-amber-500/15 text-amber-950 dark:text-amber-200",
        tone === "success" &&
          "border-transparent bg-[#34C759]/18 text-[#14532d] dark:text-[#86efac]",
      )}
    >
      {label}
    </Badge>
  );
}

export function GridEditDeleteActions({
  onEdit,
  onDelete,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex h-full items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 border-black/15 px-2 text-xs text-black/80 hover:bg-black/[0.04] dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
        onClick={onEdit}
      >
        Edit
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 border-black/15 px-2 text-xs text-black/80 hover:bg-black/[0.04] dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
        onClick={onDelete}
      >
        Delete
      </Button>
    </div>
  );
}
