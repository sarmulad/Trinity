"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  X,
  BarChart2,
  Table2,
  Phone,
  MessageCircle,
  Mail,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TankVisual } from "./tank-visual";
import { LabelsPanel } from "./labels-panel";
import { DataTable } from "./data-table";
import { LevelChart } from "./level-chart";
import { EXAMPLE_TANK_DETAIL } from "./example-data";
import { EfmWorkspace } from "./efm-workspace";
import type { EfmWorkspaceData } from "./efm-workspace";
import type {
  OilTank,
  EFMChart,
  FilterPot,
  WaterTank,
  Compressor,
  Separator,
  Well,
  TeamMember,
} from "../types";

const TEST_TABLE_DATA = EXAMPLE_TANK_DETAIL.tableData;
const TEST_CHART_DATA = EXAMPLE_TANK_DETAIL.chartData;
const TEST_LABELS = EXAMPLE_TANK_DETAIL.labels;
const TEST_TOTAL_ENTRIES = EXAMPLE_TANK_DETAIL.totalEntries;

function buildMockEfmWorkspace(e: EFMChart): EfmWorkspaceData {
  const currentValues = e.currentValues ?? [
    { label: "Line Pressure", value: "182 PSI" },
    { label: "Static Pressure", value: "174 PSI" },
    { label: "Flow Temp", value: "74.2 F" },
    { label: "Differential", value: "16.8 inH2O" },
    { label: "Volume Rate", value: "21.4 MCFH" },
    { label: "Energy Rate", value: "22.1 MMBtu" },
    { label: "Battery", value: "13.7 V" },
    { label: "RSSI", value: "-79 dBm" },
  ];

  return {
    currentValues,
    datasets: [
      {
        key: "daily",
        label: "Daily",
        updatedAt: "Daily records",
        chartYLabel: "MCF/D",
        rows: [
          {
            DateTime: "03/23/2026 00:00:00",
            "Diff. Pressure (In. H2O)": 25.82,
            "Static Pressure (PSIA)": 15.69,
            "Temp (Deg. F)": 56.17,
            "Volume (MCF)": 286.17,
            "Energy (MMBtu)": 281.51,
            "Flow Time (%)": 100.0,
            Alarms: "LC",
            "Back Flow (%)": 0.0,
            "Max DP (In. H2O)": 27.46,
          },
          {
            DateTime: "03/22/2026 00:00:00",
            "Diff. Pressure (In. H2O)": 25.51,
            "Static Pressure (PSIA)": 15.66,
            "Temp (Deg. F)": 70.76,
            "Volume (MCF)": 280.42,
            "Energy (MMBtu)": 275.84,
            "Flow Time (%)": 100.0,
            Alarms: "LC",
            "Back Flow (%)": 0.0,
            "Max DP (In. H2O)": 27.36,
          },
          {
            DateTime: "03/21/2026 00:00:00",
            "Diff. Pressure (In. H2O)": 25.58,
            "Static Pressure (PSIA)": 15.74,
            "Temp (Deg. F)": 76.24,
            "Volume (MCF)": 279.97,
            "Energy (MMBtu)": 275.41,
            "Flow Time (%)": 100.0,
            Alarms: "LC",
            "Back Flow (%)": 0.0,
            "Max DP (In. H2O)": 27.25,
          },
          {
            DateTime: "03/20/2026 00:00:00",
            "Diff. Pressure (In. H2O)": 25.89,
            "Static Pressure (PSIA)": 15.90,
            "Temp (Deg. F)": 73.23,
            "Volume (MCF)": 283.93,
            "Energy (MMBtu)": 279.30,
            "Flow Time (%)": 100.0,
            Alarms: "LC",
            "Back Flow (%)": 0.0,
            "Max DP (In. H2O)": 27.25,
          },
        ],
        chartData: [
          { date: "03/30", value: 486 },
          { date: "03/31", value: 503 },
          { date: "04/01", value: 495 },
          { date: "04/02", value: 512 },
          { date: "04/03", value: 500 },
        ],
      },
      {
        key: "logPeriod",
        label: "Hourly",
        updatedAt: "Hourly records",
        chartYLabel: "MCFH",
        rows: [
          {
            DateTime: "03/24/2026 07:00-08:00",
            "Diff. Pressure (In. H2O)": 25.89,
            "Static Pressure (PSIA)": 15.67,
            "Temp (Deg. F)": 55.55,
            "Volume (MCF)": 11.94,
            "Flow Rate (MCF/Day)": 286.6,
            "Energy (MMBtu)": 11.75,
            "Flow Time (%)": 100.0,
            Alarms: "LC",
          },
          {
            DateTime: "03/24/2026 06:00-07:00",
            "Diff. Pressure (In. H2O)": 26.07,
            "Static Pressure (PSIA)": 15.85,
            "Temp (Deg. F)": 54.42,
            "Volume (MCF)": 12.06,
            "Flow Rate (MCF/Day)": 289.53,
            "Energy (MMBtu)": 11.87,
            "Flow Time (%)": 100.0,
            Alarms: "LC",
          },
          {
            DateTime: "03/24/2026 05:00-06:00",
            "Diff. Pressure (In. H2O)": 25.68,
            "Static Pressure (PSIA)": 15.62,
            "Temp (Deg. F)": 55.27,
            "Volume (MCF)": 11.88,
            "Flow Rate (MCF/Day)": 285.07,
            "Energy (MMBtu)": 11.68,
            "Flow Time (%)": 100.0,
            Alarms: "LC",
          },
        ],
        chartData: [
          { date: "07:00", value: 20.8 },
          { date: "08:00", value: 21.4 },
          { date: "09:00", value: 22.1 },
          { date: "10:00", value: 21.7 },
          { date: "11:00", value: 22.4 },
        ],
      },
      {
        key: "spot",
        label: "Spot Values",
        updatedAt: "Updated 2 mins ago",
        chartYLabel: "Spot Value",
        rows: [
          {
            DateTime: "03/24/2026 09:08:34",
            "Diff. Pressure (In. H2O)": 25.72,
            "Static Pressure (PSIA)": 15.61,
            "Temp (Deg. F)": 57.23,
            "Flow Rate (MCF/Day)": 284.69,
            "Today Vol (MCF)": 101.52,
            "Yest. Vol (MCF)": 286.17,
            "Accum Vol (MCF)": "219,157.86",
            "Battery (Volts)": 13.43,
          },
          {
            DateTime: "03/24/2026 08:08:58",
            "Diff. Pressure (In. H2O)": 26.1,
            "Static Pressure (PSIA)": 15.69,
            "Temp (Deg. F)": 55.6,
            "Flow Rate (MCF/Day)": 287.89,
            "Today Vol (MCF)": 89.82,
            "Yest. Vol (MCF)": 286.17,
            "Accum Vol (MCF)": "219,146.16",
            "Battery (Volts)": 12.77,
          },
          {
            DateTime: "03/24/2026 07:08:59",
            "Diff. Pressure (In. H2O)": 25.61,
            "Static Pressure (PSIA)": 15.88,
            "Temp (Deg. F)": 54.17,
            "Flow Rate (MCF/Day)": 287.34,
            "Today Vol (MCF)": 77.82,
            "Yest. Vol (MCF)": 286.17,
            "Accum Vol (MCF)": "219,134.16",
            "Battery (Volts)": 12.7,
          },
        ],
        chartData: [
          { date: "08:00", value: 182 },
          { date: "09:00", value: 181 },
          { date: "10:00", value: 184 },
          { date: "11:00", value: 183 },
          { date: "12:00", value: 182 },
        ],
      },
      {
        key: "configuration",
        label: "Configuration",
        updatedAt: "Config and history",
        chartYLabel: "Config Changes",
        rows: [
          {
            DateTime: "01/22/2026 16:53:16",
            "Meter ID": 91052,
            "Totalflow Software": "6213 uFlo Flash",
            "OrificeSize (In.)": 1.5,
            "PBase (PSI)": 14.65,
            "PipeSize (In.)": 6.063,
            "TBase (Deg. F)": 60.0,
            "BTU (Ratio)": 983.7,
            "Gravity (Ratio)": 0.5823,
            "N2 (Mol %)": 2.7391,
            "CO2 (Mol %)": 0.8796,
            "H2S (Mol %)": 0.0,
            "H2O (Mol %)": 0.0,
            "Helium (Mol %)": 0.0327,
            "Methane (Mol %)": 95.4038,
            "Ethane (Mol %)": 0.6629,
            "Propane (Mol %)": 0.1206,
            "NButane (Mol %)": 0.0366,
            "IButane (Mol %)": 0.0347,
            "NPentane (Mol %)": 0.0135,
            "IPentane (Mol %)": 0.0208,
            "NHexane (Mol %)": 0.0557,
            "NHeptane (Mol %)": 0.0,
            "NOctane (Mol %)": 0.0,
            "NNonane (Mol %)": 0.0,
            "NDecane (Mol %)": 0.0,
            "Oxygen (Mol %)": 0.0,
            "CO (Mol %)": 0.0,
            "Hydrogen (Mol %)": 0.0,
            "Argon (Mol %)": 0.0,
          },
          {
            DateTime: "04/11/2024 14:08:29",
            "Meter ID": 91052,
            "Totalflow Software": "6213 uFlo Flash",
            "OrificeSize (In.)": 1.5,
            "PBase (PSI)": 14.65,
            "PipeSize (In.)": 6.063,
            "TBase (Deg. F)": 60.0,
            "BTU (Ratio)": 983.7,
            "Gravity (Ratio)": 0.5823,
            "N2 (Mol %)": 2.7391,
            "CO2 (Mol %)": 0.8796,
            "H2S (Mol %)": 0.0,
            "H2O (Mol %)": 0.0,
            "Helium (Mol %)": 0.0327,
            "Methane (Mol %)": 95.4038,
            "Ethane (Mol %)": 0.6629,
            "Propane (Mol %)": 0.1206,
            "NButane (Mol %)": 0.0366,
            "IButane (Mol %)": 0.0347,
            "NPentane (Mol %)": 0.0135,
            "IPentane (Mol %)": 0.0208,
            "NHexane (Mol %)": 0.0557,
            "NHeptane (Mol %)": 0.0,
            "NOctane (Mol %)": 0.0,
            "NNonane (Mol %)": 0.0,
            "NDecane (Mol %)": 0.0,
            "Oxygen (Mol %)": 0.0,
            "CO (Mol %)": 0.0,
            "Hydrogen (Mol %)": 0.0,
            "Argon (Mol %)": 0.0,
          },
          {
            DateTime: "03/22/2023 16:48:49",
            "Meter ID": 91052,
            "Totalflow Software": "6213 uFlo Flash",
            "OrificeSize (In.)": 2.0,
            "PBase (PSI)": 14.65,
            "PipeSize (In.)": 6.063,
            "TBase (Deg. F)": 60.0,
            "BTU (Ratio)": 983.7,
            "Gravity (Ratio)": 0.5823,
            "N2 (Mol %)": 2.7391,
            "CO2 (Mol %)": 0.8796,
            "H2S (Mol %)": 0.0,
            "H2O (Mol %)": 0.0,
            "Helium (Mol %)": 0.0327,
            "Methane (Mol %)": 95.4038,
            "Ethane (Mol %)": 0.6629,
            "Propane (Mol %)": 0.1206,
            "NButane (Mol %)": 0.0366,
            "IButane (Mol %)": 0.0347,
            "NPentane (Mol %)": 0.0135,
            "IPentane (Mol %)": 0.0208,
            "NHexane (Mol %)": 0.0557,
            "NHeptane (Mol %)": 0.0,
            "NOctane (Mol %)": 0.0,
            "NNonane (Mol %)": 0.0,
            "NDecane (Mol %)": 0.0,
            "Oxygen (Mol %)": 0.0,
            "CO (Mol %)": 0.0,
            "Hydrogen (Mol %)": 0.0,
            "Argon (Mol %)": 0.0,
          },
        ],
        chartData: [
          { date: "03/20", value: 1 },
          { date: "03/28", value: 2 },
          { date: "04/01", value: 3 },
          { date: "04/03", value: 3 },
        ],
      },
      {
        key: "events",
        label: "Events",
        updatedAt: "Latest events",
        chartYLabel: "Event Count",
        rows: [
          {
            DateTime: "04/10/2024 15:51:22",
            Code: 1,
            Description: "Reset time and date",
            "Old Value": "2024-04-10 15:51:22",
            "New Value": "2024-04-10 15:28:36",
          },
          {
            DateTime: "04/10/2024 15:41:23",
            Code: 10,
            Description: "Reset Volume",
            "Old Value": "1160793980",
            "New Value": "0",
          },
          {
            DateTime: "08/04/2023 15:43:49",
            Code: 50,
            Description: "Site Code",
            "Old Value": "-3",
            "New Value": "-3",
          },
        ],
        chartData: [
          { date: "Mon", value: 2 },
          { date: "Tue", value: 1 },
          { date: "Wed", value: 3 },
          { date: "Thu", value: 2 },
          { date: "Fri", value: 4 },
        ],
      },
      {
        key: "alarms",
        label: "Alarms",
        updatedAt: "Latest alarms",
        chartYLabel: "Alarm Count",
        rows: Array.from({ length: 50 }, (_, i) => {
          const minuteOffset = i * 60;
          const base = new Date("2026-03-20T17:00:00");
          base.setMinutes(base.getMinutes() - minuteOffset);
          const stamp = base
            .toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })
            .replace(",", "");

          const isLowFlowRow = i % 2 === 0;
          return {
            alarmTag: isLowFlowRow ? "LowFlowCutOff" : "DifferentialPressure",
            state: isLowFlowRow ? (i % 6 === 0 ? "On" : "Off") : i % 5 === 0 ? "Low" : "Off",
            value: isLowFlowRow
              ? "Low Flow"
              : i % 5 === 0
                ? "Differential Pressure Low"
                : "Differential Pressure",
            condition: "",
            alarmTimestamp: stamp,
            polledDateAndTime: stamp,
          };
        }),
        chartData: [
          { date: "Mon", value: 1 },
          { date: "Tue", value: 0 },
          { date: "Wed", value: 2 },
          { date: "Thu", value: 1 },
          { date: "Fri", value: 3 },
        ],
      },
    ],
  };
}

export interface DetailViewData {
  name: string;
  stats: { label: string; value: string }[];
  alarmNotice?: {
    title: string;
    description: string;
  };
  showTabs?: boolean;
  efmWorkspace?: EfmWorkspaceData;
  teamContact?: {
    role: string;
    roleColor?: string;
    currentlyOn?: string;
    avatarUrl?: string;
    initials: string;
    phone?: string;
    email?: string;
  };
  visual?: {
    fillRatio: number;
    alarmRatio: number;
    exitRatio: number;
    topGaugeFt: string;
    topGaugeBbls: string;
    interfaceFt: string;
    interfaceBbls: string;
    timestamp: string;
  };
  labels?: React.ComponentProps<typeof LabelsPanel>["labels"];
  tableData: React.ComponentProps<typeof DataTable>["rows"];
  totalEntries: number;
  chartData: React.ComponentProps<typeof LevelChart>["data"];
  xAxisLabel?: string;
}

export function oilTankToDetail(t: OilTank): DetailViewData {
  return {
    name: t.name,
    stats: [],
    visual: {
      fillRatio: 0.48,
      alarmRatio: 0.08,
      exitRatio: 0.2,
      topGaugeFt: t.levelFt,
      topGaugeBbls: t.levelBbls,
      interfaceFt: t.theftLevelFt,
      interfaceBbls: t.theftLevelBbls,
      timestamp: t.timestamp,
    },
    labels: TEST_LABELS,
    tableData: TEST_TABLE_DATA,
    totalEntries: TEST_TOTAL_ENTRIES,
    chartData: TEST_CHART_DATA,
    xAxisLabel: "Oil Tank (FT)",
  };
}

export function waterTankToDetail(t: WaterTank): DetailViewData {
  return {
    name: t.name,
    stats: [],
    visual: {
      fillRatio: 0.35,
      alarmRatio: 0.1,
      exitRatio: 0.15,
      topGaugeFt: t.levelFt,
      topGaugeBbls: t.levelBbls,
      interfaceFt: t.theftLevelFt,
      interfaceBbls: t.theftLevelBbls,
      timestamp: t.timestamp,
    },
    labels: TEST_LABELS,
    tableData: TEST_TABLE_DATA,
    totalEntries: TEST_TOTAL_ENTRIES,
    chartData: TEST_CHART_DATA,
    xAxisLabel: "Water Tank (FT)",
  };
}

export function efmToDetail(e: EFMChart): DetailViewData {
  return {
    name: e.name,
    showTabs: false,
    efmWorkspace: buildMockEfmWorkspace(e),
    stats: [
      { label: "MCF/D", value: e.mcfd },
      { label: "Yesterday Volume", value: e.yesterdayVolume },
      { label: "Timestamp", value: e.timestamp },
    ],
    tableData: TEST_TABLE_DATA,
    totalEntries: TEST_TOTAL_ENTRIES,
    chartData: TEST_CHART_DATA,
    xAxisLabel: "Volume (MCF)",
  };
}

export function filterPotToDetail(f: FilterPot): DetailViewData {
  return {
    name: "Filter Pot",
    stats: [
      { label: "Inlet PSI", value: f.inletPsi },
      { label: "Outlet PSI", value: f.outletPsi },
      { label: "Filter Type", value: f.filterType },
      { label: "Last Filter Install", value: f.lastFilterInstall },
      { label: "Timestamp", value: f.timestamp },
    ],
    tableData: TEST_TABLE_DATA,
    totalEntries: TEST_TOTAL_ENTRIES,
    chartData: TEST_CHART_DATA,
    xAxisLabel: "Pressure (PSI)",
  };
}

export function compressorToDetail(c: Compressor): DetailViewData {
  return {
    name: c.name,
    alarmNotice: c.oilPressureAlert
      ? {
          title: "Active Alarm",
          description: "Oil pressure is in alarm. Open alarms to review the active condition.",
        }
      : undefined,
    stats: [
      { label: "Run Status", value: c.runStatus },
      { label: "Oil Pressure", value: c.oilPressure },
      { label: "Oil Temp", value: `${c.oilTemp}` },
      { label: "Battery Level", value: c.batteryLevel },
      { label: "RSSI", value: `${c.rssi}` },
      { label: "Discharge Pressure", value: `${c.dischargePressure}` },
      { label: "Timestamp", value: c.timestamp },
    ],
    tableData: TEST_TABLE_DATA,
    totalEntries: TEST_TOTAL_ENTRIES,
    chartData: TEST_CHART_DATA,
    xAxisLabel: "Pressure",
  };
}

export function separatorToDetail(s: Separator): DetailViewData {
  return {
    name: "Separator",
    stats: [
      { label: "Today Volume", value: s.todayVolumeFt },
      { label: "Yest. Volume", value: s.yesterdayVolume },
      { label: "Accum. Volume", value: s.accumVolume },
      { label: "Flow Rate", value: s.flowRate },
      { label: "Timestamp", value: s.timestamp },
    ],
    tableData: TEST_TABLE_DATA,
    totalEntries: TEST_TOTAL_ENTRIES,
    chartData: TEST_CHART_DATA,
    xAxisLabel: "Flow Rate",
  };
}

export function wellToDetail(w: Well): DetailViewData {
  return {
    name: w.name,
    stats: [
      { label: "Daily Uptime", value: w.dailyUptime },
      { label: "Casing Pressure", value: w.casingPressure },
      { label: "Tubing Pressure", value: w.tubingPressure },
      ...(w.allocProd ? [{ label: "Alloc. Prod", value: w.allocProd }] : []),
      ...(w.accInjTotal
        ? [{ label: "Acc. Inj. Total", value: w.accInjTotal }]
        : []),
      ...(w.dailyInjTotal
        ? [{ label: "Daily Inj. Total", value: w.dailyInjTotal }]
        : []),
      { label: "Timestamp", value: w.timestamp },
    ],
    tableData: TEST_TABLE_DATA,
    totalEntries: TEST_TOTAL_ENTRIES,
    chartData: TEST_CHART_DATA,
    xAxisLabel: "Pressure",
  };
}

export function teamMemberToDetail(member: TeamMember): DetailViewData {
  return {
    name: member.name,
    showTabs: false,
    stats: [],
    teamContact: {
      role: member.role,
      roleColor: member.roleColor,
      currentlyOn: member.currentlyOn,
      avatarUrl: member.avatarUrl,
      initials: member.initials,
      phone: member.phone,
      email: member.email,
    },
    tableData: [],
    totalEntries: 0,
    chartData: [],
    xAxisLabel: "Team Activity",
  };
}

type Tab = "table" | "chart";

interface DetailViewProps {
  data: DetailViewData;
  onClose?: () => void;
}

export function DetailView({ data, onClose }: DetailViewProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = React.useState<Tab>("table");
  const showTabs = data.showTabs ?? true;
  const hasEfmWorkspace = !!data.efmWorkspace;
  const hasTeamContact = !!data.teamContact;

  const hasVisual = !!data.visual;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "table",
      label: "Data Table",
      icon: <Table2 className="h-3.5 w-3.5" />,
    },
    {
      id: "chart",
      label: "Level Chart",
      icon: <BarChart2 className="h-3.5 w-3.5" />,
    },
  ];

  const topSection = hasEfmWorkspace ? (
    <EfmWorkspace data={data.efmWorkspace!} />
  ) : hasTeamContact ? (
    <div className="rounded-xl border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 shrink-0 ring-2 ring-white/10">
          <AvatarImage src={data.teamContact!.avatarUrl} />
          <AvatarFallback className="bg-[#2d3440] text-white text-base">
            {data.teamContact!.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{
                color: data.teamContact!.roleColor ?? "#34C759",
                backgroundColor: `${data.teamContact!.roleColor ?? "#34C759"}22`,
              }}
            >
              {data.teamContact!.role}
            </span>
            {data.teamContact!.currentlyOn && (
              <span className="text-xs text-black/50 dark:text-white/50">
                Assigned: {data.teamContact!.currentlyOn}
              </span>
            )}
          </div>

          <div className="mt-4 grid gap-2">
            <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/[0.02]">
              <span className="text-xs text-black/55 dark:text-white/55">Phone</span>
              <span className="text-sm font-semibold text-black dark:text-white">
                {data.teamContact!.phone ?? "Not available"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/[0.02]">
              <span className="text-xs text-black/55 dark:text-white/55">Email</span>
              <span className="text-sm font-semibold text-black dark:text-white">
                {data.teamContact!.email ?? "Not available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={data.teamContact!.phone ? `tel:${data.teamContact!.phone}` : "#"}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#34C759]/40 bg-[#34C759]/15 px-3 py-1.5 text-xs font-semibold text-[#7DFF9F] hover:bg-[#34C759]/25"
          onClick={(e) => {
            if (!data.teamContact!.phone) e.preventDefault();
          }}
        >
          <Phone className="h-3.5 w-3.5" />
          Call
        </a>
        <a
          href={data.teamContact!.phone ? `sms:${data.teamContact!.phone}` : "#"}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/[0.08]"
          onClick={(e) => {
            if (!data.teamContact!.phone) e.preventDefault();
          }}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Message
        </a>
        <a
          href={
            data.teamContact!.email ? `mailto:${data.teamContact!.email}` : "#"
          }
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/[0.08]"
          onClick={(e) => {
            if (!data.teamContact!.email) e.preventDefault();
          }}
        >
          <Mail className="h-3.5 w-3.5" />
          Email
        </a>
      </div>
    </div>
  ) : hasVisual ? (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="shrink-0">
        <TankVisual
          fillRatio={data.visual!.fillRatio}
          alarmRatio={data.visual!.alarmRatio}
          exitRatio={data.visual!.exitRatio}
          labels={data.labels}
          levelText={data.visual!.topGaugeFt}
          showLevelText={false}
        />
      </div>

      <div className="flex-1 space-y-5">
        {data.labels && <LabelsPanel labels={data.labels} />}
        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
          <p className="text-xs text-black/45 dark:text-white/45">
            {data.visual!.timestamp}
          </p>
          <div className="mt-3 flex items-end gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-black dark:text-white">
                {data.visual!.topGaugeFt}
              </p>
              <p className="text-sm text-black/45 dark:text-white/45">
                Tank Level
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <p className="text-sm text-black/80 dark:text-white/80">
              <span className="font-semibold">Top Gauge:</span>{" "}
              {data.visual!.topGaugeFt} | {data.visual!.topGaugeBbls}
            </p>
            <p className="text-sm text-black/80 dark:text-white/80">
              <span className="font-semibold">Interface:</span>{" "}
              {data.visual!.interfaceFt} | {data.visual!.interfaceBbls}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="rounded-lg border border-black/10 bg-black/[0.03] p-4 grid grid-cols-2 gap-x-6 gap-y-2 dark:border-white/10 dark:bg-white/5">
      {data.stats.map((s) => (
        <div key={s.label} className="flex justify-between items-center">
          <span className="text-xs text-black/50 dark:text-white/50">{s.label}</span>
          <span className="text-xs font-semibold text-black dark:text-white">{s.value}</span>
        </div>
      ))}
    </div>
  );

  const alarmSection = data.alarmNotice ? (
    <button
      type="button"
      onClick={() => {
        onClose?.();
        router.push("/dashboard/alarms");
      }}
      className="flex w-full items-center justify-between rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-left transition-colors hover:bg-red-500/15"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 text-red-400">
          <Bell className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-black dark:text-white">
            {data.alarmNotice.title}
          </p>
          <p className="text-xs text-black/60 dark:text-white/60">
            {data.alarmNotice.description}
          </p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-300">
        Open Alarms
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </button>
  ) : null;

  const tabSection = (
    <div>
      <div className="mb-4 flex items-center gap-1 border-b border-black/10 dark:border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? "border-[#34C759] text-[#34C759]"
                : "border-transparent text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "table" && (
        <DataTable rows={data.tableData} totalEntries={data.totalEntries} />
      )}
      {activeTab === "chart" && (
        <LevelChart data={data.chartData} xAxisLabel={data.xAxisLabel ?? ""} />
      )}
    </div>
  );

  const header = (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-bold text-black dark:text-white">{data.name}</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-sm text-[#34C759] hover:text-[#28a745] transition-colors"
        >
          Close <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen space-y-4 p-6 lg:p-8 ${
        isDark ? "bg-[#16181d]" : "bg-white"
      }`}
    >
      {header}
      {alarmSection}
      {topSection}
      {showTabs && tabSection}
    </div>
  );
}
