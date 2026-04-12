"use client";

import { Card } from "../ui/card";
import { Sparkline } from "../ui/sparkline";
import type { OilTank, WaterTank } from "../types";

interface TankCardProps {
  tank: OilTank | WaterTank;
  onClick?: () => void;
}

function parseLeadingNumber(value: string): number | null {
  const match = value.match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function TankCard({ tank, onClick }: TankCardProps) {
  const level = parseLeadingNumber(tank.levelFt);
  const theftLevel = parseLeadingNumber(tank.theftLevelFt);
  const base = level ?? 6;
  const floor = theftLevel ?? Math.max(base * 0.35, 1);

  const sparklinePoints = [
    Math.max(floor, base * 0.81),
    Math.max(floor, base * 0.835),
    Math.max(floor, base * 0.825),
    Math.max(floor, base * 0.865),
    Math.max(floor, base * 0.852),
    Math.max(floor, base * 0.89),
  ];

  return (
    <Card
      className="min-h-[220px]"
      interactive={!!onClick}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="outline-none">
        <div className="space-y-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black dark:text-white">
                {tank.name}
              </p>
              <p className="mt-1 text-xs text-black/45 dark:text-white/45">
                Top Gauge
              </p>
            </div>
            <p className="text-right text-xs text-black/40 dark:text-white/40">
              {tank.timestamp}
            </p>

            <div className="leading-tight">
              <p className="text-lg font-bold text-[#34C759]">{tank.levelFt}</p>
              <p className="text-xs text-black/45 dark:text-white/45">
                {tank.levelBbls}
              </p>
            </div>
          </div>

          <div className="overflow-hidden px-1 py-1">
            <Sparkline
              color="#34C759"
              points={sparklinePoints}
              height={44}
              className="w-full"
              tooltipFormatter={(value, index) =>
                `Point ${index + 1}: ${value.toFixed(2)} FT`
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="px-1 pt-1">
              <p className="font-semibold text-black dark:text-white">
                {tank.levelBbls}
              </p>
            </div>
            <div className="px-1 pt-1 text-right">
              <p className="font-semibold text-black dark:text-white">
                {tank.theftLevelFt}
              </p>
              <p className="text-[11px] text-black/45 dark:text-white/45">
                {tank.theftLevelBbls}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
