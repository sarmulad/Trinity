import { Card } from "../ui/card";
import { StatRow } from "../ui/stat-row";
import type { Separator } from "../types";

interface SeparatorCardProps {
  separator: Separator;
  onClick?: () => void;
}

export function SeparatorCard({ separator, onClick }: SeparatorCardProps) {
  return (
    <Card
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
      <div>
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-semibold text-black dark:text-white">
            Separator
          </p>
          <p className="text-xs text-black/40 dark:text-white/40">
            {separator.timestamp}
          </p>
        </div>
        <div className="flex justify-between gap-4">
          <div className="space-y-1">
            <StatRow label="Today Volume" value={separator.todayVolumeFt} />
            <StatRow label="Yest. Volume" value={separator.yesterdayVolume} />
          </div>
          <div className="space-y-1 text-right">
            <StatRow label="Accum. Volume" value={separator.accumVolume} />
            <StatRow label="Flow Rate" value={separator.flowRate} />
          </div>
        </div>
      </div>
    </Card>
  );
}
