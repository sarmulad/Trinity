"use client";

import React, { useState } from "react";
import {
  Flame,
  Droplet,
  BarChart3,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ArrowLeftRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorBoundary } from "@/components/error-boundary";
import { HierarchicalTable } from "@/components/dashboard/hierarchical-table";
import { ProductionChart } from "@/components/lease/production/production-chart";
import { ProductionTable } from "@/components/lease/production/production-table";
import {
  EXAMPLE_PRODUCTION,
  EXAMPLE_STATS,
} from "@/components/lease/production/types";
import { CompareToolModal } from "@/components/compare/compare-tool-modal";
import { useDashboardPreferences } from "@/lib/dashboard-preferences";

type Benchmark = { label: string; price: number; unit: string };

const OIL_BENCHMARKS: Benchmark[] = [
  { label: "WTI Oil", price: 85.42, unit: "BBL" },
  { label: "Brent Oil", price: 88.1, unit: "BBL" },
  { label: "Kansas Oil", price: 82.75, unit: "BBL" },
  { label: "Oklahoma Oil", price: 83.2, unit: "BBL" },
];

const GAS_BENCHMARKS: Benchmark[] = [
  { label: "Henry Hub", price: 2.54, unit: "MCF" },
  { label: "Natural Gas", price: 2.61, unit: "MCF" },
  { label: "NYMEX Gas", price: 2.48, unit: "MCF" },
];

type CardConfig = {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  benchmarks?: Benchmark[];
};

const summaryCards: CardConfig[] = [
  {
    title: "Oil Production",
    value: "100 BBLs",
    icon: <Droplet className="h-4 w-4 text-orange-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Gas Volume",
    value: "250 MCF",
    icon: <Flame className="h-4 w-4 text-blue-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Oil Stock",
    value: "1000 BBLs",
    icon: <BarChart3 className="h-4 w-4 text-yellow-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Oil Sales",
    value: "180 BBLs",
    icon: <TrendingUp className="h-4 w-4 text-cyan-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-cyan-500/10",
  },
  {
    title: "Gas Sold",
    value: "$345",
    icon: <DollarSign className="h-4 w-4 text-yellow-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-yellow-500/10",
    benchmarks: GAS_BENCHMARKS,
  },
  {
    title: "Oil Gain",
    value: "$500",
    icon: <DollarSign className="h-4 w-4 text-blue-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-blue-500/10",
    benchmarks: OIL_BENCHMARKS,
  },
];

function SummaryCard({ card }: { card: CardConfig }) {
  const { preferences } = useDashboardPreferences();
  const preferredLabel = card.title.toLowerCase().includes("gas")
    ? preferences.defaultGasBenchmark
    : preferences.defaultOilBenchmark;
  const [selectedLabel, setSelectedLabel] = useState<string>(preferredLabel);

  React.useEffect(() => {
    setSelectedLabel(preferredLabel);
  }, [preferredLabel]);

  const selected = React.useMemo(
    () =>
      card.benchmarks?.find((benchmark) => benchmark.label === selectedLabel) ??
      card.benchmarks?.[0],
    [card.benchmarks, selectedLabel],
  );

  return (
    <Card className="border-black/10 bg-white transition-colors hover:border-[#34C759]/50 dark:border-[#464646] dark:bg-[#1A1C1E]">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-black/60 dark:text-white/60">
              {card.title}
            </p>
            <p className="mt-1 truncate text-xl font-bold text-black dark:text-white lg:mt-2 lg:text-2xl">
              {card.value}
            </p>
            {card.benchmarks && selected && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="mt-2 flex items-center gap-1 rounded-md text-[11px] text-black/40 transition-colors hover:text-black dark:text-white/40 dark:hover:text-white">
                    <span className="font-medium text-[#34C759]">
                      ${selected.price.toFixed(2)}/{selected.unit}
                    </span>
                    <span className="hidden sm:inline">· {selected.label}</span>
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-48 border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]"
                >
                  {card.benchmarks.map((b) => (
                    <DropdownMenuItem
                      key={b.label}
                      onClick={() => setSelectedLabel(b.label)}
                      className={
                        b.label === selected.label
                          ? "text-[#34C759]"
                          : "text-black dark:text-white"
                      }
                    >
                      <span className="flex-1">{b.label}</span>
                      <span className="text-xs text-black/40 dark:text-white/40">
                        ${b.price.toFixed(2)}/{b.unit}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg lg:h-10 lg:w-10 ${card.bgColor}`}
          >
            {card.icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const NOTIFICATIONS = [
  {
    title: "Pump restart confirmed",
    detail:
      "Johnson Lease · Oil Tank #1 is back online after a manual restart.",
    time: "2 min ago",
  },
  {
    title: "Pressure trend needs review",
    detail: "EFM/Chart #201 is trending below the morning flow target.",
    time: "18 min ago",
  },
  {
    title: "Daily gauge entered manually",
    detail:
      "Water Tank #1 received a new manual gauge during route submission.",
    time: "41 min ago",
  },
];

type ProductionView = "chart" | "table";

export default function DailySummaryPage() {
  const [companyCompareOpen, setCompanyCompareOpen] = React.useState(false);
  const [productionView, setProductionView] =
    React.useState<ProductionView>("chart");

  return (
    <ErrorBoundary>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col gap-3 px-4 py-4 lg:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white lg:text-3xl">
                Trinity Energy
              </h1>
              <p className="text-sm text-black/45 dark:text-white/40">
                Production Period: Apr. 1 - Apr. 2
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCompanyCompareOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-gray-100 px-3 py-1.5 text-xs font-medium text-black/70 transition-colors hover:border-[#34C759]/50 hover:text-black dark:border-white/10 dark:bg-[#252930] dark:text-white/70 dark:hover:text-white"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Compare
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <SummaryCard key={card.title} card={card} />
          ))}
        </div>

        <div className="rounded-xl border border-black/10 bg-white/95 p-5 shadow-sm dark:border-white/10 dark:bg-[#1A1C1E]/95">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-black dark:text-white">
                Company Production
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-black/10 bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.04]">
              {(["chart", "table"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setProductionView(view)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    productionView === view
                      ? "bg-[#34C759] text-black"
                      : "text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white"
                  }`}
                >
                  {view === "chart" ? "Chart" : "Table"}
                </button>
              ))}
            </div>
          </div>

          {productionView === "chart" ? (
            <ProductionChart
              data={EXAMPLE_PRODUCTION}
              stats={EXAMPLE_STATS}
              chartHeight={420}
            />
          ) : (
            <ProductionTable data={EXAMPLE_PRODUCTION} height={540} />
          )}
        </div>

        {/* <div className="rounded-xl border border-black/10 bg-white/95 p-5 shadow-sm dark:border-white/10 dark:bg-[#1A1C1E]/95">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-black dark:text-white">
                Push Notifications
              </p>
              <p className="text-xs text-black/40 dark:text-white/40">
                Recent push events that would be delivered to users in the
                field.
              </p>
            </div>
            <span className="rounded-full bg-[#34C759]/12 px-2.5 py-1 text-[11px] font-semibold text-[#1f9e45] dark:text-[#7DFF9F]">
              {NOTIFICATIONS.length} Active
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {NOTIFICATIONS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-black dark:text-white">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-black/35 dark:text-white/35">
                    {item.time}
                  </span>
                </div>
                <p className="text-sm leading-6 text-black/60 dark:text-white/60">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div> */}

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            {/* <div>
              <p className="text-sm font-semibold text-black dark:text-white">
                Company Production Breakdown
              </p>
              <p className="text-xs text-black/40 dark:text-white/40">
                Areas, routes, and leases with direct lease navigation in the
                Group column.
              </p>
            </div> */}
          </div>
          <HierarchicalTable />
        </div>
      </div>
      <CompareToolModal
        open={companyCompareOpen}
        onOpenChange={setCompanyCompareOpen}
        scope="company"
      />
    </ErrorBoundary>
  );
}
