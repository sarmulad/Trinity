export interface OilTank {
  id: string;
  name: string;
  prod: string;
  timestamp: string;
  levelFt: string;
  levelBbls: string;
  theftLevelFt: string;
  theftLevelBbls: string;
}

export interface EFMChart {
  id: string;
  name: string;
  yesterdayVolume: string;
  timestamp: string;
  mcfd: string;
}

export interface FilterPot {
  timestamp: string;
  inletPsi: string;
  outletPsi: string;
  filterType: string;
  lastFilterInstall: string;
}

export interface WaterTank {
  id: string;
  name: string;
  timestamp: string;
  levelFt: string;
  levelBbls: string;
  theftLevelFt: string;
  theftLevelBbls: string;
}

export interface Compressor {
  name: string;
  runStatus: string;
  oilPressure: string;
  oilPressureAlert: boolean;
  oilTemp: number;
  timestamp: string;
  batteryLevel: string;
  rssi: number;
  dischargePressure: number;
}

export interface Separator {
  timestamp: string;
  todayVolumeFt: string;
  yesterdayVolume: string;
  accumVolume: string;
  flowRate: string;
}

export interface Well {
  id: string;
  name: string;
  dailyUptime: string;
  casingPressure: string;
  tubingPressure: string;
  accInjTotal?: string;
  dailyInjTotal?: string;
  allocProd?: string;
  type?: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleColor?: string;
  currentlyOn?: string;
  avatarUrl?: string;
  initials: string;
}
