"use client";

import * as React from "react";
import { X } from "lucide-react";
import { TankVisual } from "./tank-visual";
import { CurrentLevelPanel } from "./current-level-panel";
import { LabelsPanel } from "./labels-panel";
import { DataTable } from "./data-table";
import { LevelChart } from "./level-chart";
import { EXAMPLE_TANK_DETAIL } from "./example-data";
import type { TankDetailData } from "./types";

interface TankDetailViewProps {
  data?: TankDetailData;
  onClose?: () => void;
}

export function TankDetailView({
  data = EXAMPLE_TANK_DETAIL,
  onClose,
}: TankDetailViewProps) {
  const [showCurrentLevel, setShowCurrentLevel] = React.useState(true);

  return (
    <div className="space-y-5 bg-[#16181d] min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">{data.name}</h1>
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-sm text-[#34C759] hover:text-[#28a745]"
        >
          Close <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="shrink-0">
          <TankVisual fillRatio={0.48} alarmRatio={0.08} exitRatio={0.2} />
          <p className="mt-3 text-xs text-white/50">
            Top Gauge:{" "}
            <span className="font-semibold text-white">{data.topGaugeFt}</span>
            {"  "}Top Gauge{" "}
            <span className="font-semibold text-white">
              {data.topGaugeBbls}
            </span>
            {"  "}Prod:{" "}
            <span className="font-semibold text-white">{data.prodBbls}</span>
          </p>
        </div>

        <div className="flex-1 space-y-5">
          {showCurrentLevel && (
            <CurrentLevelPanel
              data={data.currentLevel}
              onHide={() => setShowCurrentLevel(false)}
            />
          )}
          {!showCurrentLevel && (
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-white">Current Level</p>
              <button
                onClick={() => setShowCurrentLevel(true)}
                className="text-xs text-[#34C759] hover:text-[#28a745]"
              >
                Show ∨
              </button>
            </div>
          )}
          <LabelsPanel labels={data.labels} />
        </div>
      </div>

      <DataTable rows={data.tableData} totalEntries={data.totalEntries} />

      <LevelChart data={data.chartData} xAxisLabel="Oil Tank (FT)" />
    </div>
  );
}
