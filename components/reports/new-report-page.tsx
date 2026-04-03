"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Calendar as CalendarIcon,
  Info,
  Search,
  X,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ErrorBoundary } from "@/components/error-boundary";
import { cn } from "@/lib/utils";

const SUBJECT_OPTIONS = [
  { id: "1", label: "Trinity Energy: Johnson Lease: Oil Tank #1" },
  { id: "2", label: "Trinity Energy: Johnson Lease: Oil Tank #2" },
  { id: "3", label: "Trinity Energy: Laika: Oil Tank" },
];

const DATA_POINT_OPTIONS = [
  { id: "psi", label: "PSI Level (PSI)" },
  { id: "flow", label: "Flow Time" },
  { id: "temp", label: "Temp" },
  { id: "pressure", label: "Pressure" },
  { id: "production", label: "Production" },
  { id: "v1", label: "Variable #1" },
  { id: "v2", label: "Variable #2" },
  { id: "v3", label: "Variable #3" },
  { id: "v4", label: "Variable #4" },
  { id: "v5", label: "Variable #5" },
];

type DateFrequency = "hour" | "day" | "week";

export function NewReportPage() {
  const [reportName, setReportName] = React.useState(
    "Oil Tanks - 1/5/24 from 10 - 12pm",
  );
  const [subjectSearch, setSubjectSearch] = React.useState("Oil To");
  const [subjectDropdownOpen, setSubjectDropdownOpen] = React.useState(false);
  const [selectedSubjects, setSelectedSubjects] = React.useState<
    { id: string; label: string }[]
  >([
    { id: "1", label: "Johnson Lease: Oil Tank #1" },
    { id: "3", label: "Laika: Oil Tank" },
  ]);
  const [selectedDataPoints, setSelectedDataPoints] = React.useState<string[]>([
    "psi",
    "flow",
    "temp",
    "pressure",
    "production",
  ]);
  const [frequency, setFrequency] = React.useState<DateFrequency>("hour");
  const [fromDate, setFromDate] = React.useState<Date | undefined>(
    () => new Date(2024, 0, 5, 10, 0),
  );
  const [toDate, setToDate] = React.useState<Date | undefined>(
    () => new Date(2024, 0, 5, 12, 0),
  );

  const filteredSubjects = React.useMemo(() => {
    const q = subjectSearch.toLowerCase();
    if (!q) return SUBJECT_OPTIONS;
    return SUBJECT_OPTIONS.filter((s) => s.label.toLowerCase().includes(q));
  }, [subjectSearch]);

  const addSubject = (item: { id: string; label: string }) => {
    if (selectedSubjects.some((s) => s.id === item.id)) return;
    const shortLabel =
      item.label.replace(/^Trinity Energy:\s*/i, "") || item.label;
    setSelectedSubjects((prev) => [
      ...prev,
      { id: item.id, label: shortLabel },
    ]);
  };

  const removeSubject = (id: string) =>
    setSelectedSubjects((prev) => prev.filter((s) => s.id !== id));
  const toggleDataPoint = (id: string) =>
    setSelectedDataPoints((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const formatDateTime = (d: Date, time: "10a" | "12p") => {
    const base = format(d, "M/d/yy");
    return time === "10a" ? `${base} @ 10a` : `${base} @ 12p`;
  };

  const handleGenerate = () => {
    console.log("Generate report", {
      reportName,
      subjects: selectedSubjects,
      selectedDataPoints,
      frequency,
      fromDate,
      toDate,
    });
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card className="overflow-hidden border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]/95">
          <CardContent className="p-0">
            {/* Header */}
            <div className="border-b border-black/10 bg-gray-50 px-6 py-4 dark:border-white/10 dark:bg-[#252930]/80">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-[#34C759] text-black hover:bg-[#34C759]/90 hover:text-black"
                  asChild
                >
                  <Link href="/dashboard/reports">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <h1 className="text-xl font-semibold text-black dark:text-white">
                  New Report
                </h1>
              </div>
            </div>

            <div className="space-y-8 p-6">
              {/* Report Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label className="text-sm font-medium text-black dark:text-white">
                    Report Name
                  </Label>
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60"
                    title="Report name help"
                  >
                    <Info className="h-2.5 w-2.5" />
                  </span>
                </div>
                <Input
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="border-black/20 bg-gray-100 text-black placeholder:text-black/40 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/40"
                  placeholder="Oil Tanks - 1/5/24 from 10 - 12pm"
                />
              </div>

              {/* Step 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#34C759] text-black">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium text-black dark:text-white">
                    Step 1 — Choose your subjects
                  </span>
                </div>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
                    <Input
                      value={subjectSearch}
                      onChange={(e) => {
                        setSubjectSearch(e.target.value);
                        setSubjectDropdownOpen(true);
                      }}
                      onFocus={() => setSubjectDropdownOpen(true)}
                      placeholder="Search subjects..."
                      className="border-black/20 bg-gray-100 pl-9 text-black placeholder:text-black/40 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/40"
                    />
                  </div>
                  {subjectDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        aria-hidden
                        onClick={() => setSubjectDropdownOpen(false)}
                      />
                      <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-[#252930]">
                        {filteredSubjects.map((item) => {
                          const isSelected = selectedSubjects.some(
                            (s) => s.id === item.id,
                          );
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                addSubject(item);
                                setSubjectDropdownOpen(false);
                              }}
                              className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                            >
                              <span>{item.label}</span>
                              {isSelected && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#34C759] text-black">
                                  <Check className="h-3 w-3" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                        {filteredSubjects.length === 0 && (
                          <div className="px-3 py-4 text-center text-sm text-black/50 dark:text-white/50">
                            No subjects found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {selectedSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSubjects.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#34C759] bg-[#34C759]/10 px-3 py-1.5 text-sm text-[#34C759]"
                      >
                        {s.label}
                        <button
                          type="button"
                          onClick={() => removeSubject(s.id)}
                          className="flex h-4 w-4 items-center justify-center rounded-full bg-[#34C759] text-black hover:bg-[#34C759]/80"
                          aria-label={`Remove ${s.label}`}
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#34C759] text-black">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium text-black dark:text-white">
                    Step 2 — Choose your data points
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DATA_POINT_OPTIONS.map((dp) => {
                    const isSelected = selectedDataPoints.includes(dp.id);
                    return (
                      <button
                        key={dp.id}
                        type="button"
                        onClick={() => toggleDataPoint(dp.id)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                          isSelected
                            ? "border-[#34C759] bg-[#34C759] text-black"
                            : "border-black/20 bg-gray-100 text-black hover:border-black/30 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:hover:border-white/30",
                        )}
                      >
                        {isSelected && <Check className="h-4 w-4" />}
                        {dp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#34C759] text-black">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium text-black dark:text-white">
                    Step 3 — Choose your date range
                  </span>
                </div>
                <RadioGroup
                  value={frequency}
                  onValueChange={(v) => setFrequency(v as DateFrequency)}
                  className="flex gap-6"
                >
                  {(["hour", "day", "week"] as const).map((val) => (
                    <label
                      key={val}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <RadioGroupItem
                        value={val}
                        className="border-black/30 data-[state=checked]:border-[#34C759] data-[state=checked]:bg-[#34C759] dark:border-white/30"
                      />
                      <span className="text-sm text-black dark:text-white capitalize">
                        By {val}
                      </span>
                    </label>
                  ))}
                </RadioGroup>

                <div className="flex flex-wrap items-end gap-4">
                  {/* From */}
                  <div className="space-y-1.5">
                    <Label className="text-sm text-black dark:text-white">
                      From
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="min-w-[160px] justify-between border-black/20 bg-gray-100 text-left font-normal text-black dark:border-white/20 dark:bg-[#252930] dark:text-white"
                        >
                          <span>
                            {fromDate
                              ? formatDateTime(fromDate, "10a")
                              : "1/5/24 @ 10a"}
                          </span>
                          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 text-[#34C759]" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto border-black/10 bg-white p-0 dark:border-white/10 dark:bg-[#252930]"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* To */}
                  <div className="space-y-1.5">
                    <Label className="text-sm text-black dark:text-white">
                      To
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="min-w-[160px] justify-between border-black/20 bg-gray-100 text-left font-normal text-black dark:border-white/20 dark:bg-[#252930] dark:text-white"
                        >
                          <span>
                            {toDate
                              ? formatDateTime(toDate, "12p")
                              : "1/5/24 @ 12p"}
                          </span>
                          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 text-[#34C759]" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto border-black/10 bg-white p-0 dark:border-white/10 dark:bg-[#252930]"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={toDate}
                          onSelect={setToDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                className="bg-[#34C759] text-black hover:bg-[#34C759]/90"
              >
                <Check className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
