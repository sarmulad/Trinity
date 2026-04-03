import { Card } from "../ui/card";
import { Sparkline } from "../ui/sparkline";
import type { EFMChart } from "../types";

interface EFMCardProps {
  efm: EFMChart;
  onClick?: () => void;
}

export function EFMCard({ efm, onClick }: EFMCardProps) {
  return (
    <Card>
      <div className="cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-black dark:text-white">
              {efm.name}
            </p>
            <span className="text-xs text-black/30 dark:text-white/30">›</span>
          </div>
          <p className="text-xs text-black/40 dark:text-white/40">
            {efm.timestamp}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-xs text-black/50 dark:text-white/50">
              Yest. Volume: {efm.yesterdayVolume}
            </p>
            <Sparkline color="#4B5563" />
          </div>
          <p className="text-lg font-bold text-black dark:text-white">
            {efm.mcfd}
          </p>
        </div>
      </div>
    </Card>
  );
}
