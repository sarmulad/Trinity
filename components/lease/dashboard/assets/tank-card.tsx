"use client";

import { Card } from "../ui/card";
import { Sparkline } from "../ui/sparkline";
import type { OilTank, WaterTank } from "../types";

interface TankCardProps {
  tank: OilTank | WaterTank;
  onClick?: () => void;
}

export function TankCard({ tank, onClick }: TankCardProps) {
  return (
    <Card>
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={onClick}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-black dark:text-white">
              {tank.name}
            </p>
            <span className="text-xs text-black/30 dark:text-white/30">›</span>
          </div>
          {"prod" in tank && (
            <p className="text-xs text-black/50 dark:text-white/50">
              Prod: {tank.prod}
            </p>
          )}
          <p className="text-xs text-black/40 dark:text-white/40">
            {tank.timestamp}
          </p>
          <Sparkline />
        </div>
        <div className="text-right space-y-0.5">
          <p className="text-lg font-bold text-[#34C759]">{tank.levelFt}</p>
          <p className="text-xs text-black/40 dark:text-white/40">
            {tank.levelBbls}
          </p>
          <p className="text-xs text-[#34C759]/80">{tank.theftLevelFt}</p>
          <p className="text-xs text-black/40 dark:text-white/40">
            {tank.theftLevelBbls}
          </p>
        </div>
      </div>
    </Card>
  );
}
