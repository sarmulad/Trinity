"use client";

import { ChevronUp } from "lucide-react";
import { AllocatedWell } from "./types";

// ─── Donut ────────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

interface AllocatedProductionChartProps {
  wells: AllocatedWell[];
}

export function AllocatedProductionChart({
  wells,
}: AllocatedProductionChartProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1e2025] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">
          Allocated Production Chart
        </span>
        <ChevronUp className="h-4 w-4 text-white/30" />
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
              <span className="text-sm text-white">{w.name}</span>
              <span className="ml-1 text-sm text-white/40">{w.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
