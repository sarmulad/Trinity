"use client";

import * as React from "react";
import { MoreVertical, Route as RouteIcon, Calendar, Check, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RouteListItem } from "./types";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

interface RouteCardProps {
  route: RouteListItem;
  onEdit?: (route: RouteListItem) => void;
  onDelete?: (route: RouteListItem) => void;
  onOpen?: (route: RouteListItem) => void;
}

export function RouteCard({ route, onEdit, onDelete, onOpen }: RouteCardProps) {
  const sortedGrid = React.useMemo(
    () => [...route.completionGrid].sort((a, b) => a.date - b.date),
    [route.completionGrid],
  );

  return (
    <Card
      className="cursor-pointer border-white/10 bg-[#252930] transition-colors hover:border-white/20"
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(route)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(route);
        }
      }}
    >
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[280px_minmax(0,1fr)] sm:items-center">
          <div className="min-w-0 space-y-2 sm:border-r sm:border-white/10 sm:pr-5">
            <h3 className="text-[1.95rem] font-semibold leading-none text-white">
              {route.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-white/70">
              <RouteIcon className="h-4 w-4 shrink-0 text-white/45" />
              <span>
                Total Stops:{" "}
                <span className="font-semibold text-white">{route.totalStops} Stops</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/70">
              <Calendar className="h-4 w-4 shrink-0 text-white/45" />
              <span>
                Last Completed:{" "}
                <span className="font-semibold text-white">{route.lastCompleted}</span>
              </span>
            </div>
          </div>

          <div className="flex min-w-0 items-start justify-between gap-2 rounded-md bg-[#1A1D22] px-3 py-2">
            <div className="min-w-0 overflow-x-auto">
              <div
                className="grid w-max gap-x-1.5 gap-y-1 text-center text-xs"
                style={{ gridTemplateColumns: `repeat(${sortedGrid.length}, 1.85rem)` }}
              >
                {sortedGrid.map((_, i) => (
                  <span key={`day-${i}`} className="font-medium text-white/80">
                    {DAY_LABELS[i % 7]}
                  </span>
                ))}
                {sortedGrid.map((cell, idx) => (
                  <span
                    key={`status-${idx}`}
                    className={cn(
                      "mx-auto flex h-5 w-5 items-center justify-center rounded border",
                      cell.status === "completed" &&
                        "border-[#34C759] bg-transparent text-[#34C759]",
                      cell.status === "incomplete" &&
                        "border-[#FF383C] bg-transparent text-[#FF383C]",
                      cell.status === "future" &&
                        "border-white/45 bg-transparent text-transparent",
                    )}
                  >
                    {cell.status === "completed" && (
                      <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                    )}
                    {cell.status === "incomplete" && (
                      <Minus className="h-2.5 w-2.5" strokeWidth={2.5} />
                    )}
                  </span>
                ))}
                {sortedGrid.map((cell, idx) => (
                  <span key={`date-${idx}`} className="text-white/55">
                    {cell.date}
                  </span>
                ))}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-white/60 hover:bg-white/10 hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-white/10 bg-[#252930]"
              >
                <DropdownMenuItem
                  className="text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(route);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(route);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
