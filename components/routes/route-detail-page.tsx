"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Beaker,
  Calendar,
  ChevronDown,
  ChevronRight,
  Check,
  ClipboardList,
  CircleHelp,
  FileText,
  History,
  ListChecks,
  RefreshCcw,
  Save,
  Square,
  Ticket,
  Minus,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RouteSubmissionsSection } from "./route-submissions-section";

type StopStatus = "complete" | "active" | "pending";

interface StopItem {
  id: string;
  name: string;
  distance: string;
  coordinates: string;
  status: StopStatus;
}

const STOPS: StopItem[] = [
  {
    id: "1",
    name: "Riordan Lease",
    distance: "0.2 miles",
    coordinates: "35.6870° N, 105.9378° W",
    status: "complete",
  },
  {
    id: "2",
    name: "Teasley Lease",
    distance: "1.2 miles",
    coordinates: "35.6870° N, 105.9378° W",
    status: "complete",
  },
  {
    id: "3",
    name: "David Lease",
    distance: "0.2 miles",
    coordinates: "35.6870° N, 105.9378° W",
    status: "active",
  },
  {
    id: "4",
    name: "Riffle Lease",
    distance: "0.3 miles",
    coordinates: "35.6870° N, 107.9378° W",
    status: "pending",
  },
  {
    id: "5",
    name: "River Estate Lease",
    distance: "0.2 miles",
    coordinates: "35.2299° N, 105.9378° W",
    status: "pending",
  },
];

function prettifyRouteId(routeId: string) {
  const normalized = decodeURIComponent(routeId).replace(/[-_]+/g, " ").trim();
  if (!normalized) return "Johnson Route";
  return normalized.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

interface RouteDetailPageProps {
  routeId: string;
  routeName?: string;
}

type TabId = "route" | "history";
type WorkTabId = "forms" | "tickets" | "tests";

interface NumberStepperProps {
  label: string;
  help?: string;
  value: number;
  step?: number;
  min?: number;
  max?: number;
  decimals?: number;
  onChange: (value: number) => void;
}

function NumberStepper({
  label,
  help,
  value,
  step = 1,
  min = 0,
  max,
  decimals = 0,
  onChange,
}: NumberStepperProps) {
  const formatValue = (next: number) =>
    decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next);

  const clampValue = (next: number) => {
    const normalized = formatValue(next);
    const withMin = Math.max(min, normalized);
    return max != null ? Math.min(max, withMin) : withMin;
  };

  const update = (next: number) => onChange(clampValue(next));

  return (
    <div className="space-y-1">
      <label className="inline-flex items-center gap-1 text-xs text-black/70 dark:text-white/70">
        {label}
        {help ? <CircleHelp className="h-3 w-3" title={help} /> : null}
      </label>
      <div className="flex items-center overflow-hidden rounded-md border border-black/20 bg-white dark:border-white/20 dark:bg-[#151A21]">
        <button
          type="button"
          onClick={() => update(value - step)}
          className="flex h-8 w-9 items-center justify-center text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => update(Number(e.target.value))}
          className="h-8 rounded-none border-0 border-x border-black/10 bg-transparent px-2 text-center text-sm text-black shadow-none focus-visible:ring-0 dark:border-white/10 dark:text-white"
        />
        <button
          type="button"
          onClick={() => update(value + step)}
          className="flex h-8 w-9 items-center justify-center text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function RouteDetailPage({ routeId, routeName }: RouteDetailPageProps) {
  const displayRouteName = routeName?.trim() || prettifyRouteId(routeId);

  const [activeTab, setActiveTab] = React.useState<TabId>("route");
  const [workTab, setWorkTab] = React.useState<WorkTabId>("forms");
  const [stops, setStops] = React.useState<StopItem[]>(() =>
    STOPS.map((s) => ({ ...s })),
  );
  const [selectedStopId, setSelectedStopId] = React.useState(
    STOPS.find((s) => s.status === "active")?.id ?? STOPS[0]?.id ?? "",
  );
  const [topGaugeFeet, setTopGaugeFeet] = React.useState(21);
  const [topGaugeInches, setTopGaugeInches] = React.useState(2);
  const [waterFeet, setWaterFeet] = React.useState(11);
  const [waterInches, setWaterInches] = React.useState(6);
  const [flowRate, setFlowRate] = React.useState(287.9);
  const [pressure, setPressure] = React.useState(15.67);
  const [notes, setNotes] = React.useState("");
  const [ticketPriority, setTicketPriority] = React.useState(2);
  const [ticketVolume, setTicketVolume] = React.useState(45);
  const [testOil, setTestOil] = React.useState(118);
  const [testWater, setTestWater] = React.useState(24);
  const [testGas, setTestGas] = React.useState(312);
  const [testHours, setTestHours] = React.useState(24);
  const [formSaved, setFormSaved] = React.useState(false);
  const [ticketSaved, setTicketSaved] = React.useState(false);
  const [testSaved, setTestSaved] = React.useState(false);

  const selectedStop =
    stops.find((s) => s.id === selectedStopId) ?? stops[0] ?? null;
  const currentStopIndex = stops.findIndex((s) => s.id === selectedStopId);
  const completedCount = stops.filter((s) => s.status === "complete").length;
  const progressPercent = Math.round(
    (completedCount / Math.max(stops.length, 1)) * 100,
  );

  const handleGoToNextStop = () => {
    if (currentStopIndex < 0 || currentStopIndex >= stops.length - 1) return;
    setSelectedStopId(stops[currentStopIndex + 1].id);
  };

  const handleCompleteStop = () => {
    let nextId: string | null = null;
    setStops((prev) => {
      const idx = prev.findIndex((s) => s.id === selectedStopId);
      const updated = prev.map((s) =>
        s.id === selectedStopId ? { ...s, status: "complete" as const } : s,
      );
      const nextAfter = updated.find(
        (s, i) => i > idx && s.status !== "complete",
      );
      nextId = nextAfter?.id ?? null;
      return updated;
    });
    if (nextId) setSelectedStopId(nextId);
  };

  const tabs = [
    { id: "route" as TabId, label: "Route", icon: ListChecks },
    { id: "history" as TabId, label: "Submission history", icon: History },
  ];
  const workTabs = [
    { id: "forms" as WorkTabId, label: "Forms", icon: ClipboardList },
    { id: "tickets" as WorkTabId, label: "Tickets", icon: Ticket },
    { id: "tests" as WorkTabId, label: "Tests", icon: Beaker },
  ];

  const recentTickets = [
    {
      id: "TK-2041",
      type: "Gauge Ticket",
      submitted: "04/24/26 06:15 AM",
      status: "Submitted",
      detail: "Tank gauge variance submitted for supervisor review.",
    },
    {
      id: "TK-2037",
      type: "Maintenance Ticket",
      submitted: "04/20/26 01:02 PM",
      status: "Reviewed",
      detail: "High pressure trend documented and routed to field service.",
    },
  ];

  const recentTests = [
    {
      id: "WT-901",
      period: "24 hr test",
      submitted: "04/19/26 05:40 PM",
      oil: "116 BBL",
      water: "22 BBL",
      gas: "305 MCF",
    },
    {
      id: "WT-887",
      period: "12 hr test",
      submitted: "04/10/26 03:12 PM",
      oil: "59 BBL",
      water: "12 BBL",
      gas: "154 MCF",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/routes"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#34C759]/70 text-[#34C759] transition-colors hover:bg-[#34C759]/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
        <h2 className="text-2xl font-bold text-black dark:text-white lg:text-3xl">
          {displayRouteName}
        </h2>
      </div>

      <div className="flex items-center gap-1 w-fit rounded-xl border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-[#1a1d23]">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === id
                ? "bg-[#34C759] text-black"
                : "text-black/50 hover:text-black hover:bg-black/5 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/5"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "route" && (
        <>
          {/* Service date */}
          <div className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
            <span className="text-black dark:text-white">Service Date</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-black/20 bg-gray-100 px-2.5 py-1.5 text-sm text-black hover:bg-gray-200 dark:border-white/20 dark:bg-[#1F2328] dark:text-white dark:hover:bg-[#22272E]"
            >
              <Calendar className="h-3.5 w-3.5 text-black/70 dark:text-white/70" />
              January 05, 2026
              <ChevronDown className="h-3.5 w-3.5 text-black/70 dark:text-white/70" />
            </button>
          </div>

          {/* Main section */}
          <section className="rounded-xl border border-black/10 bg-gray-50/75 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-[#1A1C1E]/75">
        <div className="grid gap-4 xl:grid-cols-[350px_minmax(0,1fr)]">
          {/* Stop list sidebar */}
          <aside className="rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#1A1F25]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-black dark:text-white">
                <ListChecks className="h-4 w-4 text-black/80 dark:text-white/80" />
                <span className="font-medium">Stop List</span>
              </div>
              <span className="text-xs text-black/50 dark:text-white/50">
                Service Date: 3/17/24
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 flex items-center justify-between text-xs text-black/70 dark:text-white/70">
              <span>Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-[#C4F1CE]">
              <div
                className="h-2 rounded-full bg-[#34C759]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stops */}
            <ul className="mt-3 space-y-2">
              {stops.map((stop) => {
                const isActive = stop.id === selectedStopId;
                const isComplete = stop.status === "complete";
                return (
                  <li key={stop.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedStopId(stop.id)}
                      className={[
                        "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors",
                        isActive
                          ? "border-[#34C759] bg-[#34C759] text-white"
                          : "border-black/10 bg-gray-50 text-black hover:bg-gray-100 dark:border-white/10 dark:bg-[#161B20] dark:text-white dark:hover:bg-[#1D232B]",
                      ].join(" ")}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {stop.name}{" "}
                          <span
                            className={
                              isActive
                                ? "text-white/85"
                                : "text-black/55 dark:text-white/55"
                            }
                          >
                            ({stop.distance})
                          </span>
                        </p>
                        <p
                          className={[
                            "truncate text-xs",
                            isActive
                              ? "text-white/85"
                              : "text-black/45 dark:text-white/45",
                          ].join(" ")}
                        >
                          {stop.coordinates}
                        </p>
                      </div>
                      {isActive && (
                        <RefreshCcw className="h-3.5 w-3.5 shrink-0 text-white" />
                      )}
                      {!isActive && isComplete && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[#34C759] text-[#34C759]">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                      {!isActive && !isComplete && (
                        <Square className="h-4 w-4 shrink-0 text-black/45 dark:text-white/45" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Right panel */}
          <div className="space-y-3">
            <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#111418]">
              <h3 className="text-3xl font-medium text-black dark:text-white">
                {selectedStop?.name ?? "David Lease"}
              </h3>

              {/* Asset tabs */}
              <div className="mt-3 flex flex-wrap items-center gap-5 border-b border-black/20 pb-2 text-sm text-black/60 dark:border-white/20 dark:text-white/60">
                <button type="button" className="font-medium text-[#34C759]">
                  Oil Tank #1
                </button>
                <button
                  type="button"
                  className="hover:text-black dark:hover:text-white"
                >
                  Oil Tank #2
                </button>
                <button
                  type="button"
                  className="hover:text-black dark:hover:text-white"
                >
                  Producing Well
                </button>
                <button
                  type="button"
                  className="hover:text-black dark:hover:text-white"
                >
                  Injection Well
                </button>
                <button
                  type="button"
                  className="hover:text-black dark:hover:text-white"
                >
                  Disposal Well
                </button>
              </div>

              <div className="mt-3 flex w-fit items-center gap-1 rounded-xl border border-black/10 bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.03]">
                {workTabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setWorkTab(id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      workTab === id
                        ? "bg-[#34C759] text-black"
                        : "text-black/55 hover:bg-black/5 hover:text-black dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {workTab === "forms" && (
                <div className="mt-3 rounded-md border border-black/10 bg-gray-50 p-3 dark:border-white/10 dark:bg-black/85">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-black dark:text-white">
                      Oil Tank #1 Route Form
                    </p>
                    <span className="text-xs text-black/50 dark:text-white/50">
                      Last Gauge: 12/9/24 @ 6am - 21 FT 1.5 IN
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <NumberStepper
                      label="Top Gauge Feet"
                      help="Whole feet from the field gauge."
                      value={topGaugeFeet}
                      step={1}
                      onChange={(value) => {
                        setTopGaugeFeet(value);
                        setFormSaved(false);
                      }}
                    />
                    <NumberStepper
                      label="Top Gauge Inches"
                      help="Gauge inches."
                      value={topGaugeInches}
                      step={0.25}
                      max={11.75}
                      decimals={2}
                      onChange={(value) => {
                        setTopGaugeInches(value);
                        setFormSaved(false);
                      }}
                    />
                    <NumberStepper
                      label="Water Feet"
                      help="Measured water level."
                      value={waterFeet}
                      step={1}
                      onChange={(value) => {
                        setWaterFeet(value);
                        setFormSaved(false);
                      }}
                    />
                    <NumberStepper
                      label="Water Inches"
                      help="Measured water inches."
                      value={waterInches}
                      step={0.25}
                      max={11.75}
                      decimals={2}
                      onChange={(value) => {
                        setWaterInches(value);
                        setFormSaved(false);
                      }}
                    />
                    <NumberStepper
                      label="Flow Rate"
                      help="MCF/day"
                      value={flowRate}
                      step={0.1}
                      decimals={1}
                      onChange={(value) => {
                        setFlowRate(value);
                        setFormSaved(false);
                      }}
                    />
                    <NumberStepper
                      label="Static Pressure"
                      help="PSIA"
                      value={pressure}
                      step={0.01}
                      decimals={2}
                      onChange={(value) => {
                        setPressure(value);
                        setFormSaved(false);
                      }}
                    />
                  </div>

                  <div className="mt-3 space-y-1">
                    <label className="inline-flex items-center gap-1 text-xs text-black/70 dark:text-white/70">
                      Notes <CircleHelp className="h-3 w-3" />
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setFormSaved(false);
                      }}
                      placeholder="Enter route notes"
                      className="min-h-[72px] border-black/20 bg-white text-sm text-black placeholder:text-black/35 dark:border-white/20 dark:bg-[#151A21] dark:text-white dark:placeholder:text-white/35"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setWorkTab("tickets")}
                      className="inline-flex items-center gap-1 text-black/65 hover:text-black dark:text-white/65 dark:hover:text-white"
                    >
                      <FileText className="h-3 w-3" />
                      Optional:
                      <span className="text-[#34C759] hover:underline">
                        Create Ticket
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormSaved(true)}
                        disabled={formSaved}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          formSaved
                            ? "bg-black/10 text-black/40 dark:bg-white/10 dark:text-white/35"
                            : "bg-[#34C759] text-black hover:bg-[#34C759]/90"
                        }`}
                      >
                        <Save className="h-4 w-4" />
                        {formSaved ? "Saved" : "Save Form"}
                      </button>
                      <button
                        type="button"
                        onClick={handleGoToNextStop}
                        disabled={currentStopIndex < 0 || currentStopIndex >= stops.length - 1}
                        className="inline-flex items-center gap-1 text-[#34C759] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
                      >
                        Next <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {workTab === "tickets" && (
                <div className="mt-3 rounded-md border border-black/10 bg-gray-50 p-3 dark:border-white/10 dark:bg-black/85">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-black dark:text-white">
                          New Ticket
                        </p>
                        <p className="text-xs text-black/50 dark:text-white/50">
                          Route-side ticket capture for issues found at this stop.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs text-black/70 dark:text-white/70">
                            Ticket Type
                          </label>
                          <select className="h-9 w-full rounded-md border border-black/20 bg-white px-3 text-sm text-black dark:border-white/20 dark:bg-[#151A21] dark:text-white">
                            <option>Gauge Ticket</option>
                            <option>Maintenance Ticket</option>
                            <option>Safety Ticket</option>
                          </select>
                        </div>
                        <NumberStepper
                          label="Priority"
                          help="1 is highest priority."
                          value={ticketPriority}
                          step={1}
                          min={1}
                          max={5}
                          onChange={(value) => {
                            setTicketPriority(value);
                            setTicketSaved(false);
                          }}
                        />
                        <NumberStepper
                          label="Estimated Volume Impact"
                          help="BBLs"
                          value={ticketVolume}
                          step={1}
                          onChange={(value) => {
                            setTicketVolume(value);
                            setTicketSaved(false);
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-black/70 dark:text-white/70">
                          Ticket Details
                        </label>
                        <Textarea
                          placeholder="Describe the issue found during this route stop"
                          className="min-h-[96px] border-black/20 bg-white text-sm text-black placeholder:text-black/35 dark:border-white/20 dark:bg-[#151A21] dark:text-white dark:placeholder:text-white/35"
                          onChange={() => setTicketSaved(false)}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setTicketSaved(true)}
                        disabled={ticketSaved}
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          ticketSaved
                            ? "bg-black/10 text-black/40 dark:bg-white/10 dark:text-white/35"
                            : "bg-[#34C759] text-black hover:bg-[#34C759]/90"
                        }`}
                      >
                        <Save className="h-4 w-4" />
                        {ticketSaved ? "Saved" : "Save Ticket"}
                      </button>
                    </div>

                    <div className="space-y-3 rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#151A21]">
                      <p className="text-sm font-medium text-black dark:text-white">
                        Recent Tickets
                      </p>
                      {recentTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="rounded-lg border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-black dark:text-white">
                              {ticket.id}
                            </span>
                            <span className="text-xs text-[#34C759]">
                              {ticket.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                            {ticket.type} · {ticket.submitted}
                          </p>
                          <p className="mt-2 text-sm text-black/70 dark:text-white/70">
                            {ticket.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {workTab === "tests" && (
                <div className="mt-3 rounded-md border border-black/10 bg-gray-50 p-3 dark:border-white/10 dark:bg-black/85">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-black dark:text-white">
                          Well Test Entry
                        </p>
                        <p className="text-xs text-black/50 dark:text-white/50">
                          Capture route-side test values with constrained numeric input.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <NumberStepper
                          label="Oil"
                          help="BBL"
                          value={testOil}
                          step={1}
                          onChange={(value) => {
                            setTestOil(value);
                            setTestSaved(false);
                          }}
                        />
                        <NumberStepper
                          label="Water"
                          help="BBL"
                          value={testWater}
                          step={1}
                          onChange={(value) => {
                            setTestWater(value);
                            setTestSaved(false);
                          }}
                        />
                        <NumberStepper
                          label="Gas"
                          help="MCF"
                          value={testGas}
                          step={1}
                          onChange={(value) => {
                            setTestGas(value);
                            setTestSaved(false);
                          }}
                        />
                        <NumberStepper
                          label="Test Hours"
                          help="Hours on test"
                          value={testHours}
                          step={1}
                          min={1}
                          max={24}
                          onChange={(value) => {
                            setTestHours(value);
                            setTestSaved(false);
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setTestSaved(true)}
                        disabled={testSaved}
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          testSaved
                            ? "bg-black/10 text-black/40 dark:bg-white/10 dark:text-white/35"
                            : "bg-[#34C759] text-black hover:bg-[#34C759]/90"
                        }`}
                      >
                        <Save className="h-4 w-4" />
                        {testSaved ? "Saved" : "Save Test"}
                      </button>
                    </div>

                    <div className="space-y-3 rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#151A21]">
                      <p className="text-sm font-medium text-black dark:text-white">
                        Recent Tests
                      </p>
                      {recentTests.map((test) => (
                        <div
                          key={test.id}
                          className="rounded-lg border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-black dark:text-white">
                              {test.id}
                            </span>
                            <span className="text-xs text-black/50 dark:text-white/50">
                              {test.period}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                            {test.submitted}
                          </p>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                            <span className="rounded bg-black/[0.04] px-2 py-1 text-black/70 dark:bg-white/[0.04] dark:text-white/70">
                              Oil: {test.oil}
                            </span>
                            <span className="rounded bg-black/[0.04] px-2 py-1 text-black/70 dark:bg-white/[0.04] dark:text-white/70">
                              Water: {test.water}
                            </span>
                            <span className="rounded bg-black/[0.04] px-2 py-1 text-black/70 dark:bg-white/[0.04] dark:text-white/70">
                              Gas: {test.gas}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleCompleteStop}
              className="h-11 w-full bg-[#34C759] text-base font-medium text-white hover:bg-[#34C759]/90"
            >
              Complete Stop
            </Button>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="h-11 border-[#34C759]/60 bg-transparent text-[#34C759] hover:bg-[#34C759]/10 hover:text-[#34C759]"
              >
                Skip Stop
              </Button>
              <Button
                variant="outline"
                className="h-11 border-[#34C759]/60 bg-transparent text-[#34C759] hover:bg-[#34C759]/10 hover:text-[#34C759]"
              >
                Roll Over
              </Button>
            </div>
          </div>
        </div>
      </section>
        </>
      )}

      {activeTab === "history" && (
        <RouteSubmissionsSection routeFilter={displayRouteName} />
      )}
    </div>
  );
}
