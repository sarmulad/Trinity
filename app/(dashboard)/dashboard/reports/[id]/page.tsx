"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/error-boundary";

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/reports" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Link>
          </Button>
        </div>
        <Card className="border-white/10 bg-[#1A1C1E]/95">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-foreground">
              Report {id ?? "—"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Report detail view. Content can be loaded dynamically by ID.
            </p>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
