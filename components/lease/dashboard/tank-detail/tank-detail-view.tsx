"use client";

import * as React from "react";
import { X, Maximize2, Minimize2, BarChart2, Table2 } from "lucide-react";
import { TankVisual } from "./tank-visual";
import { CurrentLevelPanel } from "./current-level-panel";
import { LabelsPanel } from "./labels-panel";
import { DataTable } from "./data-table";
import { LevelChart } from "./level-chart";
import { EXAMPLE_TANK_DETAIL } from "./example-data";
import type { TankDetailData } from "./types";

type Tab = "table" | "chart";

interface TankDetailViewProps {
  data?: TankDetailData;
  onClose?: () => void;
}

export function TankDetailView({
  data = EXAMPLE_TANK_DETAIL,
  onClose,
}: TankDetailViewProps) {
  const [showCurrentLevel, setShowCurrentLevel] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<Tab>("table");
  const [expanded, setExpanded] = React.useState(false);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "table",
      label: "Data Table",
      icon: <Table2 className="h-3.5 w-3.5" />,
    },
    {
      id: "chart",
      label: "Level Chart",
      icon: <BarChart2 className="h-3.5 w-3.5" />,
    },
  ];

  const content = (
    <div className="space-y-5 bg-[#16181d] min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">{data.name}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-sm text-white/40 hover:text-white/80 transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm text-[#34C759] hover:text-[#28a745] transition-colors"
          >
            Close <X className="h-4 w-4" />
          </button>
        </div>
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
          {showCurrentLevel ? (
            <CurrentLevelPanel
              data={data.currentLevel}
              onHide={() => setShowCurrentLevel(false)}
            />
          ) : (
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

      <div>
        <div className="flex items-center gap-1 border-b border-white/10 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1.5 px-4 py-2 text-xs font-medium
                border-b-2 -mb-px transition-colors
                ${
                  activeTab === tab.id
                    ? "border-[#34C759] text-[#34C759]"
                    : "border-transparent text-white/40 hover:text-white/70"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "table" && (
          <DataTable rows={data.tableData} totalEntries={data.totalEntries} />
        )}
        {activeTab === "chart" && (
          <LevelChart data={data.chartData} xAxisLabel="Oil Tank (FT)" />
        )}
      </div>
    </div>
  );

  if (expanded) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />

        <div
          className="
            fixed z-50
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[76vw] h-[85vh]
            rounded-xl overflow-auto shadow-2xl
            border border-white/10
            bg-[#16181d]
          "
          style={{ maxWidth: "1200px" }}
        >
          {content}
        </div>
      </>
    );
  }

  return content;
}
