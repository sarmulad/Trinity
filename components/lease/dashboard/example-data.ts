import type {
  OilTank,
  EFMChart,
  FilterPot,
  WaterTank,
  Compressor,
  Separator,
  Well,
  TeamMember,
} from "./types";

export const EXAMPLE_OIL_TANKS: OilTank[] = [
  {
    id: "1",
    name: "Oil Tank #1",
    prod: "100 BBLs",
    timestamp: "3/17/24 8:15AM",
    levelFt: "5' 5\"",
    levelBbls: "100 / 200 BBLs",
    theftLevelFt: "1' 0\"",
    theftLevelBbls: "20 / 200 BBLs",
  },
  {
    id: "2",
    name: "Oil Tank #2",
    prod: "100 BBLs",
    timestamp: "3/17/24 8:15AM",
    levelFt: "5' 5\"",
    levelBbls: "100 / 200 BBLs",
    theftLevelFt: "1' 0\"",
    theftLevelBbls: "20 / 200 BBLs",
  },
];

export const EXAMPLE_EFM: EFMChart[] = [
  {
    id: "1",
    name: "EFM/Chart #201",
    yesterdayVolume: "100 MCF",
    timestamp: "3/17/24 8:15AM",
    mcfd: "500 MCF/D",
  },
];

export const EXAMPLE_FILTER_POT: FilterPot = {
  timestamp: "3/17/24 8:15AM",
  inletPsi: "41 PSI",
  outletPsi: "180 BBLs",
  filterType: "TPI 65",
  lastFilterInstall: "3/25/24",
};

export const EXAMPLE_WATER_TANKS: WaterTank[] = [
  {
    id: "1",
    name: "Water Tank #1",
    timestamp: "3/17/24 8:15AM",
    levelFt: "5' 5\"",
    levelBbls: "100 / 200 BBLs",
    theftLevelFt: "1' 0\"",
    theftLevelBbls: "20 / 200 BBLs",
  },
];

export const EXAMPLE_COMPRESSORS: Compressor[] = [
  {
    name: "Compressor",
    runStatus: "Running",
    oilPressure: "21 PSI",
    oilPressureAlert: true,
    oilTemp: 19,
    timestamp: "3/17/24 8:15AM",
    batteryLevel: "90%",
    rssi: 21,
    dischargePressure: 19,
  },
  {
    name: "Pump",
    runStatus: "Running",
    oilPressure: "21 PSI",
    oilPressureAlert: true,
    oilTemp: 19,
    timestamp: "3/17/24 8:15AM",
    batteryLevel: "90%",
    rssi: 21,
    dischargePressure: 19,
  },
];

export const EXAMPLE_SEPARATOR: Separator = {
  timestamp: "3/17/24 8:15AM",
  todayVolumeFt: "4' 8\"",
  yesterdayVolume: "180 BBLs",
  accumVolume: "200 BBLs",
  flowRate: "200 BBLs",
};

export const EXAMPLE_WELLS: Well[] = [
  {
    id: "1",
    name: "Johnson #1",
    dailyUptime: "99%",
    casingPressure: "12 PSI",
    tubingPressure: "21 PSI",
    accInjTotal: "200 BBLs",
    dailyInjTotal: "20 BBLs",
    timestamp: "3/17/24 8:15AM",
  },
  {
    id: "2",
    name: "Johnson #2",
    dailyUptime: "99%",
    casingPressure: "12 PSI",
    tubingPressure: "21 PSI",
    allocProd: "80%",
    type: "Gas Lift",
    timestamp: "3/17/24 8:15AM",
  },
];

export const EXAMPLE_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "John Smith",
    role: "Pumper",
    roleColor: "#34C759",
    currentlyOn: "Chico",
    initials: "JS",
  },
  {
    id: "2",
    name: "Luis Marcus",
    role: "Admin",
    roleColor: "#A78BFA",
    initials: "LM",
  },
];
