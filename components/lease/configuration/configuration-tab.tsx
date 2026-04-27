"use client";

import Link from "next/link";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";

interface ConfigurationTabProps {
  leaseName: string;
}

const CONFIG_ROWS = [
  { label: "Battery", value: "Johnson Battery" },
  { label: "Primary Route", value: "Johnson Route" },
  { label: "Default Production Frequency", value: "15 MIN" },
  { label: "Assigned Alarm Group", value: "Operations Team" },
  { label: "Assigned Report Group", value: "Production Review" },
  { label: "Configuration Source", value: "Platform Settings" },
];

export function ConfigurationTab({ leaseName }: ConfigurationTabProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-black/10 bg-white/95 p-5 shadow-sm dark:border-white/10 dark:bg-[#1A1C1E]/95">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-black dark:text-white">
              Lease Configuration
            </p>
            <p className="text-xs text-black/40 dark:text-white/40">
              Summary settings currently applied to {leaseName}.
            </p>
          </div>

          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#34C759]/35 bg-[#34C759]/10 px-3 py-2 text-xs font-semibold text-[#1f9e45] transition-colors hover:bg-[#34C759]/15 dark:text-[#7DFF9F]"
          >
            Open Full Configuration
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {CONFIG_ROWS.map((row) => (
            <div
              key={row.label}
              className="rounded-lg border border-black/10 bg-black/[0.02] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
                {row.label}
              </p>
              <p className="mt-1 text-sm font-medium text-black dark:text-white">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
