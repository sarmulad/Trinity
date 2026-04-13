"use client";

import * as React from "react";
import { Flame, Droplets, RadioTower } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDashboardPreferences,
  type BenchmarkKey,
} from "@/lib/dashboard-preferences";

const OIL_OPTIONS: BenchmarkKey[] = [
  "WTI Oil",
  "Brent Oil",
  "Kansas Oil",
  "Oklahoma Oil",
];

const GAS_OPTIONS: BenchmarkKey[] = ["Henry Hub", "Natural Gas", "NYMEX Gas"];

function SettingRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#34C759]/15 text-[#34C759]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-black dark:text-white">
            {title}
          </p>
          <p className="mt-1 text-sm text-black/55 dark:text-white/55">
            {description}
          </p>
        </div>
      </div>
      <div className="sm:min-w-[220px]">{children}</div>
    </div>
  );
}

export function PlatformPreferencesTab() {
  const { preferences, updatePreferences } = useDashboardPreferences();

  const triggerClass =
    "border-black/20 bg-white text-black dark:border-white/20 dark:bg-[#252930] dark:text-white";
  const contentClass =
    "border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]";
  const itemClass =
    "text-black focus:bg-black/5 focus:text-black dark:text-white dark:focus:bg-white/10 dark:focus:text-white";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-black dark:text-white">
          Platform Preferences
        </h2>
      </div>

      <Card className="border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]/95">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <SettingRow
            icon={<RadioTower className="h-4 w-4" />}
            title="Home Page Price Ticker"
            description="Show or hide the scrolling oil and gas price ticker across the top of the dashboard."
          >
            <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#252930]">
              <Label
                htmlFor="price-ticker-toggle"
                className="text-sm text-black dark:text-white"
              >
                {preferences.showPriceTicker ? "Enabled" : "Hidden"}
              </Label>
              <Switch
                id="price-ticker-toggle"
                checked={preferences.showPriceTicker}
                onCheckedChange={(checked) =>
                  updatePreferences({ showPriceTicker: checked })
                }
              />
            </div>
          </SettingRow>

          <SettingRow
            icon={<Droplets className="h-4 w-4" />}
            title="Default Oil Price"
            description="Use this benchmark by default anywhere oil-based production pricing is calculated."
          >
            <Select
              value={preferences.defaultOilBenchmark}
              onValueChange={(value) =>
                updatePreferences({
                  defaultOilBenchmark: value as BenchmarkKey,
                })
              }
            >
              <SelectTrigger className={triggerClass}>
                <SelectValue placeholder="Select oil benchmark" />
              </SelectTrigger>
              <SelectContent className={contentClass}>
                {OIL_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option} className={itemClass}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow
            icon={<Flame className="h-4 w-4" />}
            title="Default Gas Price"
            description="Use this benchmark by default anywhere gas-based production pricing is calculated."
          >
            <Select
              value={preferences.defaultGasBenchmark}
              onValueChange={(value) =>
                updatePreferences({
                  defaultGasBenchmark: value as BenchmarkKey,
                })
              }
            >
              <SelectTrigger className={triggerClass}>
                <SelectValue placeholder="Select gas benchmark" />
              </SelectTrigger>
              <SelectContent className={contentClass}>
                {GAS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option} className={itemClass}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>
        </CardContent>
      </Card>
    </div>
  );
}
