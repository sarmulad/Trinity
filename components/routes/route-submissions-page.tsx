"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
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

const MOCK_SUBMISSIONS: SubmissionRow[] = Array.from({ length: 36 }).map(
  (_, idx) => ({
    id: `${idx + 1}`,
    ...BASE_ROWS[idx % BASE_ROWS.length],
  }),
);

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

interface RouteSubmissionsPageProps {
  routeId?: string;
  routeName?: string;
}

export function RouteSubmissionsPage({
  routeId,
  routeName,
}: RouteSubmissionsPageProps) {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_SUBMISSIONS;
    return MOCK_SUBMISSIONS.filter(
      (row) =>
        row.route.toLowerCase().includes(q) ||
        row.submittedBy.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q),
    );
  }, [search]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  React.useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const paginatedRows = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, currentPage]);

  const backHref = routeId
    ? `/dashboard/routes/${encodeURIComponent(routeId)}${routeName ? `?name=${encodeURIComponent(routeName)}` : ""}`
    : "/dashboard/routes";

  const visiblePageButtons = Array.from(
    { length: Math.min(5, pageCount) },
    (_, i) => i + 1,
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#34C759]/70 text-[#34C759] transition-colors hover:bg-[#34C759]/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
        <h2 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
          Route Submissions
        </h2>
      </div>

      <section className="rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-[#1A1D22]/80">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/45 dark:text-white/45" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search Submissions"
                className="h-10 w-[180px] rounded-md border border-black/25 bg-gray-100 py-2 pl-8 pr-3 text-sm text-black placeholder:text-black/40 focus:border-[#34C759]/60 focus:outline-none dark:border-white/25 dark:bg-[#171B21] dark:text-white dark:placeholder:text-white/40"
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

        {/* Table */}
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

        {/* Pagination */}
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
    </div>
  );
}
