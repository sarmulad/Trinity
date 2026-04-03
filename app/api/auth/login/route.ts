import { NextResponse } from "next/server";

/**
 * POST /api/auth/login
 * Mock authentication endpoint - will be replaced with Tago.io integration
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock authentication - accept any email/password for now
    // TODO: Replace with Tago.io authentication
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    // Mock user data
    const user = {
      id: "1",
      name: "John Operator",
      email: email,
      role: "operator",
      organization: "Trinity Energy",
      permissions: ["wells:view", "alerts:view", "reports:view"],
    };

    return NextResponse.json(
      {
        success: true,
        user,
        token: "mock_jwt_token_" + Date.now(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
