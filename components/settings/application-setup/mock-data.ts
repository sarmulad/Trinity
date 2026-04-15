export interface AreaRow {
  id: string;
  name: string;
  routesLabel: string;
  routesTone: "info" | "warning";
  description: string;
}

export interface RouteRow {
  id: string;
  name: string;
  area: string;
  pumper: string;
  leasesCount: number;
  leasesTone: "info" | "warning";
}

export interface LeaseRow {
  id: string;
  name: string;
  route: string;
  leaseNumber: string;
  batteriesCount: number;
}

export interface BatteryRow {
  id: string;
  name: string;
  leaseName: string;
  assetsCount: number;
  wellsCount: number;
  location: string;
}

export interface TransportRow {
  id: string;
  company: string;
  contact: string;
  phone: string;
}

export interface BatteryAssetRow {
  id: string;
  name: string;
  type: string;
  typeTone: "muted" | "info" | "warning";
  capacity: string;
  tag: string;
}

export interface BatteryWellRow {
  id: string;
  name: string;
  type: string;
  typeTone: "success" | "info";
  api: string;
  status: string;
}

export interface MenuNavItem {
  id: string;
  name: string;
  visible: boolean;
}

export const MOCK_AREAS: AreaRow[] = [
  {
    id: "a1",
    name: "North field",
    routesLabel: "4 routes",
    routesTone: "info",
    description: "Northern leases, Kingman Co.",
  },
  {
    id: "a2",
    name: "South field",
    routesLabel: "3 routes",
    routesTone: "info",
    description: "Southern ops, Sedgwick Co.",
  },
  {
    id: "a3",
    name: "East field",
    routesLabel: "3 routes",
    routesTone: "info",
    description: "Butler & Greenwood",
  },
  {
    id: "a4",
    name: "West field",
    routesLabel: "2 routes",
    routesTone: "warning",
    description: "Reno Co. leases",
  },
];

export const MOCK_ROUTES: RouteRow[] = [
  {
    id: "r1",
    name: "Route 1 - North A",
    area: "North field",
    pumper: "Jake M.",
    leasesCount: 5,
    leasesTone: "info",
  },
  {
    id: "r2",
    name: "Route 2 - North B",
    area: "North field",
    pumper: "Mike T.",
    leasesCount: 4,
    leasesTone: "info",
  },
  {
    id: "r3",
    name: "Route 3 - South A",
    area: "South field",
    pumper: "Danny R.",
    leasesCount: 6,
    leasesTone: "info",
  },
  {
    id: "r4",
    name: "Route 4 - East A",
    area: "East field",
    pumper: "—",
    leasesCount: 2,
    leasesTone: "warning",
  },
];

export const MOCK_LEASES: LeaseRow[] = [
  {
    id: "l1",
    name: "Maudie Reids",
    route: "Route 1 - North A",
    leaseNumber: "KS-4421",
    batteriesCount: 2,
  },
  {
    id: "l2",
    name: "Potts lease",
    route: "Route 2 - North B",
    leaseNumber: "KS-4455",
    batteriesCount: 1,
  },
  {
    id: "l3",
    name: "Henderson A",
    route: "Route 3 - South A",
    leaseNumber: "KS-4502",
    batteriesCount: 3,
  },
];

export const MOCK_BATTERIES: BatteryRow[] = [
  {
    id: "b1",
    name: "Maudie Reids Central",
    leaseName: "Maudie Reids",
    assetsCount: 4,
    wellsCount: 3,
    location: "37.685, -97.331",
  },
  {
    id: "b2",
    name: "Potts main battery",
    leaseName: "Potts lease",
    assetsCount: 2,
    wellsCount: 2,
    location: "37.702, -97.298",
  },
];

export const MOCK_TRANSPORT: TransportRow[] = [
  {
    id: "t1",
    company: "Plains Trucking",
    contact: "Bill S.",
    phone: "(316) 555-0210",
  },
  {
    id: "t2",
    company: "Midland Transport",
    contact: "Sarah K.",
    phone: "(316) 555-0315",
  },
  {
    id: "t3",
    company: "Eagle Oil Hauling",
    contact: "Tom D.",
    phone: "(620) 555-0188",
  },
];

export function getBatteryAssetRows(_batteryId: string): BatteryAssetRow[] {
  return [
    {
      id: "as1",
      name: "Tank #1",
      type: "Tank",
      typeTone: "muted",
      capacity: "400 bbl",
      tag: "T-1001",
    },
    {
      id: "as2",
      name: "Tank #2",
      type: "Tank",
      typeTone: "muted",
      capacity: "400 bbl",
      tag: "T-1002",
    },
    {
      id: "as3",
      name: "Separator A",
      type: "Separator",
      typeTone: "info",
      capacity: "—",
      tag: "S-2001",
    },
    {
      id: "as4",
      name: "Meter run",
      type: "Meter",
      typeTone: "warning",
      capacity: "—",
      tag: "M-3001",
    },
  ];
}

export function getBatteryWellRows(_batteryId: string): BatteryWellRow[] {
  return [
    {
      id: "w1",
      name: "MR #1",
      type: "Producing",
      typeTone: "success",
      api: "15-173-00421",
      status: "Active",
    },
    {
      id: "w2",
      name: "MR #2",
      type: "Producing",
      typeTone: "success",
      api: "15-173-00422",
      status: "Active",
    },
    {
      id: "w3",
      name: "MR INJ-1",
      type: "Injection",
      typeTone: "info",
      api: "15-173-00423",
      status: "Active",
    },
  ];
}

export const DEFAULT_MENU_NAV: MenuNavItem[] = [
  { id: "m1", name: "Dashboard", visible: true },
  { id: "m2", name: "Routes", visible: true },
  { id: "m3", name: "Tickets & tests", visible: true },
  { id: "m4", name: "Alarms", visible: true },
  { id: "m5", name: "Reports", visible: false },
  { id: "m6", name: "Settings", visible: true },
];
