"use client";

import * as React from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { useTheme } from "next-themes";
import {
  MessageSquarePlus,
  Trash2,
  X,
  Check,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { ProductionRecord, ProductionStats, TIME_RANGES } from "./types";

const VARIABLE_GROUPS = [
  {
    group: "Production",
    items: [
      { key: "h2o", label: "H2O", color: "#3b82f6", seriesType: "line" },
      { key: "oil", label: "Oil", color: "#9ca3af", seriesType: "line" },
      { key: "gas", label: "Gas", color: "#6b7280", seriesType: "line" },
    ],
  },
  {
    group: "Events",
    items: [
      {
        key: "msg",
        label: "Messages",
        color: "#10b981",
        seriesType: "scatter",
      },
      {
        key: "alarm",
        label: "Alarms",
        color: "#ef4444",
        seriesType: "scatter",
      },
    ],
  },
] as const;

const ALL_VARIABLES = VARIABLE_GROUPS.flatMap((g) => g.items);
type VarKey = (typeof ALL_VARIABLES)[number]["key"];
const VAR_MAP = Object.fromEntries(
  ALL_VARIABLES.map((v) => [v.key, v]),
) as Record<VarKey, (typeof ALL_VARIABLES)[number]>;
const DEFAULT_ACTIVE: VarKey[] = ["h2o", "oil", "gas"];

const PAD = { top: 24, right: 20, bottom: 40, left: 60 };
const CHART_H = 260;

interface ProductionChartProps {
  data: ProductionRecord[];
  stats: ProductionStats;
  isLoading?: boolean;
}

interface Annotation {
  id: string;
  varKey: VarKey;
  date: string;
  value: number;
  note: string;
}

interface SnappedPoint {
  varKey: VarKey;
  date: string;
  value: number;
  px: number;
  py: number;
}

interface PlotPoint {
  varKey: VarKey;
  date: string;
  value: number;
  px: number;
  py: number;
}

function buildPlotPoints(
  data: ProductionRecord[],
  activeVars: Set<VarKey>,
  totalW: number,
  totalH: number,
): PlotPoint[] {
  if (!totalW || !totalH || data.length < 2) return [];

  const plotW = totalW - PAD.left - PAD.right;
  const plotH = totalH - PAD.top - PAD.bottom;
  const n = data.length;
  const xStep = plotW / (n - 1);

  let yMin = Infinity,
    yMax = -Infinity;
  data.forEach((row) => {
    (["h2o", "oil", "gas"] as VarKey[]).forEach((k) => {
      if (!activeVars.has(k)) return;
      const v = (row as Record<string, number>)[k];
      if (v != null) {
        yMin = Math.min(yMin, v);
        yMax = Math.max(yMax, v);
      }
    });
  });
  if (!isFinite(yMin)) {
    yMin = 0;
    yMax = 100;
  }
  const yPad = (yMax - yMin) * 0.1 || 10;
  yMin -= yPad;
  yMax += yPad;
  const yRange = yMax - yMin;

  const points: PlotPoint[] = [];

  data.forEach((row, xi) => {
    const px = PAD.left + xi * xStep;

    activeVars.forEach((varKey) => {
      const raw = (row as Record<string, number>)[varKey];
      if (raw == null) return;

      let py: number;
      if (varKey === "msg" || varKey === "alarm") {
        py = PAD.top + plotH * 0.15;
      } else {
        py = PAD.top + plotH * (1 - (raw - yMin) / yRange);
      }

      points.push({ varKey, date: row.date, value: raw, px, py });
    });
  });

  return points;
}

export function ProductionChart({
  data,
  stats,
  isLoading = false,
}: ProductionChartProps) {
  const [activeRange, setActiveRange] = React.useState("Y");
  const [activeVars, setActiveVars] = React.useState<Set<VarKey>>(
    new Set(DEFAULT_ACTIVE),
  );
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [annotations, setAnnotations] = React.useState<Annotation[]>([]);
  const [snapped, setSnapped] = React.useState<SnappedPoint | null>(null);
  const [draftFor, setDraftFor] = React.useState<SnappedPoint | null>(null);
  const [draftNote, setDraftNote] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const [overlayW, setOverlayW] = React.useState(0);
  const [overlayH, setOverlayH] = React.useState(0);

  React.useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const measure = () => {
      setOverlayW(el.offsetWidth);
      setOverlayH(el.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (draftFor) setTimeout(() => inputRef.current?.focus(), 40);
  }, [draftFor]);

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggleVar = (key: VarKey) => {
    setActiveVars((prev) => {
      if (prev.has(key) && prev.size === 1) return prev;
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleGroup = (keys: readonly VarKey[]) => {
    const allOn = keys.every((k) => activeVars.has(k));
    setActiveVars((prev) => {
      const next = new Set(prev);
      if (allOn) {
        const rem = [...next].filter(
          (k) => !(keys as readonly string[]).includes(k),
        );
        if (!rem.length) return prev;
        keys.forEach((k) => next.delete(k));
      } else {
        keys.forEach((k) => next.add(k));
      }
      return next;
    });
  };

  const plotPoints = React.useMemo(
    () => buildPlotPoints(data, activeVars, overlayW, overlayH),
    [data, activeVars, overlayW, overlayH],
  );

  const xIndex = React.useMemo(() => {
    const n = data.length;
    const plotW = overlayW - PAD.left - PAD.right;
    const xStep = n > 1 ? plotW / (n - 1) : 1;
    return { xStep, n };
  }, [data.length, overlayW]);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draftFor) return;
      const rect = overlayRef.current!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const relX = mx - PAD.left;
      const col = Math.round(relX / xIndex.xStep);
      if (col < 0 || col >= xIndex.n) {
        setSnapped(null);
        return;
      }

      const colPts = plotPoints.filter((p) => {
        const ptCol = Math.round((p.px - PAD.left) / xIndex.xStep);
        return ptCol === col;
      });
      if (!colPts.length) {
        setSnapped(null);
        return;
      }

      let best = colPts[0];
      let bestDy = Math.abs(best.py - my);
      for (let i = 1; i < colPts.length; i++) {
        const dy = Math.abs(colPts[i].py - my);
        if (dy < bestDy) {
          bestDy = dy;
          best = colPts[i];
        }
      }

      if (bestDy > 40) {
        setSnapped(null);
        return;
      }

      setSnapped({
        varKey: best.varKey,
        date: best.date,
        value: best.value,
        px: best.px,
        py: best.py,
      });
    },
    [draftFor, plotPoints, xIndex],
  );

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-popover]")) return;
    if (snapped) {
      setDraftFor({ ...snapped });
      setDraftNote("");
      setSnapped(null);
    } else {
      setDraftFor(null);
    }
  };

  const commitDraft = () => {
    if (!draftFor || !draftNote.trim()) {
      setDraftFor(null);
      return;
    }
    setAnnotations((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        varKey: draftFor.varKey,
        date: draftFor.date,
        value: draftFor.value,
        note: draftNote.trim(),
      },
    ]);
    setDraftFor(null);
    setDraftNote("");
  };

  const deleteAnnotation = (id: string) =>
    setAnnotations((prev) => prev.filter((a) => a.id !== id));

  const axisLabelColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const gridStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const chartOptions: AgChartOptions = React.useMemo(() => {
    const series: AgChartOptions["series"] = [];
    if (activeVars.has("h2o"))
      series.push({
        type: "line",
        xKey: "date",
        yKey: "h2o",
        yName: "H2O",
        stroke: "#3b82f6",
        strokeWidth: 2,
        marker: { enabled: false },
      } as never);
    if (activeVars.has("oil"))
      series.push({
        type: "line",
        xKey: "date",
        yKey: "oil",
        yName: "Oil",
        stroke: "#9ca3af",
        strokeWidth: 2,
        marker: { enabled: false },
      } as never);
    if (activeVars.has("gas"))
      series.push({
        type: "line",
        xKey: "date",
        yKey: "gas",
        yName: "Gas",
        stroke: "#6b7280",
        strokeWidth: 2,
        marker: { enabled: false },
      } as never);
    if (activeVars.has("msg"))
      series.push({
        type: "scatter",
        xKey: "date",
        yKey: "msg",
        yName: "Messages",
        fill: "#10b981",
        stroke: "#10b981",
        size: 7,
        shape: "square",
      } as never);
    if (activeVars.has("alarm"))
      series.push({
        type: "scatter",
        xKey: "date",
        yKey: "alarm",
        yName: "Alarms",
        fill: "#ef4444",
        stroke: "#ef4444",
        size: 9,
        shape: "triangle",
      } as never);

    return {
      data,
      background: { fill: isDark ? "#252930" : "#ffffff" },
      padding: PAD,
      series,
      axes: [
        {
          type: "category",
          position: "bottom",
          label: { color: axisLabelColor, fontSize: 11 },
          gridLine: {
            enabled: true,
            style: [{ stroke: gridStroke, lineDash: [4, 4] }],
          },
        },
        {
          type: "number",
          position: "left",
          label: { color: axisLabelColor, fontSize: 11 },
          title: {
            text: "BBLs",
            enabled: true,
            fontSize: 12,
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          },
          gridLine: {
            enabled: true,
            style: [{ stroke: gridStroke, lineDash: [4, 4] }],
          },
        },
      ],
      legend: { enabled: false },
    } as AgChartOptions;
  }, [data, isDark, activeVars]);

  const annotationPins = React.useMemo(
    () =>
      annotations
        .filter((a) => activeVars.has(a.varKey))
        .map((ann) => {
          const pt = plotPoints.find(
            (p) => p.varKey === ann.varKey && p.date === ann.date,
          );
          return pt ? { ...ann, px: pt.px, py: pt.py } : null;
        })
        .filter(Boolean) as (Annotation & { px: number; py: number })[],
    [annotations, plotPoints, activeVars],
  );

  const activeList = ALL_VARIABLES.filter((v) => activeVars.has(v.key));

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {TIME_RANGES.map((r, i) => (
          <button
            key={`${r}-${i}`}
            onClick={() => setActiveRange(r)}
            className={`h-8 min-w-[36px] rounded px-3 text-xs font-medium transition-colors ${
              activeRange === r
                ? "bg-[#34C759] text-black"
                : "border border-black/10 bg-transparent text-black/40 hover:bg-black/5 dark:border-white/10 dark:text-white/40 dark:hover:bg-white/5"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all ${
              dropdownOpen
                ? "border-[#34C759]/50 bg-[#34C759]/5 text-black dark:text-white"
                : "border-black/10 text-black/60 hover:border-black/20 dark:border-white/10 dark:text-white/50"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Variables
            <span className="ml-0.5 rounded-full bg-[#34C759]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#34C759]">
              {activeVars.size}
            </span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-[#1e2126]">
              {VARIABLE_GROUPS.map(({ group, items }) => {
                const gKeys = items.map((i) => i.key) as VarKey[];
                const allOn = gKeys.every((k) => activeVars.has(k));
                return (
                  <div key={group}>
                    <div className="flex items-center justify-between px-3 pb-1 pt-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
                        {group}
                      </span>
                      <button
                        onClick={() => toggleGroup(gKeys)}
                        className="text-[9px] font-semibold text-black/30 hover:text-[#34C759] dark:text-white/25"
                      >
                        {allOn ? "Deselect all" : "Select all"}
                      </button>
                    </div>
                    {items.map(({ key, label, color, seriesType }) => {
                      const active = activeVars.has(key as VarKey);
                      const annCount = annotations.filter(
                        (a) => a.varKey === key,
                      ).length;
                      return (
                        <button
                          key={key}
                          onClick={() => toggleVar(key as VarKey)}
                          className="flex w-full items-center gap-3 px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <span
                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all"
                            style={{
                              backgroundColor: active ? color : "transparent",
                              borderColor: active
                                ? color
                                : isDark
                                  ? "rgba(255,255,255,0.2)"
                                  : "rgba(0,0,0,0.2)",
                            }}
                          >
                            {active && (
                              <svg
                                width="8"
                                height="8"
                                viewBox="0 0 8 8"
                                fill="none"
                              >
                                <path
                                  d="M1.5 4L3 5.5L6.5 2"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="flex w-5 shrink-0 items-center justify-center">
                            {seriesType === "line" && (
                              <span
                                className="block h-0.5 w-5 rounded-full"
                                style={{
                                  backgroundColor: color,
                                  opacity: active ? 1 : 0.3,
                                }}
                              />
                            )}
                            {seriesType === "scatter" && key === "msg" && (
                              <span
                                className="block h-2.5 w-2.5 rounded-sm"
                                style={{
                                  backgroundColor: color,
                                  opacity: active ? 1 : 0.3,
                                }}
                              />
                            )}
                            {seriesType === "scatter" && key === "alarm" && (
                              <span
                                className="block"
                                style={{
                                  width: 0,
                                  height: 0,
                                  borderLeft: "5px solid transparent",
                                  borderRight: "5px solid transparent",
                                  borderBottom: `9px solid ${color}`,
                                  opacity: active ? 1 : 0.3,
                                }}
                              />
                            )}
                          </span>
                          <span
                            className={`flex-1 text-left text-[12px] font-medium ${active ? "text-black dark:text-white" : "text-black/40 dark:text-white/30"}`}
                          >
                            {label}
                          </span>
                          {annCount > 0 && (
                            <span className="rounded-full bg-[#34C759]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#34C759]">
                              {annCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <div className="mx-3 border-t border-black/5 dark:border-white/5" />
                  </div>
                );
              })}
              <div className="flex items-center justify-between px-3 py-2">
                <button
                  onClick={() => setActiveVars(new Set(DEFAULT_ACTIVE))}
                  className="text-[10px] text-black/30 hover:text-black/60 dark:text-white/25"
                >
                  Reset to default
                </button>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="rounded-md bg-[#34C759] px-2.5 py-1 text-[10px] font-semibold text-black"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {activeList.map(({ key, label, color }) => (
            <span
              key={key}
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: `${color}22`, color }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {label}
              <button
                onClick={() => toggleVar(key as VarKey)}
                className="ml-0.5 opacity-50 hover:opacity-100"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>

        {annotations.length > 0 && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-black/30 dark:text-white/30">
            <MessageSquarePlus className="h-3 w-3" />
            {annotations.length} note{annotations.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-lg border border-black/5 bg-white dark:border-white/5 dark:bg-[#252930]"
        style={{ height: CHART_H }}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-black/20 dark:text-white/20">
            Loading…
          </div>
        ) : (
          <>
            <div className="absolute inset-0">
              <AgCharts
                options={{
                  ...chartOptions,
                  width: overlayW || undefined,
                  height: CHART_H,
                }}
              />
            </div>

            <div
              ref={overlayRef}
              className="absolute inset-0"
              style={{
                cursor: snapped ? "crosshair" : "default",
                zIndex: 10,
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                if (!draftFor) setSnapped(null);
              }}
              onClick={handleOverlayClick}
            >
              {snapped && !draftFor && (
                <div
                  className="pointer-events-none absolute"
                  style={{
                    left: snapped.px,
                    top: snapped.py,
                    transform: "translate(-50%, -50%)",
                    zIndex: 12,
                  }}
                >
                  <div
                    className="h-4 w-4 rounded-full opacity-50 ring-2 ring-offset-0"
                    style={{
                      backgroundColor: `${VAR_MAP[snapped.varKey].color}33`,
                      ringColor: VAR_MAP[snapped.varKey].color,
                      boxShadow: `0 0 0 2px ${VAR_MAP[snapped.varKey].color}`,
                    }}
                  />
                  <div
                    className="pointer-events-auto absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
                    style={{ bottom: "calc(100% + 10px)" }}
                    data-popover="true"
                  >
                    <div
                      className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold shadow-xl"
                      style={{
                        backgroundColor: "#1a1d21",
                        color: VAR_MAP[snapped.varKey].color,
                      }}
                    >
                      <MessageSquarePlus className="h-3 w-3" />
                      {VAR_MAP[snapped.varKey].label} · {snapped.date} ·{" "}
                      {snapped.value}
                      <span className="ml-1 text-white/30">
                        (click to annotate)
                      </span>
                    </div>
                    <div className="mx-auto w-fit">
                      <div className="h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1a1d21]" />
                    </div>
                  </div>
                </div>
              )}

              {draftFor && (
                <div
                  className="absolute"
                  style={{
                    left: draftFor.px,
                    top: draftFor.py,
                    transform: "translate(-50%, -100%)",
                    marginTop: -14,
                    zIndex: 30,
                  }}
                  data-popover="true"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-60 rounded-xl border border-white/10 bg-[#1a1d21] p-3 shadow-2xl">
                    <div className="mb-2 flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: VAR_MAP[draftFor.varKey].color,
                        }}
                      />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: VAR_MAP[draftFor.varKey].color }}
                      >
                        {VAR_MAP[draftFor.varKey].label}
                      </span>
                      <span className="text-[10px] text-white/30">
                        · {draftFor.date}
                      </span>
                      <span className="ml-auto text-[10px] font-semibold text-white/50">
                        {draftFor.value}
                      </span>
                    </div>
                    <input
                      ref={inputRef}
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitDraft();
                        if (e.key === "Escape") setDraftFor(null);
                      }}
                      placeholder="Type your note…"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[12px] text-white placeholder-white/20 outline-none focus:border-[#34C759]/60 focus:ring-1 focus:ring-[#34C759]/20"
                    />
                    <div className="mt-2 flex gap-1.5">
                      <button
                        onClick={commitDraft}
                        disabled={!draftNote.trim()}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#34C759] py-1 text-[11px] font-semibold text-black disabled:opacity-40"
                      >
                        <Check className="h-3 w-3" /> Save
                      </button>
                      <button
                        onClick={() => setDraftFor(null)}
                        className="flex items-center justify-center rounded-lg border border-white/10 px-2 py-1 text-white/40 hover:text-white/70"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1a1d21]" />
                  </div>
                </div>
              )}

              {annotationPins.map((ann) => (
                <div
                  key={ann.id}
                  className="group absolute"
                  style={{
                    left: ann.px,
                    top: ann.py,
                    transform: "translate(-50%, -100%)",
                    marginTop: -4,
                    zIndex: 20,
                    pointerEvents: "all",
                  }}
                  data-popover="true"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: VAR_MAP[ann.varKey].color }}
                    >
                      <span className="text-[8px] font-bold text-white">✎</span>
                    </div>
                    <div
                      className="h-1.5 w-px"
                      style={{
                        backgroundColor: VAR_MAP[ann.varKey].color,
                        opacity: 0.6,
                      }}
                    />
                  </div>

                  <div
                    className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden w-max max-w-[200px] -translate-x-1/2 group-hover:block"
                    style={{ zIndex: 40 }}
                  >
                    <div className="rounded-xl border border-white/10 bg-[#1a1d21] px-3 py-2 shadow-2xl">
                      <div className="mb-1 flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: VAR_MAP[ann.varKey].color }}
                        />
                        <span
                          className="text-[9px] font-semibold uppercase tracking-wide"
                          style={{ color: VAR_MAP[ann.varKey].color }}
                        >
                          {VAR_MAP[ann.varKey].label}
                        </span>
                        <span className="text-[9px] text-white/30">
                          {ann.date}
                        </span>
                      </div>
                      <p className="text-[11px] leading-snug text-white/80">
                        {ann.note}
                      </p>
                      <button
                        className="pointer-events-auto mt-1.5 flex items-center gap-1 text-[9px] text-red-400/60 hover:text-red-400"
                        onClick={() => deleteAnnotation(ann.id)}
                      >
                        <Trash2 className="h-2.5 w-2.5" /> Delete
                      </button>
                      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1a1d21]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {annotations.filter((a) => activeVars.has(a.varKey)).length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {annotations
            .filter((a) => activeVars.has(a.varKey))
            .map((ann) => {
              const v = VAR_MAP[ann.varKey];
              return (
                <div
                  key={ann.id}
                  className="flex items-start gap-2 rounded-lg border border-black/5 px-3 py-2 text-[11px] dark:border-white/5"
                >
                  <span
                    className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold"
                    style={{ backgroundColor: `${v.color}22`, color: v.color }}
                  >
                    {v.label}
                  </span>
                  <span className="shrink-0 text-black/30 dark:text-white/25">
                    {ann.date} ·{" "}
                    <span className="font-medium">{ann.value}</span>
                  </span>
                  <span className="flex-1 text-black/70 dark:text-white/60">
                    {ann.note}
                  </span>
                  <button
                    onClick={() => deleteAnnotation(ann.id)}
                    className="shrink-0 text-black/20 hover:text-red-400 dark:text-white/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
