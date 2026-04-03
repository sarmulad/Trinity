export interface Well {
  id: string;
  name: string;
}

export interface Area {
  id: string;
  name: string;
  wells?: Well[];
}

export interface Lease {
  id: string;
  name: string;
  areas?: Area[];
}

export interface Route {
  id: string;
  name: string;
  leases?: Lease[];
}

export interface Company {
  id: string;
  name: string;
  routes?: Route[];
}
