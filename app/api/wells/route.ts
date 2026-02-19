import { NextResponse } from "next/server";

/**
 * GET /api/wells
 * Returns list of all wells with current production data
 * TODO: Replace with Tago.io device data
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const status = searchParams.get("status");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Mock wells data
    let wells = [
      {
        id: "1",
        name: "NF-127",
        region: "North Field",
        location: {
          latitude: 31.8547,
          longitude: -102.3676,
          address: "Midland County, TX",
        },
        status: "alert",
        type: "oil",
        productionData: {
          oil: {
            current: 487,
            daily: 487,
            monthly: 14610,
            unit: "bbl/d",
            trend: -5.2,
          },
          gas: {
            current: 3240,
            daily: 3240,
            monthly: 97200,
            unit: "mcf/d",
            trend: 2.1,
          },
          water: {
            current: 125,
            daily: 125,
            monthly: 3750,
            unit: "bbl/d",
            trend: 8.5,
          },
          pressure: 3580,
          temperature: 178,
        },
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        alerts: [
          {
            id: "alert_1",
            type: "pressure-high",
            severity: "critical",
            message: "Pressure exceeding 3500 psi threshold",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            acknowledged: false,
          },
        ],
      },
      {
        id: "2",
        name: "SF-042",
        region: "South Field",
        location: {
          latitude: 31.7456,
          longitude: -102.1234,
          address: "Martin County, TX",
        },
        status: "active",
        type: "oil",
        productionData: {
          oil: {
            current: 523,
            daily: 523,
            monthly: 15690,
            unit: "bbl/d",
            trend: 3.7,
          },
          gas: {
            current: 3560,
            daily: 3560,
            monthly: 106800,
            unit: "mcf/d",
            trend: 4.2,
          },
          water: {
            current: 98,
            daily: 98,
            monthly: 2940,
            unit: "bbl/d",
            trend: -2.1,
          },
          pressure: 3200,
          temperature: 165,
        },
        lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        alerts: [],
      },
      {
        id: "3",
        name: "EF-089",
        region: "East Field",
        location: {
          latitude: 31.9876,
          longitude: -102.5432,
          address: "Upton County, TX",
        },
        status: "active",
        type: "oil",
        productionData: {
          oil: {
            current: 612,
            daily: 612,
            monthly: 18360,
            unit: "bbl/d",
            trend: 7.8,
          },
          gas: {
            current: 4120,
            daily: 4120,
            monthly: 123600,
            unit: "mcf/d",
            trend: 6.5,
          },
          water: {
            current: 142,
            daily: 142,
            monthly: 4260,
            unit: "bbl/d",
            trend: 5.3,
          },
          pressure: 3350,
          temperature: 172,
        },
        lastUpdated: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        alerts: [],
      },
      {
        id: "4",
        name: "WF-015",
        region: "West Field",
        location: {
          latitude: 31.6543,
          longitude: -102.8765,
          address: "Reeves County, TX",
        },
        status: "maintenance",
        type: "oil",
        productionData: {
          oil: {
            current: 0,
            daily: 0,
            monthly: 0,
            unit: "bbl/d",
            trend: 0,
          },
          gas: {
            current: 0,
            daily: 0,
            monthly: 0,
            unit: "mcf/d",
            trend: 0,
          },
          water: {
            current: 0,
            daily: 0,
            monthly: 0,
            unit: "bbl/d",
            trend: 0,
          },
          pressure: 0,
          temperature: 0,
        },
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        alerts: [],
      },
      {
        id: "5",
        name: "NF-098",
        region: "North Field",
        location: {
          latitude: 31.8912,
          longitude: -102.4123,
          address: "Midland County, TX",
        },
        status: "active",
        type: "oil",
        productionData: {
          oil: {
            current: 445,
            daily: 445,
            monthly: 13350,
            unit: "bbl/d",
            trend: 1.2,
          },
          gas: {
            current: 2980,
            daily: 2980,
            monthly: 89400,
            unit: "mcf/d",
            trend: -0.8,
          },
          water: {
            current: 87,
            daily: 87,
            monthly: 2610,
            unit: "bbl/d",
            trend: 3.4,
          },
          pressure: 3150,
          temperature: 168,
        },
        lastUpdated: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        alerts: [],
      },
    ];

    // Filter by region if provided
    if (region) {
      wells = wells.filter((well) => well.region === region);
    }

    // Filter by status if provided
    if (status) {
      wells = wells.filter((well) => well.status === status);
    }

    return NextResponse.json(
      {
        wells,
        total: wells.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Wells fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wells data" },
      { status: 500 }
    );
  }
}
