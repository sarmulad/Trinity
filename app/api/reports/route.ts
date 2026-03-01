import { NextResponse } from "next/server";
import type { ReportListItem } from "@/types";

/**
 * GET /api/reports
 * Returns list of reports for the dashboard reports table.
 * Query: from, to (ISO date strings) for server-side date filter (optional).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    await new Promise((resolve) => setTimeout(resolve, 300));

    const mockReports: ReportListItem[] = [
      {
        id: "1",
        date: "4/1/24",
        reportName: "Union Familly Lease: Oil Tank #1/#2",
        author: "John Doe",
        status: "Ready",
      },
      {
        id: "2",
        date: "4/2/24",
        reportName: "Western Oil Corp Report",
        author: "John Doe",
        status: "Ready",
      },
      {
        id: "3",
        date: "4/3/24",
        reportName: "Johnson Lease: Johnson #1 - 3/1/24 - 3/30/24",
        author: "John Doe",
        status: "Ready",
      },
      {
        id: "4",
        date: "4/3/24",
        reportName: "Johnson Lease: Johnson #1 - 2/1/24 - 2/30/24",
        author: "John Doe",
        status: "Ready",
      },
      {
        id: "5",
        date: "4/3/24",
        reportName: "Teasley Lease: Water Tank - 3/6/24 - 3/12/24",
        author: "John Doe",
        status: "Ready",
      },
      {
        id: "6",
        date: "4/3/24",
        reportName: "Trinity Energy Report",
        author: "John Doe",
        status: "Ready",
      },
    ];

    let reports = mockReports;

    if (fromParam || toParam) {
      const parseDisplayDate = (s: string) => {
        const [m, d, y] = s.split("/").map(Number);
        return new Date(2000 + (y % 100), m - 1, d);
      };
      const from = fromParam ? new Date(fromParam) : null;
      const to = toParam ? new Date(toParam) : null;
      reports = mockReports.filter((r) => {
        const reportDate = parseDisplayDate(r.date);
        if (from && reportDate < from) return false;
        if (to && reportDate > to) return false;
        return true;
      });
    }

    return NextResponse.json(
      { reports, total: reports.length, timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reports fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
