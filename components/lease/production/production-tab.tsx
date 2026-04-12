"use client";

import * as React from "react";
import { ChevronsDown } from "lucide-react";

import { ProductionChart } from "./production-chart";
import { ProductionTable } from "./production-table";
import { AllocatedProductionChart } from "./allocated-production-chart";
import { StatsPanel } from "./stats-panel";
// import { LeaseScoreCard } from "./lease-score";
// import { ReturnRiskPanel } from "./return-risk-panel";
import { MoreInformation } from "./more-information";
import { OilTankTable } from "./oil-tanks-tab";
import { GasMeterTable } from "./gas-meters-tab";

import {
  ProductionTabProps,
  EXAMPLE_PRODUCTION,
  EXAMPLE_STATS,
  EXAMPLE_SCORE,
  EXAMPLE_RETURN_RISK,
  EXAMPLE_ALLOCATED,
  EXAMPLE_MORE_INFO,
  EXAMPLE_OILTANKS,
  EXAMPLE_GASMETER,
} from "./types";

type View = "chart" | "table" | "oil-tanks" | "gas-meters";

const VIEWS: { id: View; label: string }[] = [
  { id: "chart", label: "Chart" },
  { id: "table", label: "Table" },
  { id: "oil-tanks", label: "Oil Tanks" },
  { id: "gas-meters", label: "Gas Meters" },
];

export function ProductionTab({
  productionData = EXAMPLE_PRODUCTION,
  stats = EXAMPLE_STATS,
  // leaseScore = EXAMPLE_SCORE,
  // returnRisk = EXAMPLE_RETURN_RISK,
  allocatedWells = EXAMPLE_ALLOCATED,
  moreInfo = EXAMPLE_MORE_INFO,
  isLoading = false,
}: ProductionTabProps) {
  const [view, setView] = React.useState<View>("chart");

  const showProductionExtras = view === "chart" || view === "table";
  const primaryPanelHeight =
    view === "chart" ? 700 : view === "table" ? 760 : 780;

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-black dark:text-white">
        Production
      </p>

      <div className="relative rounded-xl border border-black/10 bg-black/5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-6 border-b border-black/10 px-6 pt-4 dark:border-white/10">
          {VIEWS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`pb-3 text-sm font-medium transition-colors ${
                view === id
                  ? "border-b-2 border-[#34C759] text-[#34C759]"
                  : "text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6" style={{ minHeight: primaryPanelHeight }}>
          {view === "chart" && (
            <ProductionChart
              data={productionData}
              stats={stats}
              isLoading={isLoading}
              chartHeight={560}
            />
          )}
          {view === "table" && (
            <ProductionTable
              data={productionData}
              isLoading={isLoading}
              height={680}
            />
          )}
          {view === "oil-tanks" && (
            <OilTankTable
              data={EXAMPLE_OILTANKS}
              isLoading={isLoading}
              height={700}
            />
          )}
          {view === "gas-meters" && (
            <GasMeterTable
              data={EXAMPLE_GASMETER}
              isLoading={isLoading}
              height={700}
            />
          )}
        </div>

        {showProductionExtras && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 py-1.5 text-[11px] font-medium text-black/45 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#1e2025]/90 dark:text-white/45">
              More production detail below
              <ChevronsDown className="h-3.5 w-3.5 animate-bounce text-[#34C759]" />
            </div>
          </div>
        )}
      </div>

      {showProductionExtras && (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
            <AllocatedProductionChart wells={allocatedWells} />
            <StatsPanel
              title={
                view === "chart" ? "Key Production Stats" : "Chart Details"
              }
              stats={stats}
            />
          </div>

          {/* <div className="grid gap-4 lg:grid-cols-2">
            <LeaseScoreCard leaseScore={leaseScore} />
            <ReturnRiskPanel
              title={view === "chart" ? "Return/Risk" : "Key Stats"}
              returnRisk={returnRisk}
            />
          </div> */}

          <MoreInformation info={moreInfo} />
        </>
      )}
    </div>
  );
}
