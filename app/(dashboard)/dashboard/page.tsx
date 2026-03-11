"use client";

import * as React from "react";
import {
  Flame,
  Droplet,
  BarChart3,
  DollarSign,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/error-boundary";
import { HierarchicalTable } from "@/components/dashboard/hierarchical-table";

const summaryCards = [
  {
    title: "Oil Prod",
    value: "100 BBLs",
    icon: <Droplet className="h-4 w-4 text-orange-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Gas Volume",
    value: "250 MCF",
    icon: <Flame className="h-4 w-4 text-blue-500   lg:h-5 lg:w-5" />,
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
    icon: <TrendingUp className="h-4 w-4 text-cyan-500   lg:h-5 lg:w-5" />,
    bgColor: "bg-cyan-500/10",
  },
  {
    title: "Gas Sold",
    value: "$345",
    icon: <DollarSign className="h-4 w-4 text-yellow-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Oil Gain",
    value: "$500",
    icon: <DollarSign className="h-4 w-4 text-blue-500   lg:h-5 lg:w-5" />,
    bgColor: "bg-blue-500/10",
  },
];

export default function DailySummaryPage() {
  return (
    <ErrorBoundary>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white lg:text-3xl">
              Trinity Energy
            </h1>
            <p className="text-sm text-black/40 dark:text-white/40">Nov 15</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-0 bg-transparent text-[#34C759] sm:w-auto"
          >
            View Company <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <Card
              key={card.title}
              className="border-black/10 bg-white transition-colors hover:border-[#34C759]/50 dark:border-[#464646] dark:bg-[#1A1C1E]"
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-black/60 dark:text-white/60">
                      {card.title}
                    </p>
                    <p className="mt-1 truncate text-xl font-bold text-black dark:text-white lg:mt-2 lg:text-2xl">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg lg:h-10 lg:w-10 ${card.bgColor}`}
                  >
                    {card.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <HierarchicalTable />
      </div>
    </ErrorBoundary>
  );
}
