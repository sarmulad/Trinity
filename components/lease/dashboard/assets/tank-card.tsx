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
    Math.max(floor, base * 0.78),
    Math.max(floor, base * 0.82),
    Math.max(floor, base * 0.8),
    Math.max(floor, base * 0.86),
    Math.max(floor, base * 0.84),
    Math.max(floor, base * 0.9),
    Math.max(floor, base * 0.88),
    Math.max(floor, base * 0.93),
  ];

  return (
    <Card>
      <div className="cursor-pointer" onClick={onClick}>
        <div className="space-y-2.5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1">
            <div className="min-w-0 flex items-center gap-1">
              <p className="text-sm font-semibold text-black dark:text-white truncate">
                {tank.name}
              </p>
              <span className="text-xs text-black/30 dark:text-white/30">›</span>
            </div>
            <p className="text-right text-xs text-black/40 dark:text-white/40">
              {tank.timestamp}
            </p>

            <div />
            <div className="text-right leading-tight">
              <p className="text-lg font-bold text-[#34C759]">{tank.levelFt}</p>
              <p className="text-xs text-[#34C759]/80">{tank.theftLevelFt}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Sparkline color="#34C759" points={sparklinePoints} width={96} />
          </div>

          <div className="flex items-center justify-between gap-3 text-xs">
            <p className="text-black/40 dark:text-white/40">{tank.levelBbls}</p>
            <p className="text-black/40 dark:text-white/40">
              {tank.theftLevelBbls}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
