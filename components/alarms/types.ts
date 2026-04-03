export type AlarmStatus = "Active" | "Normal";

export interface AlarmRow {
  id: string;
  date: string;
  asset: string;
  lease: string;
  sensorRange: string;
  lastValue: string;
  status: AlarmStatus;
  acked: boolean;
}
