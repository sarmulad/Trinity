import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import type { EFMChart } from "../types";

interface EFMCardProps {
  efm: EFMChart;
  onClick?: () => void;
  className?: string;
}

export function EFMCard({ efm, onClick, className }: EFMCardProps) {
  const previewValues = efm.currentValues?.slice(0, 6) ?? [];

  return (
    <Card
      className={cn("min-h-[220px]", className)}
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
      <div className="space-y-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-black dark:text-white">
              {efm.name}
            </p>
          </div>
          <p className="text-xs text-black/40 dark:text-white/40">
            {efm.timestamp}
          </p>
        </div>

        {previewValues.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-3">
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

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-[11px] text-black/45 dark:text-white/45">
              Current Flow
            </p>
            <p className="mt-1 text-lg font-bold text-black dark:text-white">
              {efm.mcfd}
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-[11px] text-black/45 dark:text-white/45">
              Yesterday
            </p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
              {efm.yesterdayVolume}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
