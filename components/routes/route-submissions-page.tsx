"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { RouteSubmissionsSection } from "./route-submissions-section";

interface RouteSubmissionsPageProps {
  routeId?: string;
  routeName?: string;
}

export function RouteSubmissionsPage({
  routeId,
  routeName,
}: RouteSubmissionsPageProps) {
  const backHref = routeId
    ? `/dashboard/routes/${encodeURIComponent(routeId)}${routeName ? `?name=${encodeURIComponent(routeName)}` : ""}`
    : "/dashboard/routes";

  return (
    <div className="space-y-5">
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

      <RouteSubmissionsSection routeFilter={routeName} />
    </div>
  );
}
