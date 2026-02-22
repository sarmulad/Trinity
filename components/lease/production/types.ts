// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductionRecord {
  date: string;
  h2o: number;
  oil: number;
  gas: number;
  // Event markers
  hasMessage?: boolean;
  hasAlarm?: boolean;
  alarmText?: string;
}

export interface ProductionStats {
  oilStock: string;
  avgRunsDay: number;
  yesterdayRuns: number;
  avgFlowTime: number;
  avgProdTime: string;
  avgOilProd: number;
  oilTank1Stock: string;
  oilTank1Prod: string;
  oilTank2Stock: string;
  oilTank2Prod: string;
}

export interface LeaseScore {
  productionPerformance: number;
  uptimeReliability: number;
  dataAccuracy: number;
  alarmsAndSafety: number;
}

export interface ReturnRisk {
  returnPct: number;
  vsCategory: number;
  riskPct: number;
  riskVsCategory: number;
}

export interface AllocatedWell {
  name: string;
  pct: number;
  color: string;
}

export interface MoreInfo {
  leaseType: string;
  powerType: string;
  producers: number;
  dataFrequency: string;
  injectors: number;
  buyer: string;
  tanks: number;
  route: string;
  liftTypes: string;
}

export interface ProductionTabProps {
  productionData?: ProductionRecord[];
  stats?: ProductionStats;
  leaseScore?: LeaseScore;
  returnRisk?: ReturnRisk;
  allocatedWells?: AllocatedWell[];
  moreInfo?: MoreInfo;
  isLoading?: boolean;
}

// ─── Example data (replace with Tago.io API responses) ───────────────────────
// Each field maps 1:1 to a Tago.io variable/device query.
// TODO: replace with: GET https://api.tago.io/data?variable=<var>&device=<id>

export const EXAMPLE_PRODUCTION: ProductionRecord[] = [
  { date: "1/2/24", h2o: 422, oil: 100, gas: 100, hasMessage: true },
  { date: "1/3/24", h2o: 520, oil: 100, gas: 100 },
  {
    date: "1/4/24",
    h2o: 312,
    oil: 100,
    gas: 100,
    hasAlarm: true,
    alarmText: "Pressure Threshold Exceeded\nSensor ID: T-102",
  },
  { date: "1/5/24", h2o: 378, oil: 100, gas: 100 },
  { date: "1/6/24", h2o: 350, oil: 100, gas: 100, hasMessage: true },
  { date: "1/7/24", h2o: 366, oil: 100, gas: 100 },
  { date: "1/8/24", h2o: 306, oil: 100, gas: 100 },
];

export const EXAMPLE_STATS: ProductionStats = {
  oilStock: "100 BBLs",
  avgRunsDay: 19,
  yesterdayRuns: 21,
  avgFlowTime: 21,
  avgProdTime: "80%",
  avgOilProd: 19,
  oilTank1Stock: "100 BBLs",
  oilTank1Prod: "100 BBLs",
  oilTank2Stock: "100 BBLs",
  oilTank2Prod: "0",
};

export const EXAMPLE_SCORE: LeaseScore = {
  productionPerformance: 82,
  uptimeReliability: 23,
  dataAccuracy: 80,
  alarmsAndSafety: 23,
};

export const EXAMPLE_RETURN_RISK: ReturnRisk = {
  returnPct: 20.49,
  vsCategory: 12.86,
  riskPct: 9.76,
  riskVsCategory: 7.51,
};

export const EXAMPLE_ALLOCATED: AllocatedWell[] = [
  { name: "Johnson #1", pct: 20, color: "#34C759" },
  { name: "Johnson #2", pct: 32, color: "#28a745" },
  { name: "Johnson #3", pct: 20, color: "#1a6b2e" },
];

export const EXAMPLE_MORE_INFO: MoreInfo = {
  leaseType: "Primary: Oil",
  powerType: "Electric",
  producers: 3,
  dataFrequency: "15 MIN",
  injectors: 1,
  buyer: "CHS",
  tanks: 4,
  route: "West KS",
  liftTypes: "Rod Pump",
};

export const TIME_RANGES = [
  "Y",
  "T",
  "C",
  "1W",
  "1M",
  "3M",
  "6M",
  "YTD",
  "YTD",
] as const;
