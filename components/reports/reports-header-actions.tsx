"use client";

import * as React from "react";
import { Play, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  CREATE_ALARM_BUTTON_CLASS,
  PRIMARY_ACTION_BUTTON_CLASS,
  REPORT_LIBRARY,
} from "./report-constants";
import type { ReportDefinition, ReportsView, SidebarSectionKey } from "./types";

type ReportsHeaderActionsProps = {
  view: ReportsView;
  selectedReport: ReportDefinition;
  detailFormat: ReportDefinition["formats"][number];
  onRunNow: (report: ReportDefinition, format: ReportDefinition["formats"][number]) => void;
  onOpenSchedule: (reportName: string) => void;
  onOpenSection: (section: SidebarSectionKey) => void;
};

export function ReportsHeaderActions({
  view,
  selectedReport,
  detailFormat,
  onRunNow,
  onOpenSchedule,
  onOpenSection,
}: ReportsHeaderActionsProps) {
  if (view.type === "detail") {
    return (
      <Button
        className={PRIMARY_ACTION_BUTTON_CLASS}
        onClick={() => onRunNow(selectedReport, detailFormat)}
      >
        <Play className="h-4 w-4" />
        Run now
      </Button>
    );
  }

  if (view.type === "scheduled") {
    return (
      <button
        type="button"
        className={CREATE_ALARM_BUTTON_CLASS}
        onClick={() => onOpenSchedule(REPORT_LIBRARY[0].name)}
      >
        <PlusCircle className="h-4 w-4" />
        New schedule
      </button>
    );
  }

  if (view.type === "custom") {
    return (
      <Button
        className={PRIMARY_ACTION_BUTTON_CLASS}
        onClick={() => onOpenSection("saved")}
      >
        Save as template
      </Button>
    );
  }

  if (view.type === "saved") {
    return (
      <button
        type="button"
        className={CREATE_ALARM_BUTTON_CLASS}
        onClick={() => onOpenSection("custom")}
      >
        <PlusCircle className="h-4 w-4" />
        New report
      </button>
    );
  }

  if (view.type === "recipients") {
    return (
      <button type="button" className={CREATE_ALARM_BUTTON_CLASS}>
        <PlusCircle className="h-4 w-4" />
        Add recipient
      </button>
    );
  }

  if (view.type === "groups") {
    return (
      <button type="button" className={CREATE_ALARM_BUTTON_CLASS}>
        <PlusCircle className="h-4 w-4" />
        New group
      </button>
    );
  }

  return null;
}
