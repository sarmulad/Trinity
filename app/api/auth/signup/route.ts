import { NextResponse } from "next/server";

/**
 * POST /api/auth/signup
 * Mock user registration endpoint - will be replaced with Tago.io integration
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Mock user creation
    // TODO: Replace with Tago.io user creation and email verification
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    // Mock created user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || null,
      role: "operator",
      organization: "Trinity Energy",
      permissions: ["wells:view", "alerts:view", "reports:view"],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        user,
        token: "mock_jwt_token_" + Date.now(),
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(" Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
