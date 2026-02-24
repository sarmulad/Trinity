import { Card } from "../ui/card";
import { StatRow } from "../ui/stat-row";
import type { FilterPot } from "../types";

export function FilterPotCard({ filterPot }: { filterPot: FilterPot }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-semibold text-white">Filter Pot</p>
        <p className="text-xs text-white/40">{filterPot.timestamp}</p>
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
    </Card>
  );
}
