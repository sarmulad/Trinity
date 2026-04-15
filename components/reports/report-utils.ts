import { REPORT_LIBRARY } from "./report-constants";

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toTimeInput(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (/^\d{2}:\d{2}$/.test(normalized)) return normalized;

  const [timePart = "", period = "am"] = normalized.split(" ");
  const [hourRaw = "6", minuteRaw = "00"] = timePart.split(":");
  let hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return "06:00";
  if (period === "pm" && hour < 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

export function toDisplayTime(value: string): string {
  const [hourRaw = "6", minuteRaw = "00"] = value.split(":");
  let hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return "6:00 AM";

  const period = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  if (hour > 12) hour -= 12;

  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export function formatRunDateLabel(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function normalizeIdentifier(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function resolveReportName(identifier: string | null): string {
  if (!identifier) return REPORT_LIBRARY[0].name;

  const decoded = safeDecode(identifier);
  const byExact = REPORT_LIBRARY.find(
    (report) => report.name.toLowerCase() === decoded.toLowerCase(),
  );
  if (byExact) return byExact.name;

  const normalized = normalizeIdentifier(decoded);
  const bySlug = REPORT_LIBRARY.find(
    (report) => normalizeIdentifier(report.name) === normalized,
  );
  if (bySlug) return bySlug.name;

  const numeric = Number(decoded);
  if (
    Number.isInteger(numeric) &&
    numeric >= 1 &&
    numeric <= REPORT_LIBRARY.length
  ) {
    return REPORT_LIBRARY[numeric - 1].name;
  }

  return REPORT_LIBRARY[0].name;
}
