"use client";

import { ChevronUp } from "lucide-react";
import { ProductionStats } from "./types";

interface StatsPanelProps {
  // Title changes based on active view:
  // chart view → "Key Production Stats"
  // table view → "Chart Details"
  title: string;
  stats: ProductionStats;
}

export function StatsPanel({ title, stats }: StatsPanelProps) {
  const cols = [
    [
      { label: "Oil Stock", value: stats.oilStock },
      { label: "Avg. Flow Time", value: stats.avgFlowTime },
    ],
    [
      { label: "Avg. Runs/Day", value: stats.avgRunsDay },
      { label: "Yest. Runs", value: stats.yesterdayRuns },
    ],
    [
      { label: "Avg. Runs/Day", value: stats.avgRunsDay },
      { label: "Yest. Runs", value: stats.yesterdayRuns },
    ],
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-[#1e2025] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{title}</span>
        <ChevronUp className="h-4 w-4 text-white/30" />
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/10">
        {cols.map((col, i) => (
          <div key={i} className={`space-y-3 ${i === 0 ? "pr-4" : "px-4"}`}>
            {col.map((r) => (
              <div key={r.label}>
                <p className="text-[10px] text-white/40">{r.label}</p>
                <p className="text-sm font-bold text-white">{r.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
