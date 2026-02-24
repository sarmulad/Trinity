import { Card } from "../ui/card";
import { StatRow } from "../ui/stat-row";
import type { Compressor } from "../types";
import { Bell } from "lucide-react";

export function CompressorCard({ compressor }: { compressor: Compressor }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold text-white">{compressor.name}</p>
        <p className="text-xs text-white/40">{compressor.timestamp}</p>
      </div>
      <div className="flex justify-between gap-4">
        <div className="space-y-1">
          <StatRow label="Run Status" value={compressor.runStatus} />
          <StatRow
            label="Oil Pressure"
            value={
              <>
                {compressor.oilPressure}{" "}
                <Bell className=" inline h-4 w-4 text-red-500" />
              </>
            }
            valueClass={
              compressor.oilPressureAlert ? "text-red-400" : "text-white"
            }
          />
          <StatRow label="Oil Temp" value={compressor.oilTemp} />
        </div>
        <div className="space-y-1 text-right">
          <StatRow label="Battery Level" value={compressor.batteryLevel} />
          <StatRow label="RSSI" value={compressor.rssi} />
          <StatRow
            label="Discharge Pressure"
            value={compressor.dischargePressure}
          />
        </div>
      </div>
    </Card>
  );
}
