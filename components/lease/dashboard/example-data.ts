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
    levelBbls: "100 BBLs",
    theftLevelFt: "1' 2\"",
    theftLevelBbls: "22 BBLs",
  },
  {
    id: "2",
    name: "Oil Tank #2",
    prod: "100 BBLs",
    timestamp: "3/17/24 8:15AM",
    levelFt: "5' 5\"",
    levelBbls: "100 BBLs",
    theftLevelFt: "1' 2\"",
    theftLevelBbls: "22 BBLs",
  },
];

export const EXAMPLE_EFM: EFMChart[] = [
  {
    id: "1",
    name: "EFM/Chart #201",
    yesterdayVolume: "100 MCF",
    timestamp: "3/17/24 8:15AM",
    mcfd: "500 MCF/D",
    currentValues: [
      { label: "Line Pressure", value: "182 PSI" },
      { label: "Static Pressure", value: "174 PSI" },
      { label: "Flow Temp", value: "74.2 F" },
      { label: "Differential", value: "16.8 inH2O" },
      { label: "Volume Rate", value: "21.4 MCFH" },
      { label: "Energy Rate", value: "22.1 MMBtu" },
      { label: "Battery", value: "13.7 V" },
      { label: "RSSI", value: "-79 dBm" },
      { label: "Run Hours", value: "7,322 h" },
      { label: "Flow Today", value: "512 MCF" },
    ],
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
    levelBbls: "100 BBLs",
    theftLevelFt: "1' 0\"",
    theftLevelBbls: "20 BBLs",
  },
];

export const EXAMPLE_COMPRESSORS: Compressor[] = [
  {
    id: "comp-1",
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
    id: "pump-1",
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
    phone: "+1 (432) 555-0142",
    email: "john.smith@trinityops.com",
    initials: "JS",
  },
  {
    id: "2",
    name: "Luis Marcus",
    role: "Admin",
    roleColor: "#A78BFA",
    phone: "+1 (432) 555-0198",
    email: "luis.marcus@trinityops.com",
    initials: "LM",
  },
];
