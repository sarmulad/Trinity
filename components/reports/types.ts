export type ReportFormat = "pdf" | "xls";

export type SidebarSectionKey =
  | "library"
  | "scheduled"
  | "history"
  | "custom"
  | "saved"
  | "recipients"
  | "groups";

export type ReportsView =
  | { type: SidebarSectionKey }
  | { type: "detail"; reportName: string }
  | { type: "schedule"; reportName: string };

export type HistoryStatus = "Delivered" | "Downloaded" | "Failed";

export interface ReportDefinition {
  name: string;
  category: string;
  formats: ReportFormat[];
  defaultFrequency: string;
}

export interface ScheduledItem {
  id: string;
  report: string;
  frequency: string;
  time: string;
  format: ReportFormat;
  group: string;
  active: boolean;
}

export interface HistoryItem {
  id: string;
  report: string;
  runDateLabel: string;
  runAt: string;
  triggeredBy: string;
  format: ReportFormat;
  status: HistoryStatus;
}

export interface SavedCustomReport {
  id: string;
  name: string;
  dataSource: string;
  created: string;
  lastRun: string;
  format: ReportFormat;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  groups: string[];
}

export interface RecipientGroup {
  id: string;
  name: string;
  members: string[];
}

export interface RecipientGroupWithCount extends RecipientGroup {
  activeScheduleCount: number;
}

export interface CustomPreviewRow {
  date: string;
  lease: string;
  oil: number;
  water: number;
  gas: number;
}
