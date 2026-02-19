"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { MapPin, MoreHorizontal, Eye, AlertCircle } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import {
  DataTable,
  createSortableHeader,
} from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWells } from "@/hooks/use-api";
import { ErrorBoundary } from "@/components/error-boundary";

interface Well {
  id: string;
  name: string;
  region: string;
  status: "active" | "inactive" | "maintenance" | "alert";
  oilProduction: number;
  gasProduction: number;
  lastUpdated: string;
}

const mockWells: Well[] = [
  {
    id: "1",
    name: "NF-127",
    region: "North Field",
    status: "alert",
    oilProduction: 487,
    gasProduction: 3240,
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    name: "SF-042",
    region: "South Field",
    status: "active",
    oilProduction: 523,
    gasProduction: 3560,
    lastUpdated: "5 minutes ago",
  },
  {
    id: "3",
    name: "EF-089",
    region: "East Field",
    status: "active",
    oilProduction: 612,
    gasProduction: 4120,
    lastUpdated: "3 minutes ago",
  },
  {
    id: "4",
    name: "WF-015",
    region: "West Field",
    status: "maintenance",
    oilProduction: 0,
    gasProduction: 0,
    lastUpdated: "1 day ago",
  },
  {
    id: "5",
    name: "NF-098",
    region: "North Field",
    status: "active",
    oilProduction: 445,
    gasProduction: 2980,
    lastUpdated: "1 minute ago",
  },
];

const columns: ColumnDef<Well>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Well ID"),
    cell: ({ row }) => (
      <div className="font-medium font-mono">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "region",
    header: createSortableHeader("Region"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        {row.getValue("region")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Well["status"];
      const statusLabels = {
        active: "Active",
        inactive: "Inactive",
        maintenance: "Maintenance",
        alert: "Alert",
      };
      const statusVariants = {
        active: "default",
        inactive: "secondary",
        maintenance: "outline",
        alert: "destructive",
      };

      return (
        <Badge variant={statusVariants[status] as any}>
          {statusLabels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "oilProduction",
    header: createSortableHeader("Oil (bbl/d)"),
    cell: ({ row }) => {
      const value = row.getValue("oilProduction") as number;
      return (
        <div className="font-mono text-sm">
          {value > 0 ? value.toLocaleString() : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "gasProduction",
    header: createSortableHeader("Gas (mcf/d)"),
    cell: ({ row }) => {
      const value = row.getValue("gasProduction") as number;
      return (
        <div className="font-mono text-sm">
          {value > 0 ? value.toLocaleString() : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("lastUpdated")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const well = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>View Production History</DropdownMenuItem>
            <DropdownMenuItem>Download Report</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Well Info</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function WellsPage() {
  const { data, isLoading, error, mutate } = useWells();

  const wells = React.useMemo(() => {
    if (!data?.wells) return [];

    return data.wells.map((well: any) => ({
      id: well.id,
      name: well.name,
      region: well.region,
      status: well.status,
      oilProduction: well.productionData?.oil?.current || 0,
      gasProduction: well.productionData?.gas?.current || 0,
      lastUpdated: new Date(well.lastUpdated).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      }),
    }));
  }, [data]);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <PageHeader
          title="Wells Management"
          description="Monitor and manage all production wells"
          actions={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => mutate()}>
                Refresh Data
              </Button>
              <Button>
                <MapPin className="mr-2 h-4 w-4" />
                View Map
              </Button>
            </div>
          }
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load wells data. Please refresh the page or try again
              later.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="rounded-lg border bg-card p-8">
            <div className="space-y-4">
              <div className="h-10 animate-pulse rounded bg-muted" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={wells}
            searchable
            searchPlaceholder="Search wells..."
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
