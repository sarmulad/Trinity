export interface RouteStop {
  id: string;
  name: string;
  distance: string;
  coordinates: string;
}

export interface RouteDayStatus {
  date: number; // day of month
  status: "completed" | "incomplete" | "future";
}

export interface RouteListItem {
  id: string;
  name: string;
  totalStops: number;
  lastCompleted: string;
  /** Grid: 7 columns (M-S), multiple rows of dates; value is status for that day */
  completionGrid: RouteDayStatus[];
}
