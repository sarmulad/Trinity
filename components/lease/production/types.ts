export interface ProductionRecord {
  date: string;
  h2o: number;
  oil: number;
  gas: number;
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

export interface AllocationSection {
  id: string;
  label: string;
  total: string;
  wells: AllocatedWell[];
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
  allocatedWells?: AllocationSection[];
  moreInfo?: MoreInfo;
  isLoading?: boolean;
}

export interface GasMeterRecord {
  meterName: string;
  dateAndTime: string;
  dp: string;
  sp: string;
  temp: string;
  volume: string;
  energy: string;
  flowPct: string;
  backFlowPct: string;
  maxDp: string;
}

export interface OilTankMetrics {
  dailyGauge: string;
  production: string;
  runs: string;
}

function formatFeetAndInches(totalInches: number) {
  const wholeInches = Math.max(0, Math.round(totalInches));
  const feet = Math.floor(wholeInches / 12);
  const inches = wholeInches % 12;
  return `${feet} FT ${inches.toString().padStart(2, "0")} IN`;
}

export interface OilTankRecord {
  timestamp: string;
  tanks: Record<string, OilTankMetrics>;
}

export const EXAMPLE_PRODUCTION: ProductionRecord[] = Array.from(
  { length: 36 },
  (_, index) => {
    const day = index + 2;
    const h2o = 300 + ((index * 37) % 190);
    const oil = 88 + ((index * 11) % 28);
    const gas = 92 + ((index * 9) % 24);
    const hasMessage = index % 7 === 0;
    const hasAlarm = index % 11 === 0;

    return {
      date: `1/${day}/24`,
      h2o,
      oil,
      gas,
      hasMessage,
      hasAlarm,
      alarmText: hasAlarm
        ? "Pressure Threshold Exceeded\nSensor ID: T-102"
        : undefined,
    };
  },
);

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

export const EXAMPLE_ALLOCATED: AllocationSection[] = [
  {
    id: "oil",
    label: "Oil Allocation",
    total: "124.8 BBL",
    wells: [
      { name: "Johnson #1", pct: 34, color: "#34C759" },
      { name: "Johnson #2", pct: 29, color: "#5FD27A" },
      { name: "Johnson #3", pct: 21, color: "#1E8E3E" },
      { name: "Johnson #5", pct: 16, color: "#0E5C28" },
    ],
  },
  {
    id: "gas",
    label: "Gas Allocation",
    total: "238.4 MCF",
    wells: [
      { name: "Johnson #1", pct: 28, color: "#0EA5E9" },
      { name: "Johnson #2", pct: 24, color: "#38BDF8" },
      { name: "Johnson #3", pct: 31, color: "#0369A1" },
      { name: "Johnson #5", pct: 17, color: "#082F49" },
    ],
  },
  {
    id: "water",
    label: "Water Allocation",
    total: "81.2 BBL",
    wells: [
      { name: "Johnson #1", pct: 26, color: "#6366F1" },
      { name: "Johnson #2", pct: 22, color: "#818CF8" },
      { name: "Johnson #3", pct: 19, color: "#4338CA" },
      { name: "Johnson #5", pct: 33, color: "#312E81" },
    ],
  },
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

const EXAMPLE_GAS_METERS = ["Gas Meter 01", "Gas Meter 02", "Gas Meter 03"];

export const EXAMPLE_GASMETER: GasMeterRecord[] = EXAMPLE_GAS_METERS.flatMap(
  (meterName, meterIndex) =>
    Array.from({ length: 32 }, (_, i) => {
      const hour = String((i % 24) + 1).padStart(2, "0");
      return {
        meterName,
        dateAndTime: `03/${String(18 + Math.floor(i / 24)).padStart(2, "0")}/2026 ${hour}:00:00 am`,
        dp: (7 + meterIndex + Math.random() * 1.2).toFixed(2) + " In. H2O",
        sp: (16 + meterIndex + Math.random() * 2).toFixed(2) + " PSIA",
        temp: (60 + Math.random() * 3).toFixed(2) + " °F",
        volume: (22 + meterIndex * 2 + Math.random() * 3).toFixed(2) + " MCF",
        energy:
          (33 + meterIndex * 1.5 + Math.random() * 2).toFixed(2) + " MMBTU",
        flowPct: (98.5 + Math.random() * 1.5).toFixed(2) + " %",
        backFlowPct: (Math.random() * 0.5).toFixed(2) + " %",
        maxDp:
          (90 + meterIndex * 2 + Math.random() * 3).toFixed(2) + " In. H2O",
      };
    }),
);

const EXAMPLE_TANKS = ["Oil Tank 1", "Oil Tank 2", "Oil Tank 3"];

export const EXAMPLE_OILTANKS: OilTankRecord[] = Array.from(
  { length: 36 },
  (_, i) => {
    const hour = String((i % 24) + 1).padStart(2, "0");
    const day = String(18 + Math.floor(i / 24)).padStart(2, "0");

    return {
      timestamp: `03/${day}/2026 ${hour}:00:00 am`,
      tanks: Object.fromEntries(
        EXAMPLE_TANKS.map((tankName, tankIndex) => {
          const gauge = 68 + tankIndex * 3 + Math.random() * 6;
          const production = 12 + tankIndex * 2 + Math.random() * 4;
          const runs = 1 + ((i + tankIndex) % 4);

          return [
            tankName,
            {
              dailyGauge: formatFeetAndInches(gauge),
              production: `${production.toFixed(2)} BBL`,
              runs: runs.toString(),
            },
          ];
        }),
      ),
    };
  },
);
