import { Card } from "../ui/card";
import { Sparkline } from "../ui/sparkline";
import type { EFMChart } from "../types";

export function EFMCard({ efm }: { efm: EFMChart }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-white">{efm.name}</p>
            <span className="text-xs text-white/30">›</span>
          </div>
          <p className="text-xs text-white/50">
            Yest. Volume: {efm.yesterdayVolume}
          </p>
          <p className="text-xs text-white/40">{efm.timestamp}</p>
          <Sparkline color="#4B5563" />
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{efm.mcfd}</p>
        </div>
      </div>
    </Card>
  );
}
