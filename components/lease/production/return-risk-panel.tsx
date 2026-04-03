"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { ReturnRisk, TIME_RANGES } from "./types";

function RangeBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="relative h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10">
        <div
          className="absolute left-0 top-0 h-1.5 rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-black/30 dark:text-white/30">
        <span>Low</span>
        <span>Avg</span>
        <span>High</span>
      </div>
    </div>
  );
}

interface ReturnRiskPanelProps {
  title: string;
  returnRisk: ReturnRisk;
}

export function ReturnRiskPanel({ title, returnRisk }: ReturnRiskPanelProps) {
  const [period, setPeriod] = React.useState("Y");

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#1e2025]">
      {/* Header + time range mini-bar */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-black dark:text-white">{title}</p>
        <div className="flex gap-0.5">
          {TIME_RANGES.map((r, i) => (
            <button
              key={`${r}-${i}`}
              onClick={() => setPeriod(r)}
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                period === r
                  ? "bg-[#34C759] text-black"
                  : "text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Return */}
      <div className="mb-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
            Return <Info className="h-3 w-3" />
          </div>
          <span className="text-xs text-black/30 dark:text-white/30">
            Annualized Returns ▾
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-black dark:text-white">
            {returnRisk.returnPct}%
          </span>
          <span className="text-xs text-black/30 dark:text-white/30">
            vs Category: {returnRisk.vsCategory}
          </span>
        </div>
        <RangeBar value={65} color="#34C759" />
      </div>

      {/* Risk */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
            Risk <Info className="h-3 w-3" />
          </div>
          <span className="text-xs text-black/30 dark:text-white/30">
            Production Volatility ▾
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-black dark:text-white">
            {returnRisk.riskPct}%
          </span>
          <span className="text-xs text-black/30 dark:text-white/30">
            vs Category: {returnRisk.riskVsCategory}
          </span>
        </div>
        <RangeBar value={40} color="#eab308" />
      </div>
    </div>
  );
}
