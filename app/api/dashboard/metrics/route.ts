import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/metrics
 * Returns dashboard metrics and KPIs
 * TODO: Replace with Tago.io data aggregation
 */
export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock dashboard metrics
    const metrics = {
      totalOilProduction: {
        value: 24567,
        unit: "bbl/d",
        trend: 12.5,
        isPositive: true,
        previousValue: 21845,
      },
      totalGasProduction: {
        value: 156234,
        unit: "mcf/d",
        trend: 8.3,
        isPositive: true,
        previousValue: 144287,
      },
      activeWells: {
        value: 47,
        total: 52,
        trend: 2,
        isPositive: true,
        previousValue: 46,
      },
      criticalAlerts: {
        value: 3,
        trend: 25,
        isPositive: false,
        previousValue: 4,
        breakdown: {
          critical: 3,
          high: 8,
          medium: 12,
          low: 5,
        },
      },
      efficiency: {
        value: 87.5,
        unit: "%",
        trend: 2.3,
        isPositive: true,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    console.error(" Metrics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
