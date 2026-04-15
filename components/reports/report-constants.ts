import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  FileText,
  History,
  ListChecks,
  Mail,
  Users,
} from "lucide-react";

import type {
  CustomPreviewRow,
  HistoryItem,
  Recipient,
  RecipientGroup,
  ReportDefinition,
  SavedCustomReport,
  ScheduledItem,
  SidebarSectionKey,
} from "./types";

export const REPORT_LIBRARY: ReportDefinition[] = [
  {
    name: "Daily production summary",
    category: "Production",
    formats: ["pdf", "xls"],
    defaultFrequency: "Daily",
  },
  {
    name: "Monthly lease production",
    category: "Production",
    formats: ["pdf", "xls"],
    defaultFrequency: "Monthly",
  },
  {
    name: "Well test report",
    category: "Production",
    formats: ["pdf"],
    defaultFrequency: "On demand",
  },
  {
    name: "Decline curve analysis",
    category: "Production",
    formats: ["pdf", "xls"],
    defaultFrequency: "Monthly",
  },
  {
    name: "Injection volume report",
    category: "Waterflood",
    formats: ["pdf", "xls"],
    defaultFrequency: "Daily",
  },
  {
    name: "Waterflood pattern analysis",
    category: "Waterflood",
    formats: ["pdf"],
    defaultFrequency: "Monthly",
  },
  {
    name: "SWD volume tracking",
    category: "Waterflood",
    formats: ["pdf", "xls"],
    defaultFrequency: "Weekly",
  },
  {
    name: "Tank gauge report",
    category: "Inventory",
    formats: ["pdf", "xls"],
    defaultFrequency: "Daily",
  },
  {
    name: "Oil inventory reconciliation",
    category: "Inventory",
    formats: ["xls"],
    defaultFrequency: "Monthly",
  },
  {
    name: "Run ticket summary",
    category: "Inventory",
    formats: ["pdf", "xls"],
    defaultFrequency: "Monthly",
  },
  {
    name: "LAUF report",
    category: "Inventory",
    formats: ["pdf", "xls"],
    defaultFrequency: "Monthly",
  },
  {
    name: "Pumper route report",
    category: "Operations",
    formats: ["pdf"],
    defaultFrequency: "Daily",
  },
  {
    name: "Downtime / failure log",
    category: "Operations",
    formats: ["pdf", "xls"],
    defaultFrequency: "Weekly",
  },
  {
    name: "Equipment maintenance log",
    category: "Operations",
    formats: ["pdf"],
    defaultFrequency: "Monthly",
  },
  {
    name: "Alarm summary report",
    category: "Operations",
    formats: ["pdf", "xls"],
    defaultFrequency: "Weekly",
  },
  {
    name: "Lease operating expense",
    category: "Financial",
    formats: ["xls"],
    defaultFrequency: "Monthly",
  },
  {
    name: "Revenue by lease",
    category: "Financial",
    formats: ["pdf", "xls"],
    defaultFrequency: "Monthly",
  },
  {
    name: "Transport / hauling summary",
    category: "Financial",
    formats: ["pdf", "xls"],
    defaultFrequency: "Monthly",
  },
  {
    name: "Regulatory compliance (KCC)",
    category: "Regulatory",
    formats: ["pdf"],
    defaultFrequency: "Quarterly",
  },
  {
    name: "Environmental discharge log",
    category: "Regulatory",
    formats: ["pdf", "xls"],
    defaultFrequency: "Monthly",
  },
];

export const INITIAL_SCHEDULED_REPORTS: ScheduledItem[] = [
  {
    id: "scheduled-1",
    report: "Daily production summary",
    frequency: "Daily",
    time: "6:00 AM",
    format: "pdf",
    group: "Operations team",
    active: true,
  },
  {
    id: "scheduled-2",
    report: "Tank gauge report",
    frequency: "Daily",
    time: "6:00 AM",
    format: "pdf",
    group: "Operations team",
    active: true,
  },
  {
    id: "scheduled-3",
    report: "Injection volume report",
    frequency: "Daily",
    time: "7:00 AM",
    format: "xls",
    group: "Engineering",
    active: true,
  },
  {
    id: "scheduled-4",
    report: "Monthly lease production",
    frequency: "1st of month",
    time: "8:00 AM",
    format: "pdf",
    group: "Management",
    active: true,
  },
  {
    id: "scheduled-5",
    report: "Oil inventory reconciliation",
    frequency: "1st of month",
    time: "8:00 AM",
    format: "xls",
    group: "Accounting",
    active: true,
  },
  {
    id: "scheduled-6",
    report: "LAUF report",
    frequency: "1st of month",
    time: "8:00 AM",
    format: "pdf",
    group: "Management",
    active: false,
  },
  {
    id: "scheduled-7",
    report: "Alarm summary report",
    frequency: "Monday",
    time: "7:00 AM",
    format: "pdf",
    group: "Engineering",
    active: true,
  },
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: "history-1",
    report: "Daily production summary",
    runDateLabel: "Apr 8, 2026 6:00 AM",
    runAt: "2026-04-08T06:00:00.000Z",
    triggeredBy: "Scheduled",
    format: "pdf",
    status: "Delivered",
  },
  {
    id: "history-2",
    report: "Tank gauge report",
    runDateLabel: "Apr 8, 2026 6:00 AM",
    runAt: "2026-04-08T06:00:00.000Z",
    triggeredBy: "Scheduled",
    format: "pdf",
    status: "Delivered",
  },
  {
    id: "history-3",
    report: "Injection volume report",
    runDateLabel: "Apr 8, 2026 7:00 AM",
    runAt: "2026-04-08T07:00:00.000Z",
    triggeredBy: "Scheduled",
    format: "xls",
    status: "Delivered",
  },
  {
    id: "history-4",
    report: "Well test report",
    runDateLabel: "Apr 7, 2026 2:15 PM",
    runAt: "2026-04-07T14:15:00.000Z",
    triggeredBy: "Manual - Chris",
    format: "pdf",
    status: "Downloaded",
  },
  {
    id: "history-5",
    report: "Monthly lease production",
    runDateLabel: "Apr 1, 2026 8:00 AM",
    runAt: "2026-04-01T08:00:00.000Z",
    triggeredBy: "Scheduled",
    format: "pdf",
    status: "Failed",
  },
];

export const SAVED_CUSTOM_REPORTS: SavedCustomReport[] = [
  {
    id: "custom-1",
    name: "Potts lease weekly oil",
    dataSource: "Production data",
    created: "Mar 15, 2026",
    lastRun: "Apr 7, 2026",
    format: "xls",
  },
  {
    id: "custom-2",
    name: "North field injection vs. prod",
    dataSource: "Waterflood data",
    created: "Feb 20, 2026",
    lastRun: "Apr 1, 2026",
    format: "pdf",
  },
  {
    id: "custom-3",
    name: "Monthly hauling by transporter",
    dataSource: "Run tickets",
    created: "Jan 10, 2026",
    lastRun: "Apr 1, 2026",
    format: "xls",
  },
];

export const RECIPIENTS: Recipient[] = [
  {
    id: "recipient-1",
    name: "Chris",
    email: "chris@sterlingdrilling.com",
    groups: ["Management", "Engineering"],
  },
  {
    id: "recipient-2",
    name: "Jake M.",
    email: "jake@sterlingdrilling.com",
    groups: ["Operations team", "Field supervisors"],
  },
  {
    id: "recipient-3",
    name: "Mike T.",
    email: "mike@sterlingdrilling.com",
    groups: ["Operations team"],
  },
  {
    id: "recipient-4",
    name: "Danny R.",
    email: "danny@sterlingdrilling.com",
    groups: ["Operations team", "Field supervisors"],
  },
  {
    id: "recipient-5",
    name: "Tom B.",
    email: "tomb@sterlingdrilling.com",
    groups: ["Management"],
  },
  {
    id: "recipient-6",
    name: "Sarah W.",
    email: "sarah@sterlingdrilling.com",
    groups: ["Accounting"],
  },
];

export const RECIPIENT_GROUPS: RecipientGroup[] = [
  {
    id: "group-1",
    name: "Operations team",
    members: ["Jake M.", "Mike T.", "Danny R."],
  },
  { id: "group-2", name: "Management", members: ["Chris", "Tom B."] },
  { id: "group-3", name: "Engineering", members: ["Chris", "Alex P."] },
  { id: "group-4", name: "Accounting", members: ["Sarah W.", "Lisa K."] },
  {
    id: "group-5",
    name: "Field supervisors",
    members: ["Jake M.", "Danny R."],
  },
];

export const CUSTOM_PREVIEW_ROWS: CustomPreviewRow[] = [
  { date: "Apr 7", lease: "Maudie Reids", oil: 12.4, water: 84.2, gas: 31.1 },
  { date: "Apr 7", lease: "Potts", oil: 8.1, water: 62.0, gas: 22.5 },
  { date: "Apr 7", lease: "Henderson A", oil: 15.7, water: 103.8, gas: 44.9 },
];

export const CUSTOM_PREVIEW_TOTAL: CustomPreviewRow[] = [
  { date: "Total", lease: "", oil: 36.2, water: 250.0, gas: 98.5 },
];

export const LEASE_OPTIONS = ["All leases", "Maudie Reids", "Potts lease", "Henderson A"];

export const SEND_TO_OPTIONS = [
  "Don't send - download only",
  "Operations team",
  "Management",
  "Engineering",
  "Accounting",
  "Custom recipients...",
];

export const DELIVERY_GROUP_OPTIONS = [
  "Operations team",
  "Management",
  "Engineering",
  "Accounting",
  "Field supervisors",
];

export const FREQUENCY_OPTIONS = [
  "Daily",
  "Weekly (Monday)",
  "Weekly (Friday)",
  "1st of month",
  "15th of month",
  "Quarterly",
];

export const HISTORY_RANGE_OPTIONS = ["All reports", "Last 7 days", "Last 30 days"] as const;

export const CUSTOM_DATA_SOURCES = [
  "Production data",
  "Injection / waterflood data",
  "Tank / inventory data",
  "Well test data",
  "Run tickets",
  "Alarm history",
  "Equipment / maintenance",
  "Financial / LOE",
];

export const CUSTOM_GROUP_BY_OPTIONS = ["None", "Lease", "Battery", "Route", "Area", "Well"];

export const CUSTOM_FILTER_FIELDS = ["Lease", "Area", "Route", "Well type"];

export const CUSTOM_FILTER_OPERATORS = ["equals", "contains", "greater than", "less than"];

export const CUSTOM_FIELD_POOL = [
  "Date",
  "Lease",
  "Oil (bbl)",
  "Water (bbl)",
  "Gas (mcf)",
  "Pressure",
  "Temperature",
  "Run hours",
];

export const VIEW_TITLES: Record<SidebarSectionKey, string> = {
  library: "Report library",
  scheduled: "Scheduled reports",
  history: "Run history",
  custom: "Report builder",
  saved: "Saved custom reports",
  recipients: "Recipients",
  groups: "Recipient groups",
};

export const SIDEBAR_GROUPS: Array<{
  title: string;
  items: Array<{ key: SidebarSectionKey; label: string; icon: LucideIcon }>;
}> = [
  {
    title: "Reports",
    items: [
      { key: "library", label: "Report library", icon: ListChecks },
      { key: "scheduled", label: "Scheduled", icon: Calendar },
      { key: "history", label: "Run history", icon: History },
    ],
  },
  {
    title: "Custom",
    items: [
      { key: "custom", label: "Report builder", icon: FileText },
      { key: "saved", label: "Saved custom", icon: FileText },
    ],
  },
  {
    title: "Delivery",
    items: [
      { key: "recipients", label: "Recipients", icon: Mail },
      { key: "groups", label: "Groups", icon: Users },
    ],
  },
];

export const DAY_MS = 24 * 60 * 60 * 1000;

export const SURFACE_CLASS =
  "border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]/95";
export const INPUT_CLASS =
  "border-black/20 bg-gray-100 text-black dark:border-white/20 dark:bg-[#252930] dark:text-white";
export const OUTLINE_BUTTON_CLASS =
  "border-black/20 bg-transparent text-black hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10";
/** Matches `Create New Alarm` on the alarms page (`alarms-tab.tsx`). */
export const CREATE_ALARM_BUTTON_CLASS =
  "flex items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black hover:bg-[#28a745] transition-colors";
export const PRIMARY_ACTION_BUTTON_CLASS =
  "h-auto rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#28a745] hover:text-black";
export const GRID_FRAME_CLASS =
  "overflow-hidden rounded-xl border border-black/10 dark:border-white/10";