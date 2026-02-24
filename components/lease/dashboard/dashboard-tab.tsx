"use client";

import * as React from "react";
import { AssetsSection } from "./sections/assets-section";
import { WellsSection } from "./sections/wells-section";
import { TeamsSection } from "./sections/teams-section";
import { TankDetailView } from "./tank-detail/tank-detail-view";
import {
  EXAMPLE_OIL_TANKS,
  EXAMPLE_EFM,
  EXAMPLE_FILTER_POT,
  EXAMPLE_WATER_TANKS,
  EXAMPLE_COMPRESSORS,
  EXAMPLE_SEPARATOR,
  EXAMPLE_WELLS,
  EXAMPLE_TEAM,
} from "./example-data";
import type {
  OilTank,
  EFMChart,
  FilterPot,
  WaterTank,
  Compressor,
  Separator,
  Well,
  TeamMember,
} from "./types";

interface DashboardTabProps {
  oilTanks?: OilTank[];
  efmCharts?: EFMChart[];
  filterPot?: FilterPot;
  waterTanks?: WaterTank[];
  compressors?: Compressor[];
  separator?: Separator;
  wells?: Well[];
  teamMembers?: TeamMember[];
  onHistoryClick?: () => void;
  onManageTeamClick?: () => void;
}

export function DashboardTab({
  oilTanks = EXAMPLE_OIL_TANKS,
  efmCharts = EXAMPLE_EFM,
  filterPot = EXAMPLE_FILTER_POT,
  waterTanks = EXAMPLE_WATER_TANKS,
  compressors = EXAMPLE_COMPRESSORS,
  separator = EXAMPLE_SEPARATOR,
  wells = EXAMPLE_WELLS,
  teamMembers = EXAMPLE_TEAM,
  onHistoryClick,
  onManageTeamClick,
}: DashboardTabProps) {
  const [selectedTankId, setSelectedTankId] = React.useState<string | null>(
    null,
  );

  // Find the clicked tank from either oil or water tanks
  const selectedTank = React.useMemo(() => {
    if (!selectedTankId) return null;
    return (
      [...oilTanks, ...waterTanks].find((t) => t.id === selectedTankId) ?? null
    );
  }, [selectedTankId, oilTanks, waterTanks]);

  return (
    <>
      <div className="space-y-6">
        <AssetsSection
          oilTanks={oilTanks}
          efmCharts={efmCharts}
          filterPot={filterPot}
          waterTanks={waterTanks}
          compressors={compressors}
          separator={separator}
          onHistoryClick={onHistoryClick}
          onTankClick={(tankId) => setSelectedTankId(tankId)}
        />
        <WellsSection wells={wells} onHistoryClick={onHistoryClick} />
        <TeamsSection
          teamMembers={teamMembers}
          onManageTeamClick={onManageTeamClick}
        />
      </div>

      {selectedTankId && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSelectedTankId(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto bg-[#16181d] shadow-2xl">
            <TankDetailView
              tankId={selectedTankId}
              onClose={() => setSelectedTankId(null)}
            />
          </div>
        </>
      )}
    </>
  );
}
