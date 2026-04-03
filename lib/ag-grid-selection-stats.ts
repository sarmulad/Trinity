export interface AgGridSelectionStats {
  selectedRows: number;
  valueCount: number;
  sum: number;
  avg: number;
}

export const EMPTY_SELECTION_STATS: AgGridSelectionStats = {
  selectedRows: 0,
  valueCount: 0,
  sum: 0,
  avg: 0,
};

function parseNumericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Allow common display formats like "$1,234.50" and "98.3%".
  const normalized = trimmed
    .replace(/[$,%]/g, "")
    .replace(/,/g, "");

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function calculateSelectionStats(
  rows: Record<string, unknown>[],
): AgGridSelectionStats {
  if (!rows.length) return EMPTY_SELECTION_STATS;

  let sum = 0;
  let valueCount = 0;

  rows.forEach((row) => {
    Object.values(row).forEach((value) => {
      const numeric = parseNumericValue(value);
      if (numeric === null) return;
      sum += numeric;
      valueCount += 1;
    });
  });

  return {
    selectedRows: rows.length,
    valueCount,
    sum,
    avg: valueCount > 0 ? sum / valueCount : 0,
  };
}
