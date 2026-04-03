"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/error-boundary";

interface ReportDetailPageProps {
  reportId: string | undefined;
}

export function ReportDetailPage({ reportId }: ReportDetailPageProps) {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/dashboard/reports"
              className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Link>
          </Button>
        </div>

        <Card className="border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]/95">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Report {reportId ?? "—"}
            </h2>
            <p className="mt-2 text-sm text-black/50 dark:text-white/50">
              Report detail view. Content can be loaded dynamically by ID.
            </p>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
