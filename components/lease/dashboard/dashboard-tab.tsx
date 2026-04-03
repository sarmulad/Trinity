"use client";

import * as React from "react";
import { AssetsSection } from "./sections/assets-section";
import { WellsSection } from "./sections/wells-section";
import { TeamsSection } from "./sections/teams-section";
import {
  DetailView,
  oilTankToDetail,
  waterTankToDetail,
  efmToDetail,
  filterPotToDetail,
  compressorToDetail,
  separatorToDetail,
  wellToDetail,
  teamMemberToDetail,
} from "./detail-view/detail-view";
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
import type { DetailViewData } from "./detail-view/detail-view";

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
  const [detail, setDetail] = React.useState<DetailViewData | null>(null);

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
          onTankClick={(id) => {
            const t = [...oilTanks, ...waterTanks].find((t) => t.id === id);
            if (t)
              setDetail(
                "prod" in t
                  ? oilTankToDetail(t as OilTank)
                  : waterTankToDetail(t as WaterTank),
              );
          }}
          onEfmClick={(id) => {
            const e = efmCharts.find((e) => e.id === id);
            if (e) setDetail(efmToDetail(e));
          }}
          onFilterPotClick={() => setDetail(filterPotToDetail(filterPot))}
          onCompressorClick={(id) => {
            const c = compressors.find((c) => c.id === id || c.name === id);
            if (c) setDetail(compressorToDetail(c));
          }}
          onSeparatorClick={() => setDetail(separatorToDetail(separator))}
        />
        <WellsSection
          wells={wells}
          onHistoryClick={onHistoryClick}
          onWellClick={(id) => {
            const w = wells.find((w) => w.id === id);
            if (w) setDetail(wellToDetail(w));
          }}
        />
        <TeamsSection
          teamMembers={teamMembers}
          onManageTeamClick={onManageTeamClick}
          onTeamClick={(id) => {
            const member = teamMembers.find((m) => m.id === id);
            if (member) setDetail(teamMemberToDetail(member));
          }}
        />
      </div>

      {detail && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setDetail(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto bg-[#16181d] shadow-2xl">
            <DetailView data={detail} onClose={() => setDetail(null)} />
          </div>
        </>
      )}
    </>
  );
}
