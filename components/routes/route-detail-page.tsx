"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  Check,
  CircleHelp,
  FileText,
  ListChecks,
  RefreshCcw,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

export function RouteDetailPage({ routeId, routeName }: RouteDetailPageProps) {
  const displayRouteName = routeName?.trim() || prettifyRouteId(routeId);

  const [selectedStopId, setSelectedStopId] = React.useState(
    STOPS.find((s) => s.status === "active")?.id ?? STOPS[0]?.id ?? "",
  );

  const selectedStop =
    STOPS.find((s) => s.id === selectedStopId) ?? STOPS[0] ?? null;
  const completedCount = STOPS.filter((s) => s.status === "complete").length;
  const progressPercent = Math.round(
    (completedCount / Math.max(STOPS.length, 1)) * 100,
  );

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/routes"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#34C759]/70 text-[#34C759] transition-colors hover:bg-[#34C759]/10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <h2 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
            {displayRouteName}
          </h2>
        </div>
        <Link
          href={`/dashboard/routes/submissions?routeId=${encodeURIComponent(routeId)}&name=${encodeURIComponent(displayRouteName)}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#34C759] hover:underline"
        >
          Route Submission History
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

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
              {STOPS.map((stop) => {
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

              {/* Gauge form */}
              <div className="mt-3 rounded-md border border-black/10 bg-gray-50 p-3 dark:border-white/10 dark:bg-black/85">
                <p className="text-sm font-medium text-black dark:text-white">
                  Oil Tank #1
                </p>

                <div className="mt-2 flex flex-col gap-1 text-xs text-black/70 dark:text-white/70 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-1">
                    Last Gauge <CircleHelp className="h-3 w-3" />
                  </span>
                  <span>12/9/24 @ 6am -21FT 1.5 IN</span>
                </div>

                <p className="mt-3 text-sm font-medium text-black dark:text-white">
                  New Gauge
                </p>

                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="inline-flex items-center gap-1 text-xs text-black/70 dark:text-white/70">
                      Feet <CircleHelp className="h-3 w-3" />
                    </label>
                    <Input
                      defaultValue="21"
                      className="h-8 border-black/20 bg-white text-sm text-black dark:border-white/20 dark:bg-[#151A21] dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="inline-flex items-center gap-1 text-xs text-black/70 dark:text-white/70">
                      Inches <CircleHelp className="h-3 w-3" />
                    </label>
                    <Input
                      defaultValue="2.00"
                      className="h-8 border-black/20 bg-white text-sm text-black dark:border-white/20 dark:bg-[#151A21] dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <label className="inline-flex items-center gap-1 text-xs text-black/70 dark:text-white/70">
                    Notes <CircleHelp className="h-3 w-3" />
                  </label>
                  <Textarea
                    placeholder="Enter Note"
                    className="min-h-[56px] border-black/20 bg-white text-sm text-black placeholder:text-black/35 dark:border-white/20 dark:bg-[#151A21] dark:text-white dark:placeholder:text-white/35"
                  />
                </div>

                <div className="mt-3 flex justify-center">
                  <Button className="h-7 bg-[#34C759] px-6 text-xs font-medium text-white hover:bg-[#34C759]/90">
                    Save Data
                  </Button>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-black/65 hover:text-black dark:text-white/65 dark:hover:text-white"
                  >
                    <FileText className="h-3 w-3" />
                    Optional:
                    <span className="text-[#34C759] hover:underline">
                      Submit Ticket
                    </span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[#34C759] hover:underline"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <Button className="h-11 w-full bg-[#34C759] text-base font-medium text-white hover:bg-[#34C759]/90">
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
    </div>
  );
}
