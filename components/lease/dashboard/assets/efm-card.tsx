import { Card } from "../ui/card";
import { Sparkline } from "../ui/sparkline";
import type { EFMChart } from "../types";

interface EFMCardProps {
  efm: EFMChart;
  onClick?: () => void;
}

export function EFMCard({ efm, onClick }: EFMCardProps) {
  const previewValues = efm.currentValues?.slice(0, 8) ?? [];

  return (
    <Card>
      <div className="cursor-pointer space-y-3" onClick={onClick}>
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

        {previewValues.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5">
            {previewValues.map((item) => (
              <div
                key={item.label}
                className="rounded-md bg-black/[0.04] px-2 py-1 dark:bg-white/[0.04]"
              >
                <p className="text-[10px] leading-tight text-black/45 dark:text-white/45">
                  {item.label}
                </p>
                <p className="text-[11px] font-semibold text-black/80 dark:text-white/80">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs text-black/50 dark:text-white/50">
              Yest. Volume: {efm.yesterdayVolume}
            </p>
            <Sparkline color="#4B5563" width={96} />
          </div>
          <p className="text-lg font-bold text-black dark:text-white">{efm.mcfd}</p>
        </div>
      </div>
    </Card>
  );
}
