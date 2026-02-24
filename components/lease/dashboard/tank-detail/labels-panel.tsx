import type { TankLabel } from "./types";

interface LabelsPanelProps {
  labels: TankLabel[];
  onNewLabel?: () => void;
}

export function LabelsPanel({ labels, onNewLabel }: LabelsPanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-white">Labels</p>
        <button
          onClick={onNewLabel}
          className="text-xs text-[#34C759] hover:text-[#28a745] flex items-center gap-1"
        >
          ⊕ New Label
        </button>
      </div>
      <div className="space-y-2">
        {labels.map((label) => (
          <div key={label.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {label.shape === "circle" ? (
                <span
                  className="h-3 w-3 rounded-full shrink-0 inline-block"
                  style={{ backgroundColor: label.color }}
                />
              ) : (
                <span
                  className="h-3 w-3 rounded-sm shrink-0 inline-block"
                  style={{ backgroundColor: label.color }}
                />
              )}
              <span className="text-xs text-white/70">{label.name}</span>
            </div>
            <span className="text-xs text-white/50">{label.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
