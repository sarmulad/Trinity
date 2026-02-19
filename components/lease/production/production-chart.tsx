"use client";

import * as React from "react";
import { ProductionRecord, ProductionStats, TIME_RANGES } from "./types";

// ─── SVG Line Chart ───────────────────────────────────────────────────────────

function SvgProductionChart({ data }: { data: ProductionRecord[] }) {
  if (!data.length) return null;

  const maxVal = Math.max(...data.map((d) => d.h2o));
  const W = 660;
  const H = 180;
  const pad = { t: 16, b: 28, l: 44, r: 8 };

  const x = (i: number) =>
    pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / maxVal) * (H - pad.t - pad.b);

  const yTicks = [0, 100, 200, 300, 400, 500];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      {/* Y-axis grid + labels */}
      {yTicks.map((tick) => {
        const scaledY = y((tick / 500) * maxVal);
        return (
          <g key={tick}>
            <line
              x1={pad.l}
              y1={scaledY}
              x2={W - pad.r}
              y2={scaledY}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={pad.l - 6}
              y={scaledY + 4}
              fill="rgba(255,255,255,0.25)"
              fontSize="9"
              textAnchor="end"
            >
              {tick}
            </text>
          </g>
        );
      })}

      {/* Vertical dashed column markers */}
      {data.map((_, i) => (
        <line
          key={i}
          x1={x(i)}
          y1={pad.t}
          x2={x(i)}
          y2={H - pad.b}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      ))}

      {/* H2O — blue */}
      <polyline
        points={data.map((d, i) => `${x(i)},${y(d.h2o)}`).join(" ")}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />
      {/* Oil — green */}
      <polyline
        points={data.map((d, i) => `${x(i)},${y(d.oil)}`).join(" ")}
        fill="none"
        stroke="#34C759"
        strokeWidth="1.5"
      />
      {/* Gas — grey */}
      <polyline
        points={data.map((d, i) => `${x(i)},${y(d.gas)}`).join(" ")}
        fill="none"
        stroke="#6b7280"
        strokeWidth="1.5"
      />

      {/* X-axis date labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={x(i)}
          y={H - 6}
          fill="rgba(255,255,255,0.25)"
          fontSize="8"
          textAnchor="middle"
        >
          {d.date}
        </text>
      ))}
    </svg>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductionChartProps {
  data: ProductionRecord[];
  stats: ProductionStats;
  isLoading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductionChart({
  data,
  stats,
  isLoading = false,
}: ProductionChartProps) {
  const [activeRange, setActiveRange] = React.useState("Y");

  // TODO: when activeRange changes, re-fetch from Tago.io with the new date range
  // e.g. fetch(`/api/tago/production?leaseId=${leaseId}&range=${activeRange}`)

  const LEGEND = [
    { color: "#3b82f6", label: "H2O" },
    { color: "#34C759", label: "Oil" },
    { color: "#6b7280", label: "Gas" },
    { color: "rgba(255,255,255,0.2)", label: "Msg" },
    { color: "#ef4444", label: "Alarms", red: true },
  ];

  return (
    <>
      {/* Time range buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TIME_RANGES.map((r, i) => (
          <button
            key={`${r}-${i}`}
            onClick={() => setActiveRange(r)}
            className={`h-8 min-w-[36px] rounded px-3 text-xs font-medium transition-colors ${
              activeRange === r
                ? "bg-[#34C759] text-black"
                : "border border-white/10 bg-transparent text-white/40 hover:bg-white/5"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart + side stats */}
      <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
        {/* Chart area */}
        <div className="min-h-[260px] rounded-lg bg-[#252930] p-4">
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-white/20">
              Loading…
            </div>
          ) : (
            <>
              <div className="h-[200px]">
                <SvgProductionChart data={data} />
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/40">
                {LEGEND.map(({ color, label, red }) => (
                  <span
                    key={label}
                    className={`flex items-center gap-1.5 ${
                      red ? "text-red-400" : ""
                    }`}
                  >
                    <span
                      className="inline-block h-1.5 w-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Side stats — only visible in chart view */}
        <div className="space-y-3">
          {[
            { label: "Oil Stock", value: stats.oilStock },
            { label: "Avg. Runs/Day", value: stats.avgRunsDay },
            { label: "Yest. Runs", value: stats.yesterdayRuns },
            { label: "Avg. Flow Time", value: stats.avgFlowTime },
            { label: "Avg. Prod. Time", value: stats.avgProdTime },
            { label: "Avg. Oil Prod.", value: stats.avgOilProd },
            { label: "Oil Tank #1 Stock", value: stats.oilTank1Stock },
            { label: "Oil Tank #1 Prod", value: stats.oilTank1Prod },
            { label: "Oil Tank #2 Stock", value: stats.oilTank2Stock },
            { label: "Oil Tank #2 Prod", value: stats.oilTank2Prod },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] text-white/40">{item.label}</p>
              <p className="text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
