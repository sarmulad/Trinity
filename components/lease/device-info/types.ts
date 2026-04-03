export interface DeviceInfoItem {
  id: string;
  name: string;
  type: "Cell Modem" | "Edge Computer" | "RTU" | "Sensor Gateway";
  status: "Online" | "Offline" | "Warning";
  battery: string;
  solar: string;
  signal: string;
  uptime: string;
  lastSeen: string;
  firmware: string;
  historyAvailable?: boolean;
}
