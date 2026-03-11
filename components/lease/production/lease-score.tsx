"use client";

import { LeaseScore } from "./types";

function ScoreBar({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  const isLow = value < 50;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-black/40 dark:text-white/40">{icon}</span>
        <span className="text-sm text-black/70 dark:text-white/70">
          {label}
        </span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10">
        <div
          className="absolute left-0 top-0 h-1.5 rounded-full"
          style={{
            width: `${value}%`,
            background: isLow
              ? "linear-gradient(90deg, #ef4444, #dc2626)"
              : "linear-gradient(90deg, #f59e0b, #eab308, #34C759)",
          }}
        />
      </div>
      <div className="text-right text-xs text-black/40 dark:text-white/40">
        {value}
      </div>
    </div>
  );
}

interface LeaseScoreCardProps {
  leaseScore: LeaseScore;
}

export function LeaseScoreCard({ leaseScore }: LeaseScoreCardProps) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#1e2025]">
      <p className="mb-4 text-sm font-bold text-black dark:text-white">
        Trinity Lease Score
      </p>
      <div className="space-y-4">
        <ScoreBar
          label="Production Performance"
          value={leaseScore.productionPerformance}
          icon={<span className="text-[10px]">⬤</span>}
        />
        <ScoreBar
          label="Uptime & Reliability"
          value={leaseScore.uptimeReliability}
          icon={<span className="text-[10px]">⬤</span>}
        />
        <ScoreBar
          label="Data Accuracy"
          value={leaseScore.dataAccuracy}
          icon={<span className="text-[10px]">⬤</span>}
        />
        <ScoreBar
          label="Alarms & Safety"
          value={leaseScore.alarmsAndSafety}
          icon={<span className="text-[10px]">🔔</span>}
        />
      </div>
    </div>
  );
}
