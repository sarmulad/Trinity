export interface TankDataRow {
  level: string;
  volume: string;
  dateTime: string;
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
  prodBbls: string;
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
