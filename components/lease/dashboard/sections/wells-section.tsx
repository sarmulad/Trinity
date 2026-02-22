import { SectionHeader } from "../ui/section-header";
import { Card } from "../ui/card";
import { StatRow } from "../ui/stat-row";
import type { Well } from "../types";

interface WellsSectionProps {
  wells: Well[];
  onHistoryClick?: () => void;
}

export function WellsSection({ wells, onHistoryClick }: WellsSectionProps) {
  return (
    <div>
      <SectionHeader
        title="Wells"
        actionLabel="History"
        onAction={onHistoryClick}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {wells.map((well) => (
          <Card key={well.id}>
            <div className="flex items-start justify-between mb-2">
              <p className="text-base font-bold text-white">{well.name}</p>
              <p className="text-xs text-white/40">{well.timestamp}</p>
            </div>
            <div className="flex justify-between gap-4">
              <div className="space-y-1">
                <StatRow label="Daily Uptime" value={well.dailyUptime} />
                <StatRow label="Casing Pressure" value={well.casingPressure} />
                {well.accInjTotal && (
                  <StatRow label="Acc. Inj. Total" value={well.accInjTotal} />
                )}
                {well.allocProd && (
                  <StatRow label="Alloc. Prod." value={well.allocProd} />
                )}
              </div>
              <div className="space-y-1 text-right">
                <StatRow label="Tubing Pressure" value={well.tubingPressure} />
                {well.dailyInjTotal && (
                  <StatRow
                    label="Daily Inj. Total"
                    value={well.dailyInjTotal}
                  />
                )}
                {well.type && <StatRow label="Type" value={well.type} />}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
