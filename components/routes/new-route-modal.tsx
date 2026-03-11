"use client";

import * as React from "react";
import { X, Plus, Search, Info, GripVertical } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDiscardRouteModal } from "./confirm-discard-route-modal";
import type { RouteStop } from "./types";

const STOP_SUGGESTIONS: RouteStop[] = [
  {
    id: "1",
    name: "Riordan Lease",
    distance: "0.2 miles",
    coordinates: "35.6870° N, 105.9378° W",
  },
  {
    id: "2",
    name: "Teasley Lease",
    distance: "1.2 miles",
    coordinates: "35.6870° N, 105.9378° W",
  },
  {
    id: "3",
    name: "Union Lease",
    distance: "0.2 miles",
    coordinates: "35.6870° N, 105.9378° W",
  },
  {
    id: "4",
    name: "Riffle Lease",
    distance: "0.3 miles",
    coordinates: "35.6870° N, 107.9378° W",
  },
  {
    id: "5",
    name: "River Estate Lease",
    distance: "0.2 miles",
    coordinates: "35.6870° N, 105.9378° W",
  },
];

interface NewRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialRoute?: { name: string; stops: RouteStop[] } | null;
  onSave: (name: string, stops: RouteStop[]) => void;
}

export function NewRouteModal({
  open,
  onOpenChange,
  initialRoute,
  onSave,
}: NewRouteModalProps) {
  const [routeName, setRouteName] = React.useState("");
  const [stops, setStops] = React.useState<RouteStop[]>([]);
  const [stopSearch, setStopSearch] = React.useState("");
  const [suggestionsOpen, setSuggestionsOpen] = React.useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = React.useState(false);

  const isEdit = !!initialRoute;

  React.useEffect(() => {
    if (open) {
      setRouteName(initialRoute?.name ?? "");
      setStops(initialRoute?.stops ?? []);
      setStopSearch("");
      setSuggestionsOpen(false);
    }
  }, [open, initialRoute]);

  const filteredSuggestions = React.useMemo(() => {
    const q = stopSearch.toLowerCase();
    if (!q) return STOP_SUGGESTIONS;
    return STOP_SUGGESTIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) && !stops.some((x) => x.id === s.id),
    );
  }, [stopSearch, stops]);

  const addStop = (stop: RouteStop) => {
    setStops((prev) =>
      prev.some((s) => s.id === stop.id) ? prev : [...prev, stop],
    );
    setStopSearch("");
    setSuggestionsOpen(false);
  };

  const removeStop = (id: string) =>
    setStops((prev) => prev.filter((s) => s.id !== id));

  const handleSave = () => {
    onSave(routeName.trim(), stops);
    onOpenChange(false);
  };

  const handleConfirmDiscard = () => {
    setConfirmDiscardOpen(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-black/10 bg-white p-0 text-black [&>button]:hidden dark:border-white/10 dark:bg-[#1A1C1E] dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-black dark:text-white">
              {isEdit ? "Edit Route" : "New Route"}
            </DialogTitle>
          </DialogHeader>
          <DialogClose asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[#34C759] hover:text-[#34C759]/90"
            >
              <span>Close</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#34C759]">
                <X className="h-3.5 w-3.5" />
              </span>
            </button>
          </DialogClose>
        </div>

        <div className="space-y-5 px-6 pb-6 pt-4">
          {/* Route name */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium text-black dark:text-white">
                Route Name
              </Label>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60">
                <Info className="h-2.5 w-2.5" />
              </span>
            </div>
            <Input
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Enter route name"
              className="border-black/20 bg-gray-100 text-black placeholder:text-black/40 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/40"
            />
          </div>

          {/* Stop search */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium text-black dark:text-white">
                Your routes
              </Label>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60">
                <Info className="h-2.5 w-2.5" />
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={stopSearch}
                onChange={(e) => {
                  setStopSearch(e.target.value);
                  setSuggestionsOpen(true);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                placeholder={
                  stops.length === 0 ? "Select stop 1" : "Search stops..."
                }
                className="border-black/20 bg-gray-100 pl-9 text-black placeholder:text-black/40 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/40"
              />
              {suggestionsOpen &&
                (filteredSuggestions.length > 0 || stopSearch) && (
                  <>
                    <div
                      className="absolute inset-0 -z-10"
                      aria-hidden
                      onClick={() => setSuggestionsOpen(false)}
                    />
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-md border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-[#252930]">
                      {filteredSuggestions.map((stop) => (
                        <button
                          key={stop.id}
                          type="button"
                          onClick={() => addStop(stop)}
                          className="flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                        >
                          <span>
                            {stop.name} ({stop.distance})
                          </span>
                          <span className="text-xs text-black/50 dark:text-white/50">
                            {stop.coordinates}
                          </span>
                        </button>
                      ))}
                      {filteredSuggestions.length === 0 && (
                        <div className="px-3 py-4 text-center text-sm text-black/50 dark:text-white/50">
                          No stops found
                        </div>
                      )}
                    </div>
                  </>
                )}
            </div>

            {/* Stop list */}
            {stops.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-sm font-medium text-black dark:text-white">
                  Your routes ({stops.length})
                </p>
                <p className="flex items-center gap-1.5 text-sm text-black/60 dark:text-white/60">
                  <GripVertical
                    className="h-3.5 w-3.5 text-[#34C759]"
                    aria-hidden
                  />
                  Click and drag a stop to reorder route
                </p>
                <ul className="space-y-2">
                  {stops.map((stop, index) => (
                    <li
                      key={stop.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "application/json",
                          JSON.stringify({ id: stop.id }),
                        );
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const raw = e.dataTransfer.getData("application/json");
                        if (!raw) return;
                        const { id: draggedId } = JSON.parse(raw) as {
                          id: string;
                        };
                        const fromIndex = stops.findIndex(
                          (s) => s.id === draggedId,
                        );
                        if (fromIndex === -1 || fromIndex === index) return;
                        const newStops = [...stops];
                        const [removed] = newStops.splice(fromIndex, 1);
                        newStops.splice(index, 0, removed);
                        setStops(newStops);
                      }}
                      className="group flex cursor-grab items-center justify-between gap-2 rounded-md border border-black/10 bg-gray-50 px-3 py-2 active:cursor-grabbing dark:border-white/10 dark:bg-[#252930]"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <div className="min-w-0">
                          <p className="text-sm text-black dark:text-white">
                            {stop.name} ({stop.distance})
                          </p>
                          <p className="truncate text-xs text-black/50 dark:text-white/50">
                            {stop.coordinates}
                          </p>
                        </div>
                      </div>
                      <div className="relative flex h-8 min-w-[5.5rem] items-center justify-end">
                        <GripVertical
                          className="h-4 w-4 shrink-0 text-[#34C759] transition-opacity group-hover:opacity-0"
                          aria-hidden
                        />
                        <Button
                          type="button"
                          size="sm"
                          className="absolute right-0 top-1/2 flex -translate-y-1/2 rounded-[4px] bg-[#381B1B] text-[#FF383C] opacity-0 transition-opacity hover:bg-[#381B1B]/90 hover:text-[#FF383C] group-hover:opacity-100"
                          onClick={() => removeStop(stop.id)}
                        >
                          Delete Stop
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add stop */}
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-[#34C759] hover:underline"
              onClick={() => setSuggestionsOpen(true)}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#34C759]">
                <Plus className="h-3 w-3" />
              </span>
              Add new stop
            </button>
          </div>

          {/* Footer actions */}
          <div className="flex w-full flex-col gap-3 border-t border-black/10 pt-4 dark:border-white/10">
            <Button
              type="button"
              className="w-full bg-[#34C759] font-semibold text-black hover:bg-[#34C759]/90"
              onClick={handleSave}
            >
              Save Route
            </Button>
            <Button
              type="button"
              className="w-full border border-[#FF383C] bg-transparent font-semibold text-[#FF383C] hover:bg-[#FF383C]/10"
              onClick={() => setConfirmDiscardOpen(true)}
            >
              Delete Route
            </Button>
          </div>
        </div>
      </DialogContent>

      <ConfirmDiscardRouteModal
        open={confirmDiscardOpen}
        onOpenChange={setConfirmDiscardOpen}
        onConfirm={handleConfirmDiscard}
      />
    </Dialog>
  );
}
