import { Card } from "../ui/card";
import { StatRow } from "../ui/stat-row";
import type { FilterPot } from "../types";

interface FilterPotCardProps {
  filterPot: FilterPot;
  onClick?: () => void;
}

export function FilterPotCard({ filterPot, onClick }: FilterPotCardProps) {
  return (
    <Card>
      <div className="cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-semibold text-black dark:text-white">
            Filter Pot
          </p>
          <p className="text-xs text-black/40 dark:text-white/40">
            {filterPot.timestamp}
          </p>
        </div>

        <div className="flex justify-between gap-4">
          <div className="space-y-1">
            <StatRow label="Inlet PSI" value={filterPot.inletPsi} />
            <StatRow label="Outlet PSI" value={filterPot.outletPsi} />
          </div>
          <div className="space-y-1 text-right">
            <StatRow label="Filter Type" value={filterPot.filterType} />
            <StatRow
              label="Last Filter Install"
              value={filterPot.lastFilterInstall}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
