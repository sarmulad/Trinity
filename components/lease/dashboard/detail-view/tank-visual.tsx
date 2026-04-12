import * as React from "react";
import { useTheme } from "next-themes";
import type { TankLabel } from "./types";

interface TankVisualProps {
  fillRatio?: number;
  alarmRatio?: number;
  exitRatio?: number;
  maxLevel?: number;
  labels?: TankLabel[];
  levelText?: string;
}

function parseLevelToFeet(value: string): number | null {
  const normalized = value.trim().toUpperCase();
  const ftInMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:FT|')\s*(?:(\d+(?:\.\d+)?)\s*(?:IN|"))?/);
  if (ftInMatch) {
    const feet = Number(ftInMatch[1] ?? 0);
    const inches = Number(ftInMatch[2] ?? 0);
    if (Number.isFinite(feet) && Number.isFinite(inches)) {
      return feet + inches / 12;
    }
  }

  const rawMatch = normalized.match(/-?\d+(?:\.\d+)?/);
  if (!rawMatch) return null;
  const parsed = Number(rawMatch[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function TankVisual({
  fillRatio = 0.48,
  alarmRatio = 0.08,
  exitRatio = 0.18,
  maxLevel = 10,
  labels = [],
  levelText,
}: TankVisualProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const tankH = 182;
  const tankW = 148;
  const tankX = 14;
  const tankY = 16;
  const fillH = tankH * fillRatio;
  const fillTopY = tankY + (tankH - fillH);
  const rightAxisX = tankX + tankW + 14;
  const levels = [10, 8, 6, 4, 2, 0];
  const lineColor = isDark ? "rgba(255,255,255,0.8)" : "rgba(31,41,55,0.7)";
  const shellFill = isDark ? "#111418" : "#ffffff";
  const shellStroke = isDark ? "rgba(255,255,255,0.45)" : "rgba(55,65,81,0.55)";
  const waterFill = "#48a8da";
  const waterTopFill = "#8ad2ee";

  const positionedLabels = labels
    .map((label) => {
      const levelFeet = parseLevelToFeet(label.level);
      if (levelFeet === null) return null;
      const clamped = Math.max(0, Math.min(maxLevel, levelFeet));
      const y = tankY + tankH - (clamped / maxLevel) * tankH;
      return { ...label, y };
    })
    .filter(Boolean) as Array<TankLabel & { y: number }>;

  const parsedLevelText = levelText ? parseLevelToFeet(levelText) : null;
  const displayedLevelText =
    parsedLevelText !== null
      ? `${parsedLevelText.toFixed(2)} FT`
      : levelText ?? `${(Math.round(fillRatio * maxLevel * 100) / 100).toFixed(2)} FT`;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={230}
        height={246}
        viewBox="0 0 230 246"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="tank-body-clip">
            <path d={`M ${tankX} ${tankY + 10} A ${tankW / 2} 12 0 0 1 ${tankX + tankW} ${tankY + 10} L ${tankX + tankW} ${tankY + tankH} A ${tankW / 2} 10 0 0 1 ${tankX} ${tankY + tankH} Z`} />
          </clipPath>
        </defs>

        <ellipse
          cx={tankX + tankW / 2}
          cy={tankY}
          rx={tankW / 2}
          ry={10}
          fill={shellFill}
          stroke={shellStroke}
          strokeWidth="1"
        />

        <rect
          x={tankX}
          y={tankY}
          width={tankW}
          height={tankH}
          fill={shellFill}
          clipPath="url(#tank-body-clip)"
        />
        <g clipPath="url(#tank-body-clip)">
          <rect
            x={tankX}
            y={fillTopY}
            width={tankW}
            height={tankY + tankH - fillTopY + 16}
            fill={waterFill}
            opacity={0.94}
          />
          <path
            d={`M ${tankX} ${fillTopY} C ${tankX + tankW * 0.2} ${fillTopY - 8}, ${tankX + tankW * 0.45} ${fillTopY + 6}, ${tankX + tankW * 0.65} ${fillTopY} C ${tankX + tankW * 0.82} ${fillTopY - 5}, ${tankX + tankW * 0.92} ${fillTopY + 5}, ${tankX + tankW} ${fillTopY} L ${tankX + tankW} ${fillTopY + 16} L ${tankX} ${fillTopY + 16} Z`}
            fill={waterTopFill}
            opacity={0.9}
          />

          {positionedLabels.map((label) => (
            <g key={label.id}>
              <line
                x1={tankX + 6}
                y1={label.y}
                x2={tankX + tankW - 6}
                y2={label.y}
                stroke={label.color}
                strokeDasharray="4 4"
                strokeWidth="1.2"
                opacity="0.9"
              />
              <text
                x={tankX + tankW / 2}
                y={label.y - 4}
                textAnchor="middle"
                fontSize="10"
                fill={isDark ? "rgba(255,255,255,0.82)" : "rgba(31,41,55,0.72)"}
              >
                {label.name} {label.level}
              </text>
            </g>
          ))}
        </g>

        <ellipse
          cx={tankX + tankW / 2}
          cy={tankY + tankH}
          rx={tankW / 2}
          ry={8}
          fill={waterFill}
          opacity={0.94}
          stroke={shellStroke}
          strokeWidth="1"
        />

        <ellipse
          cx={tankX + tankW / 2}
          cy={tankY}
          rx={tankW / 2}
          ry={10}
          fill="none"
          stroke={shellStroke}
          strokeWidth="1"
        />

        <line
          x1={tankX}
          y1={tankY}
          x2={tankX}
          y2={tankY + tankH}
          stroke={shellStroke}
          strokeWidth="1"
        />
        <line
          x1={tankX + tankW}
          y1={tankY}
          x2={tankX + tankW}
          y2={tankY + tankH}
          stroke={shellStroke}
          strokeWidth="1"
        />

        <line
          x1={tankX + tankW + 4}
          y1={tankY + tankH}
          x2={rightAxisX}
          y2={tankY + tankH}
          stroke={shellStroke}
          strokeWidth="1"
        />
        {levels.map((level) => {
          const y = tankY + tankH - (level / maxLevel) * tankH;
          return (
            <g key={level}>
              <line
                x1={tankX + tankW + 4}
                y1={y}
                x2={rightAxisX - 4}
                y2={y}
                stroke={shellStroke}
                strokeWidth="1"
              />
              <text
                x={rightAxisX}
                y={y + 3}
                fontSize="12"
                fill={lineColor}
              >
                {level}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-black dark:text-white">
        {displayedLevelText}
      </p>
      <p className="text-sm text-black/45 dark:text-white/45">Tank Level</p>
    </div>
  );
}
