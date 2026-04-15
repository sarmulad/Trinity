"use client";

import * as React from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SettingsDataGrid } from "../settings-data-grid";
import { GridEditDeleteActions, SettingsTypeBadge } from "../settings-grid-cells";
import {
  getBatteryAssetRows,
  getBatteryWellRows,
  type BatteryRow,
  type BatteryAssetRow,
  type BatteryWellRow,
} from "./mock-data";

type BatteryDetailSectionProps = {
  battery: BatteryRow;
  onBackToBatteries: () => void;
};

export function BatteryDetailSection({
  battery,
  onBackToBatteries,
}: BatteryDetailSectionProps) {
  const assetRows = React.useMemo(
    () => getBatteryAssetRows(battery.id),
    [battery.id],
  );
  const wellRows = React.useMemo(
    () => getBatteryWellRows(battery.id),
    [battery.id],
  );

  const assetCols = React.useMemo<ColDef<BatteryAssetRow>[]>(
    () => [
      {
        field: "name",
        headerName: "Asset",
        flex: 1,
        minWidth: 120,
        cellClass: "font-medium",
      },
      {
        field: "type",
        headerName: "Type",
        flex: 0.8,
        minWidth: 110,
        cellRenderer: (p: ICellRendererParams<BatteryAssetRow>) =>
          p.data ? (
            <SettingsTypeBadge label={p.data.type} tone={p.data.typeTone} />
          ) : null,
      },
      { field: "capacity", headerName: "Capacity", flex: 0.7, minWidth: 100 },
      {
        field: "tag",
        headerName: "Tag #",
        flex: 0.8,
        minWidth: 100,
        cellClass: "text-black/60 dark:text-white/60",
      },
      {
        headerName: "",
        sortable: false,
        flex: 0,
        minWidth: 150,
        maxWidth: 160,
        cellRenderer: () => <GridEditDeleteActions />,
      },
    ],
    [],
  );

  const wellCols = React.useMemo<ColDef<BatteryWellRow>[]>(
    () => [
      {
        field: "name",
        headerName: "Well",
        flex: 1,
        minWidth: 100,
        cellClass: "font-medium",
      },
      {
        field: "type",
        headerName: "Type",
        flex: 0.9,
        minWidth: 110,
        cellRenderer: (p: ICellRendererParams<BatteryWellRow>) =>
          p.data ? (
            <SettingsTypeBadge label={p.data.type} tone={p.data.typeTone} />
          ) : null,
      },
      {
        field: "api",
        headerName: "API #",
        flex: 1,
        minWidth: 120,
        cellClass: "text-black/60 dark:text-white/60",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.7,
        minWidth: 100,
        cellRenderer: (p: ICellRendererParams<BatteryWellRow>) =>
          p.data ? (
            <SettingsTypeBadge label={p.data.status} tone="success" />
          ) : null,
      },
      {
        headerName: "",
        sortable: false,
        flex: 0,
        minWidth: 150,
        maxWidth: 160,
        cellRenderer: () => <GridEditDeleteActions />,
      },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button
                type="button"
                className="text-[#1a7f37] hover:underline dark:text-[#34C759]"
                onClick={onBackToBatteries}
              >
                Batteries
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-black dark:text-white">
              {battery.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
            Lease
          </p>
          <p className="mt-1 text-[15px] font-semibold text-black dark:text-white">
            {battery.leaseName}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
            Assets
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-black dark:text-white">
            {battery.assetsCount}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
            Wells
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-black dark:text-white">
            {battery.wellsCount}
          </p>
        </div>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto w-full justify-start rounded-none border-b border-black/10 bg-transparent p-0 dark:border-white/10 sm:w-auto">
            <TabsTrigger
              value="assets"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-[#34C759] data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none dark:data-[state=active]:text-white"
            >
              Assets
            </TabsTrigger>
            <TabsTrigger
              value="wells"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-[#34C759] data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none dark:data-[state=active]:text-white"
            >
              Wells
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="assets" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#28a745]"
            >
              <PlusCircle className="h-4 w-4" />
              Add asset
            </button>
          </div>
          <SettingsDataGrid<BatteryAssetRow>
            rowData={assetRows}
            columnDefs={assetCols}
            height={320}
            getRowId={(p) => p.data.id}
          />
        </TabsContent>

        <TabsContent value="wells" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#28a745]"
            >
              <PlusCircle className="h-4 w-4" />
              Add well
            </button>
          </div>
          <SettingsDataGrid<BatteryWellRow>
            rowData={wellRows}
            columnDefs={wellCols}
            height={320}
            getRowId={(p) => p.data.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
