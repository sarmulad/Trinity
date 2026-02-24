import { Card } from "../ui/card";
import { StatRow } from "../ui/stat-row";
import type { Separator } from "../types";

export function SeparatorCard({ separator }: { separator: Separator }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-semibold text-white">Seperator</p>
        <p className="text-xs text-white/40">{separator.timestamp}</p>
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
    </Card>
  );
}
