"use client";

import { ChevronUp } from "lucide-react";
import { AllocatedWell } from "./types";

function DonutChart({ wells }: { wells: AllocatedWell[] }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  const segments = wells.map((w) => {
    const dash = (w.pct / 100) * circ;
    const seg = { ...w, dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
      {/* Track */}
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#111418"
        strokeWidth="20"
        className="fill-none stroke-black/10 dark:[stroke:#111418]"
      />
      {segments.map((s, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth="20"
          strokeDasharray={`${s.dash} ${circ - s.dash}`}
          strokeDashoffset={-s.offset}
        />
      ))}
    </svg>
  );
}

interface AllocatedProductionChartProps {
  wells: AllocatedWell[];
}

export function AllocatedProductionChart({
  wells,
}: AllocatedProductionChartProps) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#1e2025]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-black dark:text-white">
          Allocated Production Chart
        </span>
        <ChevronUp className="h-4 w-4 text-black/30 dark:text-white/30" />
      </div>

      <div className="flex items-center gap-6">
        <DonutChart wells={wells} />
        <div className="space-y-2.5">
          {wells.map((w) => (
            <div key={w.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: w.color }}
              />
              <span className="text-sm text-black dark:text-white">
                {w.name}
              </span>
              <span className="ml-1 text-sm text-black/40 dark:text-white/40">
                {w.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
