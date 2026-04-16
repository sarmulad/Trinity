import type { SourceFlag } from "@/components/ui/source-indicator";

export interface TankDataRow {
  level: string;
  volume: string;
  dateTime: string;
  source: SourceFlag;
}

export interface TankLabel {
  id: string;
  name: string;
  color: string;
  shape: "circle" | "square";
  level: string;
}

export interface TankDetailData {
  name: string;
  topGaugeFt: string;
  topGaugeBbls: string;
  currentLevel: {
    oil: string;
    oilBbls: string;
    gasVolume: string;
    total: string;
    totalBbls: string;
    time: string;
  };
  labels: TankLabel[];
  tableData: TankDataRow[];
  totalEntries: number;
  chartData: { date: string; value: number }[];
}
