import { NextResponse } from "next/server";

/**
 * GET /api/production/history
 * Returns historical production data for charts
 * TODO: Replace with Tago.io time-series data
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wellId = searchParams.get("wellId");
    const range = searchParams.get("range") || "30d";
    const metric = searchParams.get("metric") || "oil";

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Generate mock time-series data
    const generateData = (
      days: number,
      baseValue: number,
      variance: number
    ) => {
      const data = [];
      const now = new Date();

      for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        const randomVariance = (Math.random() - 0.5) * variance;
        const trend = (days - i) * 0.5; // Slight upward trend
        const value = baseValue + randomVariance + trend;

        data.push({
          timestamp: date.toISOString(),
          value: Math.max(0, Math.round(value)),
          label: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        });
      }

      return data;
    };

    let days = 30;
    if (range === "7d") days = 7;
    else if (range === "90d") days = 90;

    // Generate data based on metric type
    let data = [];
    if (metric === "oil") {
      data = generateData(days, 500, 100);
    } else if (metric === "gas") {
      data = generateData(days, 3500, 500);
    } else if (metric === "water") {
      data = generateData(days, 100, 20);
    }

    return NextResponse.json(
      {
        data,
        wellId,
        metric,
        range,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Production history fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch production history" },
      { status: 500 }
    );
  }
}
