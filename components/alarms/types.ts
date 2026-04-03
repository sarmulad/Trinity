export type AlarmStatus = "Active" | "Normal";

export interface AlarmHistoryRow {
  timestamp: string;
  previousStatus: AlarmStatus;
  nextStatus: AlarmStatus;
  note?: string;
}

export interface AlarmRow {
  id: string;
  date: string;
  asset: string;
  lease: string;
  alarmType?: string;
  sensorRange: string;
  threshold?: string;
  recipients?: string;
  lastValue: string;
  status: AlarmStatus;
  acked: boolean;
  history?: AlarmHistoryRow[];
}
