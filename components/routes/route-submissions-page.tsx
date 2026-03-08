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

const MOCK_SUBMISSIONS: SubmissionRow[] = Array.from({ length: 36 }).map((_, idx) => {
  const base = BASE_ROWS[idx % BASE_ROWS.length];
  return {
    id: `${idx + 1}`,
    ...base,
  };
});

const PAGE_SIZE = 14;

const STATUS_CLASS: Record<SubmissionStatus, string> = {
  Completed: "text-[#34C759]",
  Skipped: "text-[#FF383C]",
  Partial: "text-[#FFB020]",
};

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

    return MOCK_SUBMISSIONS.filter((row) => {
      return (
        row.route.toLowerCase().includes(q) ||
        row.submittedBy.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
      );
    });
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
    ? `/dashboard/routes/${encodeURIComponent(routeId)}${
        routeName ? `?name=${encodeURIComponent(routeName)}` : ""
      }`
    : "/dashboard/routes";

  const visiblePageButtons = Array.from(
    { length: Math.min(5, pageCount) },
    (_, idx) => idx + 1,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#34C759]/70 text-[#34C759] transition-colors hover:bg-[#34C759]/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
        <h2 className="text-4xl font-semibold tracking-tight text-white">
          Route Submissions
        </h2>
      </div>

      <section className="rounded-xl border border-white/10 bg-[#1A1D22]/80 p-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/45" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search Submissions"
                className="h-10 w-[180px] rounded-md border border-white/25 bg-[#171B21] py-2 pl-8 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[#34C759]/60 focus:outline-none"
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
            className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white/80 hover:text-white"
            aria-label="More options"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-md border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1C222A] text-xs text-white/55">
              <tr>
                {[
                  "Route",
                  "Service Date",
                  "Submitted by",
                  "Stops",
                  "Submission Date",
                  "Status",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="border-r border-white/10 px-3 py-2 text-left font-medium last:border-r-0"
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
                  className={idx % 2 === 0 ? "bg-[#141A21]" : "bg-[#18202A]"}
                >
                  <td className="border-r border-t border-white/5 px-3 py-2.5 text-white last:border-r-0">
                    {row.route}
                  </td>
                  <td className="border-r border-t border-white/5 px-3 py-2.5 text-white/70 last:border-r-0">
                    {row.serviceDate}
                  </td>
                  <td className="border-r border-t border-white/5 px-3 py-2.5 text-white/85 last:border-r-0">
                    {row.submittedBy}
                  </td>
                  <td className="border-r border-t border-white/5 px-3 py-2.5 text-white/70 last:border-r-0">
                    {row.stops}
                  </td>
                  <td className="border-r border-t border-white/5 px-3 py-2.5 text-white/85 last:border-r-0">
                    {row.submissionDate}
                  </td>
                  <td
                    className={[
                      "border-r border-t border-white/5 px-3 py-2.5 font-medium last:border-r-0",
                      STATUS_CLASS[row.status],
                    ].join(" ")}
                  >
                    {row.status}
                  </td>
                  <td className="border-t border-white/5 px-3 py-2.5 text-[#34C759]">
                    <button type="button" className="hover:opacity-80">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 text-sm text-white/70">
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
              type="button"
              key={p}
              onClick={() => setPage(p)}
              className={
                p === currentPage
                  ? "flex h-5 w-5 items-center justify-center rounded bg-[#34C759] text-xs font-medium text-white"
                  : "text-xs hover:text-white"
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
