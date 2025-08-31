import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { PUBLIC_ROUTES } from "weddingplanner-shared";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) return NextResponse.next();

  if (!PUBLIC_ROUTES.includes(pathname)) return checkAuth(request);

  return NextResponse.next();
}

async function checkAuth(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  if (request.nextUrl.pathname === "/login") return NextResponse.next();

  if (!accessToken?.value || !refreshToken?.value) return redirectToLogin(request);


  try {
    const secret = new TextEncoder().encode("ThisIsAVerySecretKeyForJWTTokenGenerationPleaseChangeInProduction");
    const { payload } = await jwtVerify(accessToken.value, secret);

    if (!payload.exp) return redirectToLogin(request);

    const expires = payload.exp;

    const expiresDate = new Date(expires * 1000);
    const now = new Date();


    if (expiresDate < now) return redirectToLogin(request);

    const diff = expiresDate.getTime() - now.getTime();


    if (diff < 5 * 60 * 1000) {
      // Token is about to expire, refresh it
      return await refreshAccessToken(refreshToken?.value, request);
    }

    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

async function refreshAccessToken(refreshToken: string | undefined, request: NextRequest) {
  if (!refreshToken) return redirectToLogin(request);

  try {
    // Get the access token as well (might be needed by the backend)
    const accessToken = request.cookies.get("accessToken");

    // Call the backend refresh endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5155/api/v1";
    const cookieHeader = accessToken
      ? `accessToken=${accessToken.value}; refreshToken=${refreshToken}`
      : `refreshToken=${refreshToken}`;

    const response = await fetch(`${apiUrl}/auth/web/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) return redirectToLogin(request);



    // Get the Set-Cookie headers from the response
    const setCookieHeader = response.headers.get('set-cookie');

    // Create a new response that will pass through the cookies
    const nextResponse = NextResponse.next();

    // Parse and set the cookies from the backend response
    if (setCookieHeader) {
      // The set-cookie header might contain multiple cookies separated by commas
      const cookies = setCookieHeader.split(/,(?=\s*\w+=)/);

      cookies.forEach(cookie => {
        const [nameValue, ...options] = cookie.split(';');
        const [name, value] = nameValue.trim().split('=');

        // Extract cookie options
        const cookieOptions: {
          httpOnly?: boolean;
          secure?: boolean;
          sameSite?: boolean | "lax" | "strict" | "none";
          expires?: Date;
          maxAge?: number;
          path?: string;
        } = {};
        options.forEach(option => {
          const [key, val] = option.trim().split('=');
          const lowerKey = key.toLowerCase();

          if (lowerKey === 'httponly') cookieOptions.httpOnly = true;
          else if (lowerKey === 'secure') cookieOptions.secure = true;
          else if (lowerKey === 'samesite') cookieOptions.sameSite = val?.toLowerCase() as boolean | "lax" | "strict" | "none";
          else if (lowerKey === 'expires') cookieOptions.expires = new Date(val);
          else if (lowerKey === 'max-age') cookieOptions.maxAge = parseInt(val);
          else if (lowerKey === 'path') cookieOptions.path = val;
        });

        nextResponse.cookies.set(name, value, cookieOptions);
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("accessToken");
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
