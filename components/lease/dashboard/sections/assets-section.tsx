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
  onHistoryClick,
}: AssetsSectionProps) {
  return (
    <div>
      <SectionHeader
        title="Assets"
        actionLabel="History"
        onAction={onHistoryClick}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {oilTanks.map((tank) => (
          <TankCard
            key={tank.id}
            tank={tank}
            onClick={() => onTankClick?.(tank.id)}
          />
        ))}

        {efmCharts.map((efm) => (
          <EFMCard key={efm.id} efm={efm} />
        ))}
        <FilterPotCard filterPot={filterPot} />

        {compressors.slice(0, 1).map((c) => (
          <CompressorCard key={c.name} compressor={c} />
        ))}
        {waterTanks.map((tank) => (
          <TankCard
            key={tank.id}
            tank={tank}
            onClick={() => onTankClick?.(tank.id)}
          />
        ))}

        {compressors.slice(1).map((c) => (
          <CompressorCard key={c.name} compressor={c} />
        ))}
        <SeparatorCard separator={separator} />
      </div>
    </div>
  );
}
