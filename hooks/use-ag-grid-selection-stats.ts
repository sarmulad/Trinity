import * as React from "react";
import type { SelectionChangedEvent } from "ag-grid-community";

import {
  calculateSelectionStats,
  EMPTY_SELECTION_STATS,
  type AgGridSelectionStats,
} from "@/lib/ag-grid-selection-stats";

export function useAgGridSelectionStats<T extends object>() {
  const [stats, setStats] = React.useState<AgGridSelectionStats>(
    EMPTY_SELECTION_STATS,
  );

  const onSelectionChanged = React.useCallback(
    (event: SelectionChangedEvent<T>) => {
      const selected = event.api.getSelectedRows() as Record<string, unknown>[];
      setStats(calculateSelectionStats(selected));
    },
    [],
  );

  return { stats, onSelectionChanged };
}
