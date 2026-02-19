"use client";

import * as React from "react";
import Link from "next/link";
import {
  Flame,
  Droplet,
  BarChart3,
  DollarSign,
  TrendingUp,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/error-boundary";
import { cn } from "@/lib/utils";

interface HierarchicalRow {
  id: string;
  type: "area" | "route" | "lease";
  name: string;
  location?: string;
  oilProd?: string;
  gasVolume?: string;
  children?: HierarchicalRow[];
  expanded?: boolean;
}

const summaryCards = [
  {
    title: "Oil Prod",
    value: "100 BBLs",
    icon: <Droplet className="h-4 w-4 text-orange-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-orange-500/10",
    cardBg: "#1A1C1E",
  },
  {
    title: "Gas Volume",
    value: "250 MCF",
    icon: <Flame className="h-4 w-4 text-blue-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-blue-500/10",
    cardBg: "#1A1C1E",
  },
  {
    title: "Oil Stock",
    value: "1000 BBLs",
    icon: <BarChart3 className="h-4 w-4 text-yellow-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-yellow-500/10",
    cardBg: "#1A1C1E",
  },
  {
    title: "Oil Sales",
    value: "180 BBLs",
    icon: <TrendingUp className="h-4 w-4 text-cyan-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-cyan-500/10",
    cardBg: "#1A1C1E",
  },
  {
    title: "Gas Sold",
    value: "$345",
    icon: <DollarSign className="h-4 w-4 text-yellow-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-yellow-500/10",
    cardBg: "#1A1C1E",
  },
  {
    title: "Oil Gain",
    value: "$500",
    icon: <DollarSign className="h-4 w-4 text-blue-500 lg:h-5 lg:w-5" />,
    bgColor: "bg-blue-500/10",
    cardBg: "#1A1C1E",
  },
];

const mockHierarchyData: HierarchicalRow[] = [
  {
    id: "area-1",
    type: "area",
    name: "Area",
    expanded: true,
    children: [
      {
        id: "texas",
        type: "area",
        name: "Texas",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
      {
        id: "oklahoma",
        type: "area",
        name: "Oklahoma",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
    ],
  },
  {
    id: "routes-1",
    type: "route",
    name: "Routes",
    expanded: false,
    children: [
      {
        id: "david-route",
        type: "route",
        name: "David Route",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
      {
        id: "john-route",
        type: "route",
        name: "John Route",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
    ],
  },
  {
    id: "leases-1",
    type: "lease",
    name: "Leases",
    expanded: true,
    children: [
      {
        id: "johnson",
        type: "lease",
        name: "Johnson Lease",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
      {
        id: "david",
        type: "lease",
        name: "David Lease",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
      {
        id: "riordan",
        type: "lease",
        name: "Riordan Lease",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
      {
        id: "mark",
        type: "lease",
        name: "Mark Lease",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
      {
        id: "roland",
        type: "lease",
        name: "Roland Lease",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
      {
        id: "ben",
        type: "lease",
        name: "Ben Lease",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
      {
        id: "riordan2",
        type: "lease",
        name: "Riordan Lease",
        location: "35.0090° N, 97.0801° W",
        oilProd: "3,500 BBLs",
        gasVolume: "250 MCF",
      },
    ],
  },
];

function SortIcon({ direction }: { direction?: "asc" | "desc" }) {
  return (
    <span className="ml-1.5 inline-flex flex-col gap-[2px]">
      <span
        className={cn(
          "block h-0 w-0 border-x-[3.5px] border-x-transparent border-b-[4px]",
          direction === "asc" ? "border-b-[#34C759]" : "border-b-white/25"
        )}
      />
      <span
        className={cn(
          "block h-0 w-0 border-x-[3.5px] border-x-transparent border-t-[4px]",
          direction === "desc" ? "border-t-[#34C759]" : "border-t-white/25"
        )}
      />
    </span>
  );
}

function HierarchicalTable() {
  const [data, setData] = React.useState<HierarchicalRow[]>(mockHierarchyData);
  const [sort, setSort] = React.useState<{
    col: string;
    dir: "asc" | "desc";
  } | null>(null);

  const toggleRow = (id: string) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, expanded: !row.expanded } : row
      )
    );
  };

  const handleSort = (col: string) => {
    setSort((prev) =>
      prev?.col === col
        ? { col, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" }
    );
  };

  return (
    <div className="rounded-lg p-4 bg-[#21252A] overflow-hidden">
      {/* Table header */}
      <div className="hidden lg:grid grid-cols-[2fr_2fr_1fr_1fr]  px-6 py-3">
        {/* Col 1: empty — lines up with the name column */}
        <div className="px-4" />
        {/* Col 2: Location */}
        <button
          onClick={() => handleSort("location")}
          className="flex items-center px-4 text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
        >
          Location
          <SortIcon
            direction={sort?.col === "location" ? sort.dir : undefined}
          />
        </button>
        <button
          onClick={() => handleSort("oilProd")}
          className="flex items-center px-4 text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
        >
          Oil Prod
          <SortIcon
            direction={sort?.col === "oilProd" ? sort.dir : undefined}
          />
        </button>
        <button
          onClick={() => handleSort("gasVolume")}
          className="flex items-center px-4 text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
        >
          Gas Volume
          <SortIcon
            direction={sort?.col === "gasVolume" ? sort.dir : undefined}
          />
        </button>
      </div>

      {data.map((parentRow) => (
        <React.Fragment key={parentRow.id}>
          {/* Group header */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr] divide-x divide-white/10 bg-[#1E2126]">
            <button
              type="button"
              onClick={() => toggleRow(parentRow.id)}
              className="col-span-1 flex items-center gap-2 px-4 py-3 text-sm font-medium text-white/80 hover:text-[#34C759] transition-colors"
            >
              {parentRow.expanded ? (
                <ChevronDown className="h-4 w-4 text-[#34C759] shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#34C759] shrink-0" />
              )}
              {parentRow.name}
            </button>
            <div className="px-4 py-3" />
            <div className="px-4 py-3" />
            <div className="px-4 py-3" />
          </div>

          {/* Child rows */}
          {parentRow.expanded &&
            parentRow.children?.map((childRow, idx) => (
              <Link
                key={childRow.id}
                href={`/dashboard/lease/${childRow.id}`}
                className={cn(
                  "block hover:bg-white/5 transition-colors",
                  idx % 2 === 1 ? "bg-[#1E2126]" : "bg-[#21252A]"
                )}
              >
                {/* Mobile */}
                <div className="flex flex-col gap-1 px-6 py-3 lg:hidden">
                  <div className="flex items-center gap-1 pl-5 text-sm font-medium text-white">
                    {childRow.name}
                    <ChevronRight className="h-3.5 w-3.5 text-[#34C759]" />
                  </div>
                  <div className="pl-5 text-xs text-white/50">
                    {childRow.location}
                  </div>
                  <div className="pl-5 flex gap-4 text-xs text-white/50">
                    Oil: <span className="text-white">{childRow.oilProd}</span>
                    Gas:{" "}
                    <span className="text-white">{childRow.gasVolume}</span>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden lg:grid grid-cols-[2fr_2fr_1fr_1fr] items-center divide-x divide-white/10 ">
                  <div className="flex items-center gap-1 px-4 pl-9 py-3 text-sm text-white">
                    {childRow.name}
                    <ChevronRight className="h-3.5 w-3.5 text-[#34C759] shrink-0" />
                  </div>
                  <div className="px-4 py-3 text-sm text-white/50">
                    {childRow.location}
                  </div>
                  <div className="px-4 py-3 text-sm text-white">
                    {childRow.oilProd}
                  </div>
                  <div className="px-4 py-3 text-sm text-white">
                    {childRow.gasVolume}
                  </div>
                </div>
              </Link>
            ))}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function DailySummaryPage() {
  return (
    <ErrorBoundary>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white lg:text-3xl">
              Trinity Energy
            </h1>
            <p className="text-sm text-white/40">Nov 15</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-0 bg-transparent text-[#34C759] sm:w-auto"
          >
            View Company <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <Card
              key={card.title}
              className="border-[#464646] hover:border-[#34C759]/50 transition-colors"
              style={{ backgroundColor: card.cardBg }}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white/60">
                      {card.title}
                    </p>
                    <p className="mt-1 truncate text-xl font-bold text-white lg:mt-2 lg:text-2xl">
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
