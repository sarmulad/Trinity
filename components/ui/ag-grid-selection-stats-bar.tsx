import type { AgGridSelectionStats } from "@/lib/ag-grid-selection-stats";

interface AgGridSelectionStatsBarProps {
  stats: AgGridSelectionStats;
  className?: string;
  showAggregates?: boolean;
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export function AgGridSelectionStatsBar({
  stats,
  className,
  showAggregates = true,
}: AgGridSelectionStatsBarProps) {
  const rootClassName =
    className ??
    "mt-2 flex flex-wrap items-center justify-end gap-3 text-xs text-white/60";

  return (
    <div className={rootClassName}>
      <span>Selected Rows: {stats.selectedRows}</span>
      {showAggregates && <span>COUNT: {stats.valueCount}</span>}
      {showAggregates && <span>SUM: {numberFormatter.format(stats.sum)}</span>}
      {showAggregates && <span>AVG: {numberFormatter.format(stats.avg)}</span>}
    </div>
  );
}
