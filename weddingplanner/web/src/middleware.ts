import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = [
    "/dashboard",
    "/register",
    "/forgot-password",
    "/reset-password",
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/api")) return NextResponse.next();

    // TODO
    // if (pathname.startsWith("/protected")) return checkAuth(request);
    if (publicRoutes.includes(pathname)) return checkAuth(request);

    return NextResponse.next();
}

async function checkAuth(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken");
    const refreshToken = request.cookies.get("refreshToken");

    if (request.nextUrl.pathname === "/login") return NextResponse.next();

    if (!accessToken?.value || !refreshToken?.value)
        return redirectToLogin(request);

    try {
        const secret = new TextEncoder().encode(
            "your-secret-key-change-in-production"
        );
        const { payload } = await jwtVerify(accessToken.value, secret);
        if (!payload.exp) return redirectToLogin(request);

        const expires = payload.exp;

        const expiresDate = new Date(expires * 1000);
        const now = new Date();

        if (expiresDate < now) return redirectToLogin(request);

        const diff = expiresDate.getTime() - now.getTime();

        if (diff < 5 * 60 * 1000)
            await refreshAccessToken(refreshToken?.value, request);

        return NextResponse.next();
    } catch {
        return redirectToLogin(request);
    }
}

async function refreshAccessToken(
    refreshToken: string | undefined,
    request: NextRequest
) {
    if (!refreshToken) return redirectToLogin(request);
    throw new Error("Refresh failed because its not implemented yet");
}

function redirectToLogin(request: NextRequest) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("authToken");
    response.cookies.delete("refreshToken");
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Static assets (images, fonts, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.woff|.*\\.woff2|.*\\.ttf|.*\\.eot).*)",
    ],
};
