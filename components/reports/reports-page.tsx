"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { AgGridReact } from "ag-grid-react";
import {
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community";

import { Check, ChevronRight, FileText, Search, X } from "lucide-react";

import { ErrorBoundary } from "@/components/error-boundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AG_GRID_CLIPBOARD_OPTIONS,
  AG_GRID_MULTI_ROW_SELECTION,
} from "@/lib/ag-grid-clipboard";
import { cn } from "@/lib/utils";

import "./reports-ag-grid-setup";
import {
  CUSTOM_DATA_SOURCES,
  CUSTOM_FIELD_POOL,
  CUSTOM_FILTER_FIELDS,
  CUSTOM_FILTER_OPERATORS,
  CUSTOM_GROUP_BY_OPTIONS,
  CUSTOM_PREVIEW_ROWS,
  CUSTOM_PREVIEW_TOTAL,
  DAY_MS,
  DELIVERY_GROUP_OPTIONS,
  FREQUENCY_OPTIONS,
  HISTORY_RANGE_OPTIONS,
  INITIAL_HISTORY,
  INITIAL_SCHEDULED_REPORTS,
  INPUT_CLASS,
  LEASE_OPTIONS,
  OUTLINE_BUTTON_CLASS,
  PRIMARY_ACTION_BUTTON_CLASS,
  RECIPIENT_GROUPS,
  RECIPIENTS,
  REPORT_LIBRARY,
  SAVED_CUSTOM_REPORTS,
  SEND_TO_OPTIONS,
  SURFACE_CLASS,
  VIEW_TITLES,
} from "./report-constants";
import { ReportsHeaderActions } from "./reports-header-actions";
import { ReportsSidebar } from "./reports-sidebar";
import {
  createId,
  formatRunDateLabel,
  resolveReportName,
  toDisplayTime,
  toTimeInput,
} from "./report-utils";
import {
  CategoryBadge,
  FormatBadge,
  GridFrame,
  StatCard,
  StatusBadge,
} from "./report-ui";
import type {
  CustomPreviewRow,
  HistoryItem,
  HistoryStatus,
  Recipient,
  RecipientGroupWithCount,
  ReportDefinition,
  ReportFormat,
  ReportsView,
  SavedCustomReport,
  ScheduledItem,
  SidebarSectionKey,
} from "./types";
import { ReportsLibraryView } from "./views/reports-library-view";

export function ReportsPage() {
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [view, setView] = React.useState<ReportsView>({ type: "library" });
  const [reportsNavCollapsed, setReportsNavCollapsed] = React.useState(false);

  const [reportSearch, setReportSearch] = React.useState("");
  const [reportCategory, setReportCategory] = React.useState("All");

  const [scheduledReports, setScheduledReports] = React.useState<ScheduledItem[]>(
    INITIAL_SCHEDULED_REPORTS,
  );
  const [historyEntries, setHistoryEntries] =
    React.useState<HistoryItem[]>(INITIAL_HISTORY);

  const [detailTab, setDetailTab] = React.useState<"configure" | "preview">(
    "configure",
  );
  const [detailFormat, setDetailFormat] = React.useState<ReportFormat>("pdf");
  const [detailFromDate, setDetailFromDate] = React.useState("2026-04-01");
  const [detailToDate, setDetailToDate] = React.useState("2026-04-08");
  const [detailLease, setDetailLease] = React.useState(LEASE_OPTIONS[0]);
  const [detailSendTo, setDetailSendTo] = React.useState(SEND_TO_OPTIONS[0]);

  const [scheduleFormat, setScheduleFormat] = React.useState<ReportFormat>("pdf");
  const [scheduleFrequency, setScheduleFrequency] = React.useState("Daily");
  const [scheduleTime, setScheduleTime] = React.useState("06:00");
  const [scheduleLease, setScheduleLease] = React.useState(LEASE_OPTIONS[0]);
  const [scheduleGroup, setScheduleGroup] = React.useState(
    DELIVERY_GROUP_OPTIONS[0],
  );
  const [scheduleIndividualInput, setScheduleIndividualInput] =
    React.useState("");
  const [scheduleIndividuals, setScheduleIndividuals] = React.useState<string[]>([
    "Chris",
  ]);

  const [historySearch, setHistorySearch] = React.useState("");
  const [historyRange, setHistoryRange] = React.useState<
    (typeof HISTORY_RANGE_OPTIONS)[number]
  >("All reports");

  const [customReportName, setCustomReportName] =
    React.useState("My custom report...");
  const [customDataSource, setCustomDataSource] = React.useState(
    CUSTOM_DATA_SOURCES[0],
  );
  const [customFields, setCustomFields] = React.useState<string[]>([
    "Date",
    "Lease",
    "Oil (bbl)",
    "Water (bbl)",
    "Gas (mcf)",
  ]);
  const [customGroupBy, setCustomGroupBy] = React.useState(
    CUSTOM_GROUP_BY_OPTIONS[0],
  );
  const [customFromDate, setCustomFromDate] = React.useState("2026-04-01");
  const [customToDate, setCustomToDate] = React.useState("2026-04-08");
  const [customFilterField, setCustomFilterField] = React.useState(
    CUSTOM_FILTER_FIELDS[0],
  );
  const [customFilterOperator, setCustomFilterOperator] = React.useState(
    CUSTOM_FILTER_OPERATORS[0],
  );
  const [customFilterValue, setCustomFilterValue] = React.useState("");
  const [customFormat, setCustomFormat] = React.useState<ReportFormat>("pdf");

  const [recipientSearch, setRecipientSearch] = React.useState("");

  const reportsByName = React.useMemo(
    () => new Map(REPORT_LIBRARY.map((report) => [report.name, report])),
    [],
  );

  const reportCategories = React.useMemo(
    () => ["All", ...new Set(REPORT_LIBRARY.map((report) => report.category))],
    [],
  );

  const selectedReportName =
    view.type === "detail" || view.type === "schedule"
      ? view.reportName
      : REPORT_LIBRARY[0].name;
  const selectedReport = reportsByName.get(selectedReportName) ?? REPORT_LIBRARY[0];

  const sidebarActiveKey: SidebarSectionKey =
    view.type === "detail"
      ? "library"
      : view.type === "schedule"
        ? "scheduled"
        : view.type;

  const gridTheme = React.useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: isDark ? "#1A1C1E" : "#ffffff",
        headerBackgroundColor: isDark ? "#252930" : "#f4f6f8",
        oddRowBackgroundColor: isDark ? "#1A1C1E" : "#f9fafb",
        rowHoverColor: isDark ? "#2d3440" : "rgba(0,0,0,0.04)",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
        foregroundColor: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.80)",
        headerTextColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.50)",
        selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
        fontSize: 13,
      }),
    [isDark],
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({ resizable: true, sortable: true }),
    [],
  );

  const openSection = React.useCallback((section: SidebarSectionKey) => {
    setView({ type: section });
  }, []);

  const openDetail = React.useCallback((reportName: string) => {
    setDetailTab("configure");
    setView({ type: "detail", reportName });
  }, []);

  const openSchedule = React.useCallback((reportName: string) => {
    setView({ type: "schedule", reportName });
  }, []);

  const hasAppliedQueryRef = React.useRef(false);
  React.useEffect(() => {
    if (hasAppliedQueryRef.current) return;

    const queryView = searchParams.get("view");
    const queryReport = searchParams.get("report");
    const resolvedReportName = resolveReportName(queryReport);

    if (queryView === "custom") openSection("custom");
    if (queryView === "saved") openSection("saved");
    if (queryView === "scheduled") openSection("scheduled");
    if (queryView === "history") openSection("history");
    if (queryView === "recipients") openSection("recipients");
    if (queryView === "groups") openSection("groups");
    if (queryView === "detail") openDetail(resolvedReportName);
    if (queryView === "schedule") openSchedule(resolvedReportName);

    hasAppliedQueryRef.current = true;
  }, [openDetail, openSchedule, openSection, searchParams]);

  const filteredReports = React.useMemo(() => {
    const query = reportSearch.trim().toLowerCase();
    return REPORT_LIBRARY.filter((report) => {
      const categoryMatch =
        reportCategory === "All" || report.category === reportCategory;
      const queryMatch =
        query.length === 0 || report.name.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
  }, [reportCategory, reportSearch]);

  const filteredHistory = React.useMemo(() => {
    const query = historySearch.trim().toLowerCase();
    return historyEntries.filter((entry) => {
      if (query.length > 0 && !entry.report.toLowerCase().includes(query)) {
        return false;
      }

      if (historyRange === "All reports") return true;

      const maxDays = historyRange === "Last 7 days" ? 7 : 30;
      const ageMs = Date.now() - new Date(entry.runAt).getTime();
      return ageMs <= maxDays * DAY_MS;
    });
  }, [historyEntries, historyRange, historySearch]);

  const filteredRecipients = React.useMemo(() => {
    const query = recipientSearch.trim().toLowerCase();
    if (!query) return RECIPIENTS;
    return RECIPIENTS.filter(
      (recipient) =>
        recipient.name.toLowerCase().includes(query) ||
        recipient.email.toLowerCase().includes(query),
    );
  }, [recipientSearch]);

  const activeSchedulesCount = React.useMemo(
    () => scheduledReports.filter((item) => item.active).length,
    [scheduledReports],
  );
  const pausedSchedulesCount = scheduledReports.length - activeSchedulesCount;

  const recipientGroupsWithCount = React.useMemo<RecipientGroupWithCount[]>(
    () =>
      RECIPIENT_GROUPS.map((group) => ({
        ...group,
        activeScheduleCount: scheduledReports.filter(
          (schedule) => schedule.group === group.name && schedule.active,
        ).length,
      })),
    [scheduledReports],
  );

  React.useEffect(() => {
    if (view.type === "detail") {
      const report = reportsByName.get(view.reportName);
      if (!report) return;
      setDetailFormat(report.formats[0]);
      return;
    }

    if (view.type === "schedule") {
      const report = reportsByName.get(view.reportName);
      if (!report) return;

      const existing = scheduledReports.find((item) => item.report === report.name);
      setScheduleFormat(existing?.format ?? report.formats[0]);
      setScheduleFrequency(existing?.frequency ?? "Daily");
      setScheduleTime(existing ? toTimeInput(existing.time) : "06:00");
      setScheduleGroup(existing?.group ?? DELIVERY_GROUP_OPTIONS[0]);
      setScheduleLease(LEASE_OPTIONS[0]);
      setScheduleIndividuals(["Chris"]);
      setScheduleIndividualInput("");
    }
  }, [reportsByName, scheduledReports, view]);

  const addHistoryEntry = React.useCallback(
    (
      entry: Omit<HistoryItem, "id" | "runDateLabel" | "runAt"> & {
        runAt?: string;
      },
    ) => {
      const runDate = entry.runAt ? new Date(entry.runAt) : new Date();
      const next: HistoryItem = {
        id: createId("history"),
        report: entry.report,
        triggeredBy: entry.triggeredBy,
        format: entry.format,
        status: entry.status,
        runAt: runDate.toISOString(),
        runDateLabel: formatRunDateLabel(runDate),
      };

      setHistoryEntries((prev) => [next, ...prev]);
    },
    [],
  );

  const handleRunNow = React.useCallback(
    (report: ReportDefinition, format: ReportFormat) => {
      addHistoryEntry({
        report: report.name,
        triggeredBy: "Manual - You",
        format,
        status: "Downloaded",
      });
    },
    [addHistoryEntry],
  );

  const handleGenerateReport = React.useCallback(() => {
    addHistoryEntry({
      report: selectedReport.name,
      triggeredBy: "Manual - You",
      format: detailFormat,
      status: detailSendTo === SEND_TO_OPTIONS[0] ? "Downloaded" : "Delivered",
    });
  }, [addHistoryEntry, detailFormat, detailSendTo, selectedReport.name]);

  const handleSaveSchedule = React.useCallback(() => {
    const nextSchedule: ScheduledItem = {
      id: createId("schedule"),
      report: selectedReport.name,
      frequency: scheduleFrequency,
      time: toDisplayTime(scheduleTime),
      format: scheduleFormat,
      group: scheduleGroup,
      active: true,
    };

    setScheduledReports((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.report === selectedReport.name,
      );
      if (existingIndex === -1) {
        return [nextSchedule, ...prev];
      }

      const next = [...prev];
      next[existingIndex] = { ...prev[existingIndex], ...nextSchedule };
      return next;
    });

    setView({ type: "scheduled" });
  }, [
    scheduleFormat,
    scheduleFrequency,
    scheduleGroup,
    scheduleTime,
    selectedReport.name,
  ]);

  const toggleScheduleStatus = React.useCallback((id: string, active: boolean) => {
    setScheduledReports((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active } : item)),
    );
  }, []);

  const addScheduleIndividual = React.useCallback(() => {
    const value = scheduleIndividualInput.trim();
    if (!value) return;
    if (
      scheduleIndividuals.some(
        (person) => person.toLowerCase() === value.toLowerCase(),
      )
    ) {
      setScheduleIndividualInput("");
      return;
    }
    setScheduleIndividuals((prev) => [...prev, value]);
    setScheduleIndividualInput("");
  }, [scheduleIndividualInput, scheduleIndividuals]);

  const removeScheduleIndividual = React.useCallback((name: string) => {
    setScheduleIndividuals((prev) => prev.filter((person) => person !== name));
  }, []);

  const addCustomField = React.useCallback(() => {
    const nextField = CUSTOM_FIELD_POOL.find((field) => !customFields.includes(field));
    if (!nextField) return;
    setCustomFields((prev) => [...prev, nextField]);
  }, [customFields]);

  const removeCustomField = React.useCallback((fieldName: string) => {
    setCustomFields((prev) => prev.filter((field) => field !== fieldName));
  }, []);

  const title =
    view.type === "detail"
      ? selectedReport.name
      : view.type === "schedule"
        ? "Schedule report"
        : VIEW_TITLES[view.type];

  const renderDetailView = () => (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-1 text-xs text-black/50 dark:text-white/50">
        <button
          type="button"
          className="text-[#34C759] hover:underline"
          onClick={() => openSection("library")}
        >
          Report library
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-black/70 dark:text-white/70">{selectedReport.name}</span>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Category"
          value={selectedReport.category}
          valueClassName="text-sm font-semibold"
        />
        <StatCard
          label="Default frequency"
          value={selectedReport.defaultFrequency}
          valueClassName="text-sm font-semibold"
        />
        <StatCard
          label="Available formats"
          value={
            <div className="flex flex-wrap gap-1.5">
              {selectedReport.formats.map((format) => (
                <FormatBadge key={`detail-${format}`} format={format} />
              ))}
            </div>
          }
          valueClassName="text-sm font-semibold"
        />
      </div>

      <Tabs
        value={detailTab}
        onValueChange={(value) => setDetailTab(value as "configure" | "preview")}
      >
        <TabsList className="h-auto w-full justify-start rounded-md bg-gray-100 p-1 dark:bg-[#252930]">
          <TabsTrigger
            value="configure"
            className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-[#1A1C1E] dark:data-[state=active]:text-white"
          >
            Configure & run
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-[#1A1C1E] dark:data-[state=active]:text-white"
          >
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="mt-4 max-w-2xl space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Output format</Label>
            <RadioGroup
              value={detailFormat}
              onValueChange={(value) => setDetailFormat(value as ReportFormat)}
              className="flex flex-wrap gap-3"
            >
              {selectedReport.formats.map((format) => (
                <label
                  key={`detail-format-${format}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
                    INPUT_CLASS,
                  )}
                >
                  <RadioGroupItem
                    value={format}
                    className="border-black/40 data-[state=checked]:border-[#34C759] data-[state=checked]:text-[#34C759] dark:border-white/40"
                  />
                  <FormatBadge format={format} />
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Date range</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                type="date"
                className={INPUT_CLASS}
                value={detailFromDate}
                onChange={(event) => setDetailFromDate(event.target.value)}
              />
              <span className="text-xs text-black/50 dark:text-white/50">to</span>
              <Input
                type="date"
                className={INPUT_CLASS}
                value={detailToDate}
                onChange={(event) => setDetailToDate(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">
              Filter by lease (optional)
            </Label>
            <Select value={detailLease} onValueChange={setDetailLease}>
              <SelectTrigger className={INPUT_CLASS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
                {LEASE_OPTIONS.map((lease) => (
                  <SelectItem key={`detail-lease-${lease}`} value={lease}>
                    {lease}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Send to</Label>
            <Select value={detailSendTo} onValueChange={setDetailSendTo}>
              <SelectTrigger className={INPUT_CLASS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
                {SEND_TO_OPTIONS.map((option) => (
                  <SelectItem key={`detail-send-${option}`} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              className={PRIMARY_ACTION_BUTTON_CLASS}
              onClick={handleGenerateReport}
            >
              <Check className="h-4 w-4" />
              Generate report
            </Button>
            <Button
              variant="outline"
              className={OUTLINE_BUTTON_CLASS}
              onClick={() => openSchedule(selectedReport.name)}
            >
              Schedule this report
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-md border border-dashed border-black/20 bg-gray-50 text-center dark:border-white/20 dark:bg-[#252930]">
            <FileText className="mb-3 h-10 w-10 text-black/30 dark:text-white/30" />
            <p className="text-sm font-medium text-black/70 dark:text-white/70">
              Report preview renders here
            </p>
            <p className="mt-1 text-xs text-black/50 dark:text-white/50">
              PDF inline viewer / Excel data table
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderScheduleView = () => (
    <div className="max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center gap-1 text-xs text-black/50 dark:text-white/50">
        <button
          type="button"
          className="text-[#34C759] hover:underline"
          onClick={() => openSection("library")}
        >
          Report library
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button
          type="button"
          className="text-[#34C759] hover:underline"
          onClick={() => openDetail(selectedReport.name)}
        >
          {selectedReport.name}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-black/70 dark:text-white/70">Schedule</span>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-black dark:text-white">Report</Label>
          <Input
            disabled
            value={selectedReport.name}
            className={cn(INPUT_CLASS, "opacity-70")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-black dark:text-white">Output format</Label>
          <RadioGroup
            value={scheduleFormat}
            onValueChange={(value) => setScheduleFormat(value as ReportFormat)}
            className="flex flex-wrap gap-3"
          >
            {selectedReport.formats.map((format) => (
              <label
                key={`schedule-format-${format}`}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
                  INPUT_CLASS,
                )}
              >
                <RadioGroupItem
                  value={format}
                  className="border-black/40 data-[state=checked]:border-[#34C759] data-[state=checked]:text-[#34C759] dark:border-white/40"
                />
                <FormatBadge format={format} />
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-black dark:text-white">Frequency</Label>
          <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
            <SelectTrigger className={INPUT_CLASS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
              {FREQUENCY_OPTIONS.map((option) => (
                <SelectItem key={`schedule-freq-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-black dark:text-white">Run time</Label>
          <Input
            type="time"
            value={scheduleTime}
            onChange={(event) => setScheduleTime(event.target.value)}
            className={cn("w-[180px]", INPUT_CLASS)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-black dark:text-white">Filter by lease</Label>
          <Select value={scheduleLease} onValueChange={setScheduleLease}>
            <SelectTrigger className={INPUT_CLASS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
              {LEASE_OPTIONS.map((lease) => (
                <SelectItem key={`schedule-lease-${lease}`} value={lease}>
                  {lease}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-black dark:text-white">Send to group</Label>
          <Select value={scheduleGroup} onValueChange={setScheduleGroup}>
            <SelectTrigger className={INPUT_CLASS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
              {DELIVERY_GROUP_OPTIONS.map((group) => (
                <SelectItem key={`schedule-group-${group}`} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-black dark:text-white">
            Also send to individuals
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={scheduleIndividualInput}
              onChange={(event) => setScheduleIndividualInput(event.target.value)}
              className={INPUT_CLASS}
              placeholder="Type name or email..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addScheduleIndividual();
                }
              }}
            />
            <Button
              variant="outline"
              className={OUTLINE_BUTTON_CLASS}
              onClick={addScheduleIndividual}
            >
              Add
            </Button>
          </div>
          {scheduleIndividuals.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {scheduleIndividuals.map((person) => (
                <span
                  key={`schedule-person-${person}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#34C759]/15 px-3 py-1 text-xs text-[#34C759]"
                >
                  {person}
                  <button
                    type="button"
                    className="rounded-full p-0.5 hover:bg-[#34C759]/20"
                    onClick={() => removeScheduleIndividual(person)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button className={PRIMARY_ACTION_BUTTON_CLASS} onClick={handleSaveSchedule}>
            Save schedule
          </Button>
          <Button
            variant="outline"
            className={OUTLINE_BUTTON_CLASS}
            onClick={() => openSection("library")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  const renderScheduledView = () => {
    const columnDefs: ColDef<ScheduledItem>[] = [
      {
        field: "report",
        headerName: "Report",
        flex: 1.8,
        minWidth: 230,
      },
      { field: "frequency", headerName: "Frequency", flex: 1.2, minWidth: 140 },
      {
        field: "time",
        headerName: "Time",
        flex: 1,
        minWidth: 110,
      },
      {
        field: "format",
        headerName: "Format",
        flex: 1,
        minWidth: 110,
        cellRenderer: ({ value }: ICellRendererParams<ScheduledItem, ReportFormat>) =>
          value ? <FormatBadge format={value} /> : null,
      },
      {
        field: "group",
        headerName: "Recipients",
        flex: 1.2,
        minWidth: 140,
        cellRenderer: ({ value }: ICellRendererParams<ScheduledItem, string>) =>
          value ? (
            <Badge className="rounded-md border-0 bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              {value}
            </Badge>
          ) : null,
      },
      {
        headerName: "Status",
        flex: 1.4,
        minWidth: 170,
        sortable: false,
        cellRenderer: ({ data }: ICellRendererParams<ScheduledItem>) => {
          if (!data) return null;
          return (
            <div
              className="flex h-full items-center gap-2"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <Switch
                checked={data.active}
                onCheckedChange={(checked) =>
                  toggleScheduleStatus(data.id, checked)
                }
                className="data-[state=checked]:bg-[#34C759] data-[state=unchecked]:bg-black/20 dark:data-[state=unchecked]:bg-white/20"
              />
              <StatusBadge status={data.active ? "Active" : "Paused"} />
            </div>
          );
        },
      },
      {
        headerName: "Actions",
        flex: 1.4,
        minWidth: 220,
        sortable: false,
        cellRenderer: ({ data }: ICellRendererParams<ScheduledItem>) => {
          if (!data) return null;
          return (
            <div
              className="flex h-full items-center justify-end gap-2"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                onClick={() => openSchedule(data.report)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                onClick={() => toggleScheduleStatus(data.id, !data.active)}
              >
                {data.active ? "Pause" : "Resume"}
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <StatCard label="Active schedules" value={activeSchedulesCount} />
          <StatCard label="Paused" value={pausedSchedulesCount} />
        </div>

        <GridFrame height={520}>
          <AgGridReact<ScheduledItem>
            theme={gridTheme}
            rowData={scheduledReports}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressMovableColumns
            rowHeight={50}
            headerHeight={44}
            rowSelection={AG_GRID_MULTI_ROW_SELECTION}
            pagination
            paginationPageSize={10}
            {...AG_GRID_CLIPBOARD_OPTIONS}
          />
        </GridFrame>
      </div>
    );
  };

  const renderHistoryView = () => {
    const columnDefs: ColDef<HistoryItem>[] = [
      {
        field: "report",
        headerName: "Report",
        flex: 1.8,
        minWidth: 220,
      },
      {
        field: "runDateLabel",
        headerName: "Run date",
        flex: 1.3,
        minWidth: 170,
      },
      {
        field: "triggeredBy",
        headerName: "Triggered by",
        flex: 1.2,
        minWidth: 140,
      },
      {
        field: "format",
        headerName: "Format",
        flex: 1,
        minWidth: 110,
        cellRenderer: ({ value }: ICellRendererParams<HistoryItem, ReportFormat>) =>
          value ? <FormatBadge format={value} /> : null,
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 110,
        cellRenderer: ({ value }: ICellRendererParams<HistoryItem, HistoryStatus>) =>
          value ? <StatusBadge status={value} /> : null,
      },
      {
        headerName: "Actions",
        flex: 1.8,
        minWidth: 260,
        sortable: false,
        cellRenderer: ({ data }: ICellRendererParams<HistoryItem>) => {
          if (!data) return null;
          return (
            <div
              className="flex h-full items-center justify-end gap-2"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
              >
                Download
              </Button>
              {data.status === "Failed" ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                    onClick={() =>
                      addHistoryEntry({
                        report: data.report,
                        triggeredBy: "Retry - You",
                        format: data.format,
                        status: "Delivered",
                      })
                    }
                  >
                    Retry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                  >
                    View error
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                  onClick={() =>
                    addHistoryEntry({
                      report: data.report,
                      triggeredBy: "Resend - You",
                      format: data.format,
                      status: "Delivered",
                    })
                  }
                >
                  Resend
                </Button>
              )}
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <div className="mb-4 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative shrink-0">
            <Search className="app-search-icon" />
            <Input
              className="app-search-input w-64"
              placeholder="Search history..."
              value={historySearch}
              onChange={(event) => setHistorySearch(event.target.value)}
            />
          </div>

          <Select
            value={historyRange}
            onValueChange={(value) =>
              setHistoryRange(value as (typeof HISTORY_RANGE_OPTIONS)[number])
            }
          >
            <SelectTrigger className={cn("w-full md:w-[220px] md:shrink-0", INPUT_CLASS)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
              {HISTORY_RANGE_OPTIONS.map((option) => (
                <SelectItem key={`history-range-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <GridFrame height={520}>
          <AgGridReact<HistoryItem>
            theme={gridTheme}
            rowData={filteredHistory}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressMovableColumns
            rowHeight={50}
            headerHeight={44}
            rowSelection={AG_GRID_MULTI_ROW_SELECTION}
            pagination
            paginationPageSize={10}
            {...AG_GRID_CLIPBOARD_OPTIONS}
          />
        </GridFrame>
      </div>
    );
  };

  const renderCustomBuilderView = () => {
    const previewColumnDefs: ColDef<CustomPreviewRow>[] = [
      { field: "date", headerName: "Date", flex: 1, minWidth: 100, sortable: false },
      { field: "lease", headerName: "Lease", flex: 1.3, minWidth: 130, sortable: false },
      {
        field: "oil",
        headerName: "Oil",
        flex: 1,
        minWidth: 90,
        sortable: false,
        cellStyle: { textAlign: "right" },
        valueFormatter: (params) => Number(params.value).toFixed(1),
      },
      {
        field: "water",
        headerName: "Water",
        flex: 1,
        minWidth: 90,
        sortable: false,
        cellStyle: { textAlign: "right" },
        valueFormatter: (params) => Number(params.value).toFixed(1),
      },
      {
        field: "gas",
        headerName: "Gas",
        flex: 1,
        minWidth: 90,
        sortable: false,
        cellStyle: { textAlign: "right" },
        valueFormatter: (params) => Number(params.value).toFixed(1),
      },
    ];

    return (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Report name</Label>
            <Input
              className={INPUT_CLASS}
              placeholder="My custom report..."
              value={customReportName}
              onChange={(event) => setCustomReportName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Data source</Label>
            <Select value={customDataSource} onValueChange={setCustomDataSource}>
              <SelectTrigger className={INPUT_CLASS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
                {CUSTOM_DATA_SOURCES.map((source) => (
                  <SelectItem key={`custom-source-${source}`} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Columns / fields</Label>
            <div className="flex flex-wrap gap-2">
              {customFields.map((field) => (
                <span
                  key={`field-${field}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#34C759]/15 px-3 py-1 text-xs text-[#34C759]"
                >
                  {field}
                  <button
                    type="button"
                    className="rounded-full p-0.5 hover:bg-[#34C759]/20"
                    onClick={() => removeCustomField(field)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <Button
              variant="outline"
              className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
              onClick={addCustomField}
              disabled={customFields.length >= CUSTOM_FIELD_POOL.length}
            >
              + Add field
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Group by</Label>
            <Select value={customGroupBy} onValueChange={setCustomGroupBy}>
              <SelectTrigger className={INPUT_CLASS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
                {CUSTOM_GROUP_BY_OPTIONS.map((option) => (
                  <SelectItem key={`custom-group-${option}`} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Date range</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                type="date"
                className={INPUT_CLASS}
                value={customFromDate}
                onChange={(event) => setCustomFromDate(event.target.value)}
              />
              <span className="text-xs text-black/50 dark:text-white/50">to</span>
              <Input
                type="date"
                className={INPUT_CLASS}
                value={customToDate}
                onChange={(event) => setCustomToDate(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Filters</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              <Select value={customFilterField} onValueChange={setCustomFilterField}>
                <SelectTrigger className={INPUT_CLASS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
                  {CUSTOM_FILTER_FIELDS.map((field) => (
                    <SelectItem key={`custom-filter-${field}`} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={customFilterOperator}
                onValueChange={setCustomFilterOperator}
              >
                <SelectTrigger className={INPUT_CLASS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]">
                  {CUSTOM_FILTER_OPERATORS.map((operator) => (
                    <SelectItem key={`custom-op-${operator}`} value={operator}>
                      {operator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                className={INPUT_CLASS}
                placeholder="Value..."
                value={customFilterValue}
                onChange={(event) => setCustomFilterValue(event.target.value)}
              />
            </div>
            <Button variant="outline" className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}>
              + Add filter
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-black dark:text-white">Output format</Label>
            <RadioGroup
              value={customFormat}
              onValueChange={(value) => setCustomFormat(value as ReportFormat)}
              className="flex flex-wrap gap-3"
            >
              {(["pdf", "xls"] as const).map((format) => (
                <label
                  key={`custom-format-${format}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
                    INPUT_CLASS,
                  )}
                >
                  <RadioGroupItem
                    value={format}
                    className="border-black/40 data-[state=checked]:border-[#34C759] data-[state=checked]:text-[#34C759] dark:border-white/40"
                  />
                  <FormatBadge format={format} />
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button className={PRIMARY_ACTION_BUTTON_CLASS}>Preview report</Button>
            <Button
              variant="outline"
              className={OUTLINE_BUTTON_CLASS}
              onClick={() => openSection("saved")}
            >
              Save as template
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-black dark:text-white">Live preview</p>
          <GridFrame height={360}>
            <AgGridReact<CustomPreviewRow>
              theme={gridTheme}
              rowData={CUSTOM_PREVIEW_ROWS}
              columnDefs={previewColumnDefs}
              defaultColDef={defaultColDef}
              suppressMovableColumns
              rowHeight={36}
              headerHeight={40}
              pagination={false}
              rowSelection={AG_GRID_MULTI_ROW_SELECTION}
              pinnedBottomRowData={CUSTOM_PREVIEW_TOTAL}
              getRowStyle={(params) =>
                params.node.rowPinned
                  ? {
                      fontWeight: 600,
                    }
                  : undefined
              }
              {...AG_GRID_CLIPBOARD_OPTIONS}
            />
          </GridFrame>
          <p className="text-center text-[11px] text-black/50 dark:text-white/50">
            Sample data - run report for actual results
          </p>
        </div>
      </div>
    );
  };

  const renderSavedCustomReportsView = () => {
    const columnDefs: ColDef<SavedCustomReport>[] = [
      {
        field: "name",
        headerName: "Report name",
        flex: 1.8,
        minWidth: 220,
      },
      {
        field: "dataSource",
        headerName: "Data source",
        flex: 1.4,
        minWidth: 180,
      },
      { field: "created", headerName: "Created", flex: 1, minWidth: 120 },
      { field: "lastRun", headerName: "Last run", flex: 1, minWidth: 120 },
      {
        field: "format",
        headerName: "Format",
        flex: 1,
        minWidth: 110,
        cellRenderer: ({
          value,
        }: ICellRendererParams<SavedCustomReport, ReportFormat>) =>
          value ? <FormatBadge format={value} /> : null,
      },
      {
        headerName: "Actions",
        flex: 1.8,
        minWidth: 260,
        sortable: false,
        cellRenderer: ({ data }: ICellRendererParams<SavedCustomReport>) => {
          if (!data) return null;
          return (
            <div
              className="flex h-full items-center justify-end gap-2"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                onClick={() =>
                  addHistoryEntry({
                    report: data.name,
                    triggeredBy: "Manual - You",
                    format: data.format,
                    status: "Downloaded",
                  })
                }
              >
                Run
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                onClick={() => {
                  setCustomReportName(data.name);
                  setCustomDataSource(data.dataSource);
                  setCustomFormat(data.format);
                  openSection("custom");
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
                onClick={() => openSection("scheduled")}
              >
                Schedule
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <GridFrame height={520}>
        <AgGridReact<SavedCustomReport>
          theme={gridTheme}
          rowData={SAVED_CUSTOM_REPORTS}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressMovableColumns
          rowHeight={50}
          headerHeight={44}
          rowSelection={AG_GRID_MULTI_ROW_SELECTION}
          pagination
          paginationPageSize={10}
          {...AG_GRID_CLIPBOARD_OPTIONS}
        />
      </GridFrame>
    );
  };

  const renderRecipientsView = () => {
    const columnDefs: ColDef<Recipient>[] = [
      { field: "name", headerName: "Name", flex: 1.1, minWidth: 140 },
      { field: "email", headerName: "Email", flex: 1.5, minWidth: 220 },
      {
        field: "groups",
        headerName: "Groups",
        flex: 1.8,
        minWidth: 240,
        sortable: false,
        cellRenderer: ({ value }: ICellRendererParams<Recipient, string[]>) => (
          <div className="flex h-full flex-wrap items-center gap-1.5">
            {(value ?? []).map((group) => (
              <Badge
                key={`recipient-group-${group}`}
                className="rounded-md border-0 bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
              >
                {group}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        headerName: "Actions",
        flex: 1,
        minWidth: 120,
        sortable: false,
        cellRenderer: () => (
          <div className="flex h-full items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
            >
              Edit
            </Button>
          </div>
        ),
      },
    ];

    return (
      <div>
        <div className="mb-4">
          <div className="relative">
            <Search className="app-search-icon" />
            <Input
              className="app-search-input w-64"
              placeholder="Search recipients..."
              value={recipientSearch}
              onChange={(event) => setRecipientSearch(event.target.value)}
            />
          </div>
        </div>

        <GridFrame height={520}>
          <AgGridReact<Recipient>
            theme={gridTheme}
            rowData={filteredRecipients}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressMovableColumns
            rowHeight={50}
            headerHeight={44}
            rowSelection={AG_GRID_MULTI_ROW_SELECTION}
            pagination
            paginationPageSize={10}
            {...AG_GRID_CLIPBOARD_OPTIONS}
          />
        </GridFrame>
      </div>
    );
  };

  const renderGroupsView = () => {
    const columnDefs: ColDef<RecipientGroupWithCount>[] = [
      { field: "name", headerName: "Group", flex: 1.2, minWidth: 160 },
      {
        field: "members",
        headerName: "Members",
        flex: 2,
        minWidth: 280,
        sortable: false,
        cellRenderer: ({
          value,
        }: ICellRendererParams<RecipientGroupWithCount, string[]>) => (
          <div className="flex h-full flex-wrap items-center gap-1.5">
            {(value ?? []).map((member) => (
              <Badge
                key={`group-member-${member}`}
                className="rounded-md border-0 bg-[#34C759]/15 px-2 py-0.5 text-[11px] font-semibold text-[#34C759]"
              >
                {member}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        field: "activeScheduleCount",
        headerName: "Scheduled reports",
        flex: 1.2,
        minWidth: 170,
        cellRenderer: ({
          value,
        }: ICellRendererParams<RecipientGroupWithCount, number>) => (
          <Badge className="rounded-md border-0 bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
            {value ?? 0} active
          </Badge>
        ),
      },
      {
        headerName: "Actions",
        flex: 1.2,
        minWidth: 180,
        sortable: false,
        cellRenderer: () => (
          <div className="flex h-full items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("h-8 text-xs", OUTLINE_BUTTON_CLASS)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ];

    return (
      <GridFrame height={520}>
        <AgGridReact<RecipientGroupWithCount>
          theme={gridTheme}
          rowData={recipientGroupsWithCount}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressMovableColumns
          rowHeight={50}
          headerHeight={44}
          rowSelection={AG_GRID_MULTI_ROW_SELECTION}
          pagination
          paginationPageSize={10}
          {...AG_GRID_CLIPBOARD_OPTIONS}
        />
      </GridFrame>
    );
  };

  const renderActiveView = () => {
    switch (view.type) {
      case "library":
        return (
          <ReportsLibraryView
            gridTheme={gridTheme}
            defaultColDef={defaultColDef}
            reportSearch={reportSearch}
            onReportSearchChange={setReportSearch}
            reportCategory={reportCategory}
            onReportCategoryChange={setReportCategory}
            reportCategories={reportCategories}
            filteredReports={filteredReports}
            activeSchedulesCount={activeSchedulesCount}
            onOpenDetail={openDetail}
            onRunNow={handleRunNow}
            onOpenSchedule={openSchedule}
          />
        );
      case "detail":
        return renderDetailView();
      case "schedule":
        return renderScheduleView();
      case "scheduled":
        return renderScheduledView();
      case "history":
        return renderHistoryView();
      case "custom":
        return renderCustomBuilderView();
      case "saved":
        return renderSavedCustomReportsView();
      case "recipients":
        return renderRecipientsView();
      case "groups":
        return renderGroupsView();
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <Card className={cn("overflow-hidden", SURFACE_CLASS)}>
        <div className="flex min-h-[720px] flex-col lg:flex-row">
          <ReportsSidebar
            collapsed={reportsNavCollapsed}
            onToggleCollapsed={() => setReportsNavCollapsed((c) => !c)}
            activeKey={sidebarActiveKey}
            onSelectSection={openSection}
          />

          <section className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
              <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
              <div className="flex items-center gap-2">
                <ReportsHeaderActions
                  view={view}
                  selectedReport={selectedReport}
                  detailFormat={detailFormat}
                  onRunNow={handleRunNow}
                  onOpenSchedule={openSchedule}
                  onOpenSection={openSection}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{renderActiveView()}</div>
          </section>
        </div>
      </Card>
    </ErrorBoundary>
  );
}
