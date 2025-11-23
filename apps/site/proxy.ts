import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DASHBOARD_ROUTE = "/dashboard";
const LOGIN_ROUTE = "/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get("userId")?.value;
  const isAuthRoute = pathname.startsWith(LOGIN_ROUTE);
  const isProtectedRoute = pathname.startsWith(DASHBOARD_ROUTE);
  const isRootRoute = pathname === "/";

  if (isProtectedRoute && !userId) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && userId) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
  }

  if (isRootRoute) {
    return NextResponse.redirect(
      new URL(userId ? DASHBOARD_ROUTE : LOGIN_ROUTE, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
