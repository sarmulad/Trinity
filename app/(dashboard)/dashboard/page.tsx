"use client";

import React, { useState } from "react";
import {
  Flame,
  Droplet,
  BarChart3,
  DollarSign,
  TrendingUp,
  ChevronDown,
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
import {
  EXAMPLE_PRODUCTION,
  EXAMPLE_STATS,
} from "@/components/lease/production/types";

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
  benchmarks: Benchmark[];
};

const summaryCards: CardConfig[] = [
  {
    title: "Oil Prod",
    value: "100 BBLs",
    icon: <Droplet className="h-4 w-4 text-orange-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-orange-500/10",
    benchmarks: OIL_BENCHMARKS,
  },
  {
    title: "Gas Volume",
    value: "250 MCF",
    icon: <Flame className="h-4 w-4 text-blue-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-blue-500/10",
    benchmarks: GAS_BENCHMARKS,
  },
  {
    title: "Oil Stock",
    value: "1000 BBLs",
    icon: <BarChart3 className="h-4 w-4 text-yellow-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-yellow-500/10",
    benchmarks: OIL_BENCHMARKS,
  },
  {
    title: "Oil Sales",
    value: "180 BBLs",
    icon: <TrendingUp className="h-4 w-4 text-cyan-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-cyan-500/10",
    benchmarks: OIL_BENCHMARKS,
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
  const [selected, setSelected] = useState<Benchmark>(card.benchmarks[0]);

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
                    onClick={() => setSelected(b)}
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

type Tab = "company" | "production";

const TABS: { id: Tab; label: string }[] = [
  { id: "company", label: "Company" },
  { id: "production", label: "Production" },
];

export default function DailySummaryPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>("company");
  const [isLoading, setIsLoading] = React.useState(false);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return (
    <ErrorBoundary>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white lg:text-3xl">
              Trinity Energy
            </h1>
            <p className="text-sm text-black/40 dark:text-white/40">
              {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-1 border-b border-black/10 dark:border-white/10">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-[#34C759] text-[#34C759]"
                    : "border-transparent text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "company" && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {summaryCards.map((card) => (
                <SummaryCard key={card.title} card={card} />
              ))}
            </div>
            <HierarchicalTable />
          </>
        )}

        {activeTab === "production" && (
          <ProductionChart
            data={EXAMPLE_PRODUCTION}
            stats={EXAMPLE_STATS}
            isLoading={isLoading}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
