import * as React from "react";
import { SectionHeader } from "../ui/section-header";
import { TankCard } from "../assets/tank-card";
import { EFMCard } from "../assets/efm-card";
import { FilterPotCard } from "../assets/filter-pot-card";
import { CompressorCard } from "../assets/compressor-card";
import { SeparatorCard } from "../assets/separator-card";
import type {
  OilTank,
  EFMChart,
  FilterPot,
  WaterTank,
  Compressor,
  Separator,
} from "../types";

interface AssetsSectionProps {
  oilTanks: OilTank[];
  efmCharts: EFMChart[];
  filterPot: FilterPot;
  waterTanks: WaterTank[];
  compressors: Compressor[];
  separator: Separator;
  onTankClick?: (tankId: string) => void;
  onEfmClick?: (efmId: string) => void;
  onFilterPotClick?: () => void;
  onCompressorClick?: (compressorId: string) => void;
  onSeparatorClick?: () => void;
  onHistoryClick?: () => void;
}

export function AssetsSection({
  oilTanks,
  efmCharts,
  filterPot,
  waterTanks,
  compressors,
  separator,
  onTankClick,
  onEfmClick,
  onFilterPotClick,
  onCompressorClick,
  onSeparatorClick,
  onHistoryClick,
}: AssetsSectionProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const query = searchQuery.trim().toLowerCase();

  const filteredOilTanks = React.useMemo(
    () => (!query ? oilTanks : oilTanks.filter((tank) => tank.name.toLowerCase().includes(query))),
    [oilTanks, query],
  );
  const filteredWaterTanks = React.useMemo(
    () =>
      !query
        ? waterTanks
        : waterTanks.filter((tank) => tank.name.toLowerCase().includes(query)),
    [waterTanks, query],
  );
  const filteredEfmCharts = React.useMemo(
    () =>
      !query
        ? efmCharts
        : efmCharts.filter((efm) =>
            `${efm.name} ${efm.mcfd} ${efm.yesterdayVolume}`
              .toLowerCase()
              .includes(query),
          ),
    [efmCharts, query],
  );
  const filteredCompressors = React.useMemo(
    () =>
      !query
        ? compressors
        : compressors.filter((item) =>
            `${item.name} ${item.runStatus} ${item.oilPressure} ${item.batteryLevel}`
              .toLowerCase()
              .includes(query),
          ),
    [compressors, query],
  );

  const showFilterPot =
    !query ||
    `filter pot ${filterPot.inletPsi} ${filterPot.outletPsi} ${filterPot.filterType}`
      .toLowerCase()
      .includes(query);
  const showSeparator =
    !query ||
    `separator ${separator.todayVolumeFt} ${separator.yesterdayVolume} ${separator.accumVolume} ${separator.flowRate}`
      .toLowerCase()
      .includes(query);

  const hasResults =
    filteredOilTanks.length > 0 ||
    filteredWaterTanks.length > 0 ||
    filteredEfmCharts.length > 0 ||
    filteredCompressors.length > 0 ||
    showFilterPot ||
    showSeparator;

  return (
    <div>
      <SectionHeader
        title="Assets"
        searchOpen={searchOpen}
        searchPlaceholder="Search assets"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => {
          setSearchQuery("");
          setSearchOpen(false);
        }}
        onToggleSearch={() => {
          setSearchOpen((v) => !v);
          if (searchOpen) setSearchQuery("");
        }}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredOilTanks.map((tank) => (
          <TankCard
            key={tank.id}
            tank={tank}
            onClick={() => onTankClick?.(tank.id)}
          />
        ))}

        {filteredEfmCharts.map((efm) => (
          <EFMCard
            key={efm.id}
            efm={efm}
            className="sm:col-span-2"
            onClick={() => onEfmClick?.(efm.id)}
          />
        ))}

        {showFilterPot && (
          <FilterPotCard filterPot={filterPot} onClick={onFilterPotClick} />
        )}

        {filteredCompressors.slice(0, 1).map((c) => (
          <CompressorCard
            key={c.name}
            compressor={c}
            onClick={() => onCompressorClick?.(c.id ?? c.name)}
          />
        ))}

        {filteredWaterTanks.map((tank) => (
          <TankCard
            key={tank.id}
            tank={tank}
            onClick={() => onTankClick?.(tank.id)}
          />
        ))}

        {filteredCompressors.slice(1).map((c) => (
          <CompressorCard
            key={c.name}
            compressor={c}
            onClick={() => onCompressorClick?.(c.id ?? c.name)}
          />
        ))}

        {showSeparator && (
          <SeparatorCard separator={separator} onClick={onSeparatorClick} />
        )}
      </div>
      {searchOpen && !hasResults && (
        <p className="mt-3 text-sm text-black/45 dark:text-white/45">
          No assets match your search.
        </p>
      )}
    </div>
  );
}
