import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken");

    if (!accessToken?.value) {
      return NextResponse.json({ isAuthenticated: false });
    }

    const secret = new TextEncoder().encode("your-secret-key-change-in-production");
    const { payload } = await jwtVerify(accessToken.value, secret);

    if (!payload.exp) {
      return NextResponse.json({ isAuthenticated: false });
    }

    const expiresDate = new Date(payload.exp * 1000);
    const now = new Date();

    if (expiresDate < now) {
      return NextResponse.json({ isAuthenticated: false });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
      },
    });
  } catch {
    return NextResponse.json({ isAuthenticated: false });
  }
}
