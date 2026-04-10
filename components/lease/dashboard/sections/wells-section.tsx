import * as React from "react";
import { Search } from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import { Card } from "../ui/card";
import { StatRow } from "../ui/stat-row";
import type { Well } from "../types";

interface WellsSectionProps {
  wells: Well[];
  onHistoryClick?: () => void;
  onWellClick?: (id: string) => void;
}

export function WellsSection({
  wells,
  onHistoryClick,
  onWellClick,
}: WellsSectionProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const query = searchQuery.trim().toLowerCase();
  const filteredWells = React.useMemo(
    () =>
      !query
        ? wells
        : wells.filter((well) =>
            `${well.name} ${well.dailyUptime} ${well.casingPressure} ${well.tubingPressure} ${well.type ?? ""}`
              .toLowerCase()
              .includes(query),
          ),
    [wells, query],
  );

  return (
    <div>
      <SectionHeader
        title="Wells"
        searchOpen={searchOpen}
        onToggleSearch={() => {
          setSearchOpen((v) => !v);
          if (searchOpen) setSearchQuery("");
        }}
      />
      {searchOpen && (
        <div className="relative mb-3">
          <Search className="app-search-icon" />
          <input
            autoFocus
            type="text"
            placeholder="Search wells..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchQuery("");
                setSearchOpen(false);
              }
            }}
            className="app-search-input w-full"
          />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredWells.map((well) => (
          <Card key={well.id}>
            <div
              className="cursor-pointer"
              onClick={() => onWellClick?.(well.id)}
              role={onWellClick ? "button" : undefined}
              tabIndex={onWellClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (!onWellClick) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onWellClick(well.id);
                }
              }}
            >
              <div className="flex items-start justify-between mb-2">
              <p className="text-base font-bold text-white">{well.name}</p>
              <p className="text-xs text-white/40">{well.timestamp}</p>
              </div>

              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <StatRow label="Daily Uptime" value={well.dailyUptime} />
                  <StatRow
                    label="Casing Pressure"
                    value={well.casingPressure}
                  />
                  {well.accInjTotal && (
                    <StatRow
                      label="Acc. Inj. Total"
                      value={well.accInjTotal}
                    />
                  )}
                  {well.allocProd && (
                    <StatRow label="Alloc. Prod." value={well.allocProd} />
                  )}
                </div>
                <div className="space-y-1 text-right">
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
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {searchOpen && filteredWells.length === 0 && (
        <p className="mt-3 text-sm text-black/45 dark:text-white/45">
          No wells match your search.
        </p>
      )}
    </div>
  );
}
