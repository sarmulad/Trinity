import type { AgGridSelectionStats } from "@/lib/ag-grid-selection-stats";

interface AgGridSelectionStatsBarProps {
  stats: AgGridSelectionStats;
  className?: string;
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export function AgGridSelectionStatsBar({
  stats,
  className,
}: AgGridSelectionStatsBarProps) {
  const rootClassName =
    className ??
    "mt-2 flex flex-wrap items-center justify-end gap-3 text-xs text-white/60";

  return (
    <div className={rootClassName}>
      <span>Selected Rows: {stats.selectedRows}</span>
      <span>COUNT: {stats.valueCount}</span>
      <span>SUM: {numberFormatter.format(stats.sum)}</span>
      <span>AVG: {numberFormatter.format(stats.avg)}</span>
    </div>
  );
}
