"use client";

import * as React from "react";

import { ProductionChart } from "./production-chart";
import { ProductionTable } from "./production-table";
import { AllocatedProductionChart } from "./allocated-production-chart";
import { StatsPanel } from "./stats-panel";
import { LeaseScoreCard } from "./lease-score";
import { ReturnRiskPanel } from "./return-risk-panel";
import { MoreInformation } from "./more-information";

import {
  ProductionTabProps,
  EXAMPLE_PRODUCTION,
  EXAMPLE_STATS,
  EXAMPLE_SCORE,
  EXAMPLE_RETURN_RISK,
  EXAMPLE_ALLOCATED,
  EXAMPLE_MORE_INFO,
} from "./types";

export function ProductionTab({
  productionData = EXAMPLE_PRODUCTION,
  stats = EXAMPLE_STATS,
  leaseScore = EXAMPLE_SCORE,
  returnRisk = EXAMPLE_RETURN_RISK,
  allocatedWells = EXAMPLE_ALLOCATED,
  moreInfo = EXAMPLE_MORE_INFO,
  isLoading = false,
}: ProductionTabProps) {
  const [view, setView] = React.useState<"chart" | "table">("chart");
  const isChart = view === "chart";

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-white">Production</p>

      {/* ── Chart / Table card ── */}
      <div className="rounded-xl border border-white/10 bg-[#1e2025]">
        {/* Toggle */}
        <div className="flex items-center gap-6 border-b border-white/10 px-6 pt-4">
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`pb-3 text-sm font-medium capitalize transition-colors ${
                view === v
                  ? "border-b-2 border-[#34C759] text-[#34C759]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {isChart ? (
            // Chart view: time ranges + SVG chart + side stats
            <ProductionChart
              data={productionData}
              stats={stats}
              isLoading={isLoading}
            />
          ) : (
            // Table view: full-width AG Grid, no side stats
            <ProductionTable data={productionData} isLoading={isLoading} />
          )}
        </div>
      </div>

      {/* ── Allocated Production + Stats (title changes per view) ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AllocatedProductionChart wells={allocatedWells} />
        <StatsPanel
          title={isChart ? "Key Production Stats" : "Chart Details"}
          stats={stats}
        />
      </div>

      {/* ── Lease Score + Return/Risk (title changes per view) ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <LeaseScoreCard leaseScore={leaseScore} />
        <ReturnRiskPanel
          title={isChart ? "Return/Risk" : "Key Stats"}
          returnRisk={returnRisk}
        />
      </div>

      {/* ── More Information ── */}
      <MoreInformation info={moreInfo} />
    </div>
  );
}
