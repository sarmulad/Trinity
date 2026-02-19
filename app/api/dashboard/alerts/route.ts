import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/alerts
 * Returns recent alerts and notifications
 * TODO: Replace with Tago.io alert system
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get("severity");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock alerts data
    let alerts = [
      {
        id: "alert_1",
        wellId: "1",
        wellName: "NF-127",
        type: "pressure-high",
        severity: "critical",
        message: "Pressure exceeding 3500 psi threshold",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
      },
      {
        id: "alert_2",
        wellId: "2",
        wellName: "SF-042",
        type: "temperature-high",
        severity: "high",
        message: "Temperature above normal operating range",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
      },
      {
        id: "alert_3",
        wellId: null,
        wellName: null,
        type: "maintenance-due",
        severity: "medium",
        message: "Monthly production report has been generated",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        acknowledged: true,
        acknowledgedBy: "John Operator",
        acknowledgedAt: new Date(
          Date.now() - 23 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: "alert_4",
        wellId: "5",
        wellName: "NF-098",
        type: "production-low",
        severity: "medium",
        message: "Production below average for past 6 hours",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        acknowledged: true,
        acknowledgedBy: "Jane Engineer",
        acknowledgedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "alert_5",
        wellId: "3",
        wellName: "EF-089",
        type: "safety",
        severity: "low",
        message: "Routine safety inspection scheduled for next week",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
      },
    ];

    // Filter by severity if provided
    if (severity) {
      alerts = alerts.filter((alert) => alert.severity === severity);
    }

    return NextResponse.json(
      {
        alerts,
        total: alerts.length,
        unacknowledged: alerts.filter((a) => !a.acknowledged).length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Alerts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/dashboard/alerts/[id]
 * Acknowledge an alert
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { alertId, acknowledgedBy } = body;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Mock alert acknowledgment
    return NextResponse.json(
      {
        success: true,
        alertId,
        acknowledgedAt: new Date().toISOString(),
        acknowledgedBy,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Alert acknowledgment error:", error);
    return NextResponse.json(
      { error: "Failed to acknowledge alert" },
      { status: 500 }
    );
  }
}
