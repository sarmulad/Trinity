"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Search,
  Menu,
  MoreVertical,
} from "lucide-react";

type SubmissionStatus = "Completed" | "Skipped" | "Partial";

interface SubmissionRow {
  id: string;
  route: string;
  serviceDate: string;
  submittedBy: string;
  stops: string;
  submissionDate: string;
  status: SubmissionStatus;
}

const BASE_ROWS: Omit<SubmissionRow, "id">[] = [
  {
    route: "Johnson Route",
    serviceDate: "1/23/24",
    submittedBy: "John Doe",
    stops: "5/5",
    submissionDate: "1/23/24",
    status: "Completed",
  },
  {
    route: "Union Route",
    serviceDate: "1/23/24",
    submittedBy: "Alex John",
    stops: "0/5",
    submissionDate: "1/23/24",
    status: "Skipped",
  },
  {
    route: "Riordan Route",
    serviceDate: "1/23/24",
    submittedBy: "Alana Joel",
    stops: "3/5",
    submissionDate: "1/23/24",
    status: "Partial",
  },
  {
    route: "Johnson Route",
    serviceDate: "1/23/24",
    submittedBy: "Alex John",
    stops: "5/5",
    submissionDate: "1/23/24",
    status: "Completed",
  },
  {
    route: "Union Route",
    serviceDate: "1/23/24",
    submittedBy: "John Doe",
    stops: "5/5",
    submissionDate: "1/23/24",
    status: "Completed",
  },
  {
    route: "Riordan Route",
    serviceDate: "1/23/24",
    submittedBy: "Alex John",
    stops: "4/5",
    submissionDate: "1/23/24",
    status: "Partial",
  },
  {
    route: "Johnson Route",
    serviceDate: "1/23/24",
    submittedBy: "Alana Joel",
    stops: "5/5",
    submissionDate: "1/23/24",
    status: "Completed",
  },
  {
    route: "Riordan Route",
    serviceDate: "1/23/24",
    submittedBy: "Alex John",
    stops: "3/5",
    submissionDate: "1/23/24",
    status: "Partial",
  },
  {
    route: "Union Route",
    serviceDate: "1/23/24",
    submittedBy: "John Doe",
    stops: "5/5",
    submissionDate: "1/23/24",
    status: "Completed",
  },
  {
    route: "Riordan Route",
    serviceDate: "1/23/24",
    submittedBy: "Alex John",
    stops: "0/5",
    submissionDate: "1/23/24",
    status: "Skipped",
  },
  {
    route: "Riordan Route",
    serviceDate: "1/23/24",
    submittedBy: "Alana Joel",
    stops: "2/5",
    submissionDate: "1/23/24",
    status: "Partial",
  },
  {
    route: "Riordan Route",
    serviceDate: "1/23/24",
    submittedBy: "Alex John",
    stops: "5/5",
    submissionDate: "1/23/24",
    status: "Completed",
  },
];

/** Extra standalone demo rows (always at least a handful of realistic history). */
const EXTRA_DUMMY_SUBMISSIONS: SubmissionRow[] = [
  {
    id: "demo-1",
    route: "Johnson Route",
    serviceDate: "4/2/26",
    submittedBy: "Sam Rivera",
    stops: "5/5",
    submissionDate: "4/2/26",
    status: "Completed",
  },
  {
    id: "demo-2",
    route: "Johnson Route",
    serviceDate: "3/18/26",
    submittedBy: "Casey Ruiz",
    stops: "4/5",
    submissionDate: "3/18/26",
    status: "Partial",
  },
  {
    id: "demo-3",
    route: "Union Route",
    serviceDate: "3/10/26",
    submittedBy: "Jordan Smith",
    stops: "5/5",
    submissionDate: "3/10/26",
    status: "Completed",
  },
  {
    id: "demo-4",
    route: "Riordan Route",
    serviceDate: "2/28/26",
    submittedBy: "Riley Chen",
    stops: "0/5",
    submissionDate: "2/28/26",
    status: "Skipped",
  },
  {
    id: "demo-5",
    route: "Johnson Route",
    serviceDate: "2/14/26",
    submittedBy: "Taylor Brooks",
    stops: "3/5",
    submissionDate: "2/14/26",
    status: "Partial",
  },
  {
    id: "demo-6",
    route: "Union Route",
    serviceDate: "1/22/26",
    submittedBy: "Alex John",
    stops: "5/5",
    submissionDate: "1/22/26",
    status: "Completed",
  },
  {
    id: "demo-7",
    route: "Riordan Route",
    serviceDate: "1/8/26",
    submittedBy: "Morgan Lee",
    stops: "5/5",
    submissionDate: "1/8/26",
    status: "Completed",
  },
  {
    id: "demo-8",
    route: "Johnson Route",
    serviceDate: "12/20/25",
    submittedBy: "Jamie Park",
    stops: "2/5",
    submissionDate: "12/20/25",
    status: "Partial",
  },
  {
    id: "demo-9",
    route: "Union Route",
    serviceDate: "12/5/25",
    submittedBy: "Pat O'Neill",
    stops: "1/5",
    submissionDate: "12/5/25",
    status: "Partial",
  },
  {
    id: "demo-10",
    route: "Riordan Route",
    serviceDate: "11/18/25",
    submittedBy: "Chris Vega",
    stops: "5/5",
    submissionDate: "11/18/25",
    status: "Completed",
  },
  {
    id: "demo-11",
    route: "Johnson Route",
    serviceDate: "11/2/25",
    submittedBy: "Dana Frost",
    stops: "0/5",
    submissionDate: "11/2/25",
    status: "Skipped",
  },
  {
    id: "demo-12",
    route: "Union Route",
    serviceDate: "10/27/25",
    submittedBy: "Alex John",
    stops: "4/5",
    submissionDate: "10/27/25",
    status: "Partial",
  },
  {
    id: "demo-13",
    route: "Riordan Route",
    serviceDate: "10/14/25",
    submittedBy: "Alana Joel",
    stops: "3/5",
    submissionDate: "10/14/25",
    status: "Partial",
  },
  {
    id: "demo-14",
    route: "Johnson Route",
    serviceDate: "9/30/25",
    submittedBy: "John Doe",
    stops: "5/5",
    submissionDate: "9/30/25",
    status: "Completed",
  },
];

const MOCK_SUBMISSIONS: SubmissionRow[] = [
  ...EXTRA_DUMMY_SUBMISSIONS,
  ...Array.from({ length: 48 }).map((_, idx) => ({
    id: `sub-${idx + 1}`,
    ...BASE_ROWS[idx % BASE_ROWS.length],
  })),
];

const PAGE_SIZE = 14;

const STATUS_CLASS: Record<SubmissionStatus, string> = {
  Completed: "text-[#34C759]",
  Skipped: "text-[#FF383C]",
  Partial: "text-[#FFB020]",
};

const TABLE_HEADERS = [
  "Route",
  "Service Date",
  "Submitted by",
  "Stops",
  "Submission Date",
  "Status",
  "Action",
];

/** Used when `routeFilter` does not match any canned mock route names (e.g. user-created routes). */
const SYNTHETIC_SUBMISSION_TEMPLATES: Omit<SubmissionRow, "id" | "route">[] = [
  {
    serviceDate: "4/2/26",
    submittedBy: "Sam Rivera",
    stops: "5/5",
    submissionDate: "4/2/26",
    status: "Completed",
  },
  {
    serviceDate: "3/18/26",
    submittedBy: "Casey Ruiz",
    stops: "4/5",
    submissionDate: "3/18/26",
    status: "Partial",
  },
  {
    serviceDate: "2/28/26",
    submittedBy: "Jordan Smith",
    stops: "5/5",
    submissionDate: "2/28/26",
    status: "Completed",
  },
  {
    serviceDate: "2/14/26",
    submittedBy: "Riley Chen",
    stops: "0/5",
    submissionDate: "2/14/26",
    status: "Skipped",
  },
  {
    serviceDate: "1/22/26",
    submittedBy: "Taylor Brooks",
    stops: "3/5",
    submissionDate: "1/22/26",
    status: "Partial",
  },
  {
    serviceDate: "12/8/25",
    submittedBy: "Alex John",
    stops: "5/5",
    submissionDate: "12/8/25",
    status: "Completed",
  },
];

function pickRowsForRouteFilter(
  allRows: SubmissionRow[],
  routeFilter?: string,
): SubmissionRow[] {
  const raw = routeFilter?.trim();
  if (!raw) return allRows;

  const rf = raw.toLowerCase();
  const exact = allRows.filter((row) => row.route.toLowerCase() === rf);
  if (exact.length > 0) return exact;

  const loose = allRows.filter(
    (row) =>
      row.route.toLowerCase().includes(rf) ||
      rf.includes(row.route.toLowerCase()),
  );
  if (loose.length > 0) return loose;

  const idKey = raw
    .toLowerCase()
    .replace(/[^\da-z]+/gi, "")
    .slice(0, 24) || "route";
  return SYNTHETIC_SUBMISSION_TEMPLATES.map((tpl, i) => ({
    ...tpl,
    id: `syn-${idKey}-${i}`,
    route: raw,
  }));
}

export interface RouteSubmissionsSectionProps {
  /** When set, rows are narrowed to this route (exact mock name, then substring match, else demo rows for this name). */
  routeFilter?: string;
}

export function RouteSubmissionsSection({
  routeFilter,
}: RouteSubmissionsSectionProps) {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filteredRows = React.useMemo(() => {
    let rows = pickRowsForRouteFilter(MOCK_SUBMISSIONS, routeFilter);
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.route.toLowerCase().includes(q) ||
        row.submittedBy.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q),
    );
  }, [search, routeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  React.useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const paginatedRows = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, currentPage]);

  const visiblePageButtons = Array.from(
    { length: Math.min(5, pageCount) },
    (_, i) => i + 1,
  );

  return (
    <section className="rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-[#1A1D22]/80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="app-search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search Submissions"
              className="app-search-input w-full"
            />
          </div>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#34C759] text-white hover:bg-[#34C759]/90"
            aria-label="Filters"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-black/10 text-black/80 hover:text-black dark:bg-black dark:text-white/80 dark:hover:text-white"
          aria-label="More options"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-md border border-black/10 dark:border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-xs text-black/55 dark:bg-[#1C222A] dark:text-white/55">
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  className="border-r border-black/10 px-3 py-2 text-left font-medium last:border-r-0 dark:border-white/10"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {header}
                    <ChevronDown className="h-3 w-3 text-[#34C759]" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, idx) => (
              <tr
                key={row.id}
                className={
                  idx % 2 === 0
                    ? "bg-white dark:bg-[#141A21]"
                    : "bg-gray-50 dark:bg-[#18202A]"
                }
              >
                <td className="border-r border-t border-black/5 px-3 py-2.5 text-black last:border-r-0 dark:border-white/5 dark:text-white">
                  {row.route}
                </td>
                <td className="border-r border-t border-black/5 px-3 py-2.5 text-black/70 last:border-r-0 dark:border-white/5 dark:text-white/70">
                  {row.serviceDate}
                </td>
                <td className="border-r border-t border-black/5 px-3 py-2.5 text-black/85 last:border-r-0 dark:border-white/5 dark:text-white/85">
                  {row.submittedBy}
                </td>
                <td className="border-r border-t border-black/5 px-3 py-2.5 text-black/70 last:border-r-0 dark:border-white/5 dark:text-white/70">
                  {row.stops}
                </td>
                <td className="border-r border-t border-black/5 px-3 py-2.5 text-black/85 last:border-r-0 dark:border-white/5 dark:text-white/85">
                  {row.submissionDate}
                </td>
                <td
                  className={[
                    "border-r border-t border-black/5 px-3 py-2.5 font-medium last:border-r-0 dark:border-white/5",
                    STATUS_CLASS[row.status],
                  ].join(" ")}
                >
                  {row.status}
                </td>
                <td className="border-t border-black/5 px-3 py-2.5 text-[#34C759] dark:border-white/5">
                  <button type="button" className="hover:opacity-80">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 text-sm text-black/70 dark:text-white/70">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="text-[#34C759] hover:opacity-90 disabled:opacity-40"
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {visiblePageButtons.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPage(p)}
            className={
              p === currentPage
                ? "flex h-5 w-5 items-center justify-center rounded bg-[#34C759] text-xs font-medium text-white"
                : "text-xs hover:text-black dark:hover:text-white"
            }
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
          className="text-[#34C759] hover:opacity-90 disabled:opacity-40"
          disabled={currentPage === pageCount}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
