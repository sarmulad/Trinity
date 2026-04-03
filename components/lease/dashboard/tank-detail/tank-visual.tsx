import * as React from "react";

interface TankVisualProps {
  fillRatio?: number;
  alarmRatio?: number;
  exitRatio?: number;
  maxLevel?: number;
}

export function TankVisual({
  fillRatio = 0.48,
  alarmRatio = 0.08,
  exitRatio = 0.18,
  maxLevel = 10,
}: TankVisualProps) {
  const tankH = 140;
  const tankW = 90;
  const fillH = tankH * fillRatio;

  const levels = Array.from({ length: maxLevel + 1 }, (_, i) => maxLevel - i);

  return (
    <div className="flex gap-3 items-start">
      <svg
        width={tankW + 8}
        height={tankH + 32}
        viewBox={`0 0 ${tankW + 8} ${tankH + 32}`}
      >
        {/* Top ellipse rim */}
        <ellipse
          cx={(tankW + 8) / 2}
          cy={16}
          rx={tankW / 2}
          ry={10}
          fill="#3a4050"
          stroke="#555"
          strokeWidth="1"
        />

        <rect x={4} y={16} width={tankW} height={tankH} fill="#2a2d35" />

        <rect
          x={4}
          y={16 + (tankH - fillH)}
          width={tankW}
          height={fillH}
          fill="#4a9eff"
          opacity={0.35}
        />

        <ellipse
          cx={(tankW + 8) / 2}
          cy={16 + tankH}
          rx={tankW / 2}
          ry={8}
          fill="#3a4050"
          stroke="#444"
          strokeWidth="1"
        />

        <ellipse
          cx={(tankW + 8) / 2}
          cy={16}
          rx={tankW / 2}
          ry={10}
          fill="none"
          stroke="#666"
          strokeWidth="1"
        />

        <line
          x1={4}
          y1={16}
          x2={4}
          y2={16 + tankH}
          stroke="#555"
          strokeWidth="1"
        />
        <line
          x1={4 + tankW}
          y1={16}
          x2={4 + tankW}
          y2={16 + tankH}
          stroke="#555"
          strokeWidth="1"
        />

        <circle
          cx={4 + tankW - 10}
          cy={16 + tankH * alarmRatio}
          r={4}
          fill="#ef4444"
        />

        <rect
          x={4 + tankW - 13}
          y={16 + tankH * exitRatio - 4}
          width={8}
          height={8}
          fill="white"
          opacity={0.85}
        />
      </svg>

      <div
        className="flex flex-col justify-between text-right"
        style={{ height: tankH + 16, marginTop: 8 }}
      >
        {levels.map((l) => (
          <span key={l} className="text-[10px] leading-none text-white/30">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
