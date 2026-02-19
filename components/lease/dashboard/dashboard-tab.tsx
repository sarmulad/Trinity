"use client";

import * as React from "react";
import { Phone, Mail, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OilTank {
  id: string;
  name: string;
  prod: string;
  timestamp: string;
  levelFt: string;
  levelBbls: string;
  theftLevelFt: string;
  theftLevelBbls: string;
}

export interface Compressor {
  runStatus: string;
  oilPressure: string;
  oilPressureAlert: boolean;
  oilTemp: number;
  timestamp: string;
}

export interface Well {
  id: string;
  name: string;
  dailyUptime: string;
  casingPressure: string;
  tubingPressure: string;
  // Producer wells
  accInjTotal?: string;
  dailyInjTotal?: string;
  allocProd?: string;
  type?: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  currentlyOn?: string;
  avatarUrl?: string;
  initials: string;
}

interface DashboardTabProps {
  oilTanks?: OilTank[];
  compressor?: Compressor;
  wells?: Well[];
  teamMembers?: TeamMember[];
  isLoading?: boolean;
  onHistoryClick?: () => void;
  onManageTeamClick?: () => void;
}

// ─── Example data ─────────────────────────────────────────────────────────────

const EXAMPLE_TANKS: OilTank[] = [
  {
    id: "1",
    name: "Oil Tank #1",
    prod: "100 BBLs",
    timestamp: "3/17/24 8:15AM",
    levelFt: "5' 6\"",
    levelBbls: "100 / 200 BBLs",
    theftLevelFt: "1' 0\"",
    theftLevelBbls: "20 / 200 BBLs",
  },
];

const EXAMPLE_COMPRESSOR: Compressor = {
  runStatus: "Running",
  oilPressure: "21 PSI",
  oilPressureAlert: true,
  oilTemp: 19,
  timestamp: "3/17/24 8:15AM",
};

const EXAMPLE_WELLS: Well[] = [
  {
    id: "1",
    name: "Johnson #1",
    dailyUptime: "99%",
    casingPressure: "12 PSI",
    tubingPressure: "21 PSI",
    accInjTotal: "200 BBLs",
    dailyInjTotal: "20 BBLs",
    timestamp: "3/17/24 8:15AM",
  },
  {
    id: "2",
    name: "Johnson #2",
    dailyUptime: "99%",
    casingPressure: "12 PSI",
    tubingPressure: "21 PSI",
    allocProd: "80%",
    type: "Gas Lift",
    timestamp: "3/17/24 8:15AM",
  },
];

const EXAMPLE_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "John Smith",
    role: "Pumper",
    currentlyOn: "Chico",
    initials: "JS",
  },
  {
    id: "2",
    name: "Luis Marcus",
    role: "Admin",
    initials: "LM",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <button
        onClick={onAction}
        className="text-sm text-[#34C759] hover:text-[#28a745]"
      >
        {actionLabel} →
      </button>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1e2025] p-4">
      {children}
    </div>
  );
}

function StatRow({
  label,
  value,
  valueClass = "text-white",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <p className="text-xs text-white/50">
      {label}: <span className={`font-medium ${valueClass}`}>{value}</span>
    </p>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function DashboardTab({
  oilTanks = EXAMPLE_TANKS,
  compressor = EXAMPLE_COMPRESSOR,
  wells = EXAMPLE_WELLS,
  teamMembers = EXAMPLE_TEAM,
  isLoading = false,
  onHistoryClick,
  onManageTeamClick,
}: DashboardTabProps) {
  return (
    <div className="space-y-6">
      {/* ── Assets ── */}
      <div>
        <SectionHeader
          title="Assets"
          actionLabel="History"
          onAction={onHistoryClick}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Oil Tank cards */}
          {oilTanks.map((tank) => (
            <Card key={tank.id}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {tank.name}
                  </p>
                  <p className="text-xs text-white/50">Prod: {tank.prod}</p>
                  <p className="text-xs text-white/40">{tank.timestamp}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-lg font-bold text-[#34C759]">
                    {tank.levelFt}
                  </p>
                  <p className="text-xs text-white/40">{tank.levelBbls}</p>
                  <p className="text-xs text-white/60">{tank.theftLevelFt}</p>
                  <p className="text-xs text-white/40">{tank.theftLevelBbls}</p>
                </div>
              </div>
            </Card>
          ))}

          {/* Compressor card */}
          <Card>
            <p className="mb-2 text-sm font-semibold text-white">Compressor</p>
            <div className="space-y-1">
              <StatRow label="Run Status" value={compressor.runStatus} />
              <StatRow
                label="Oil Pressure"
                value={
                  <>
                    {compressor.oilPressure}
                    {compressor.oilPressureAlert && (
                      <span className="ml-1 text-red-400"> ⚠</span>
                    )}
                  </>
                }
                valueClass={
                  compressor.oilPressureAlert ? "text-red-400" : "text-white"
                }
              />
              <StatRow label="Oil Temp" value={compressor.oilTemp} />
              <p className="pt-1 text-xs text-white/30">
                {compressor.timestamp}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Wells ── */}
      <div>
        <SectionHeader
          title="Wells"
          actionLabel="History"
          onAction={onHistoryClick}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {wells.map((well) => (
            <Card key={well.id}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="mb-2 text-sm font-semibold text-white">
                    {well.name}
                  </p>
                  <StatRow label="Daily Uptime" value={well.dailyUptime} />
                  <StatRow
                    label="Casing Pressure"
                    value={well.casingPressure}
                  />
                  {well.accInjTotal && (
                    <StatRow label="Acc. Inj. Total" value={well.accInjTotal} />
                  )}
                  {well.allocProd && (
                    <StatRow label="Alloc. Prod." value={well.allocProd} />
                  )}
                </div>
                <div className="text-right space-y-1">
                  <StatRow
                    label="Tubing Pressure"
                    value={well.tubingPressure}
                  />
                  {well.dailyInjTotal && (
                    <StatRow
                      label="Daily Inj. Total"
                      value={well.dailyInjTotal}
                    />
                  )}
                  {well.type && <StatRow label="Type" value={well.type} />}
                  <p className="pt-1 text-xs text-white/30">{well.timestamp}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Teams ── */}
      <div>
        <SectionHeader
          title="Teams"
          actionLabel="Manage"
          onAction={onManageTeamClick}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <div className="flex items-center gap-4">
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback className="bg-[#2d3440] text-sm text-white">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">
                    {member.name}
                  </p>
                  <p className="text-xs text-[#34C759]">{member.role}</p>
                  {member.currentlyOn && (
                    <p className="text-xs text-white/40">
                      Currently On: {member.currentlyOn}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  {[Phone, Mail, Mail, MoreVertical].map((Icon, i) => (
                    <button
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
