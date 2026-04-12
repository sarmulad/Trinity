"use client";

import * as React from "react";

import { AllocationSection } from "./types";

function DonutChart({
  segments,
}: {
  segments: { name: string; pct: number; color: string }[];
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="18"
        className="dark:stroke-white/10"
      />
      {segments.map((segment) => {
        const dash = (segment.pct / 100) * circumference;
        const currentOffset = offset;
        offset += dash;

        return (
          <circle
            key={segment.name}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="18"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-currentOffset}
          />
        );
      })}
    </svg>
  );
}

interface AllocatedProductionChartProps {
  wells: AllocationSection[];
}

export function AllocatedProductionChart({
  wells,
}: AllocatedProductionChartProps) {
  const sectionMap = React.useMemo(
    () => Object.fromEntries(wells.map((section) => [section.id, section])),
    [wells],
  );

  const oilSection = sectionMap.oil ?? wells[0];
  const gasSection = sectionMap.gas;
  const waterSection = sectionMap.water;

  const rowNames = React.useMemo(() => {
    const names = new Set<string>();
    wells.forEach((section) => {
      section.wells.forEach((well) => names.add(well.name));
    });
    return Array.from(names);
  }, [wells]);

  const rows = React.useMemo(
    () =>
      rowNames.map((name) => {
        const oil = oilSection?.wells.find((well) => well.name === name);
        const gas = gasSection?.wells.find((well) => well.name === name);
        const water = waterSection?.wells.find((well) => well.name === name);

        return {
          name,
          color: oil?.color ?? gas?.color ?? water?.color ?? "#34C759",
          oilPct: oil?.pct ?? 0,
          gasPct: gas?.pct ?? 0,
          waterPct: water?.pct ?? 0,
        };
      }),
    [rowNames, oilSection, gasSection, waterSection],
  );

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#1e2025]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-black dark:text-white">
          Allocated Production Chart
        </span>
        {/* <div className="flex items-center gap-3 text-[10px] text-black/35 dark:text-white/35">
          {oilSection?.total ? <span>Oil {oilSection.total}</span> : null}
          {gasSection?.total ? <span>Gas {gasSection.total}</span> : null}
          {waterSection?.total ? <span>Water {waterSection.total}</span> : null}
        </div> */}
      </div>

      <div className="grid gap-5 lg:grid-cols-[140px_minmax(0,1fr)] lg:items-center">
        <div className="flex justify-center">
          <DonutChart segments={oilSection?.wells ?? []} />
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[420px]">
            <div className="grid grid-cols-[minmax(150px,1.3fr)_repeat(3,minmax(72px,0.7fr))] gap-x-4 border-b border-black/10 pb-3 text-xs font-medium text-black/45 dark:border-white/10 dark:text-white/45">
              <span>Well</span>
              <span className="text-right">Oil</span>
              <span className="text-right">Gas</span>
              <span className="text-right">Water</span>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/5">
              {rows.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-[minmax(150px,1.3fr)_repeat(3,minmax(72px,0.7fr))] items-center gap-x-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="text-sm text-black/75 dark:text-white/75">
                      {row.name}
                    </span>
                  </div>
                  <span className="text-right text-sm font-medium text-black dark:text-white">
                    {row.oilPct}%
                  </span>
                  <span className="text-right text-sm font-medium text-black dark:text-white">
                    {row.gasPct}%
                  </span>
                  <span className="text-right text-sm font-medium text-black dark:text-white">
                    {row.waterPct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
