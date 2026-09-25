import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Next.js 16 proxy (antes middleware) — se ejecuta en Node 26 con Fetch API.
 *
 * En Next 16 el archivo puede llamarse `middleware.ts` o `proxy.ts`. Si se
 * llama `proxy.ts`, la función exportada debe llamarse `proxy` (no
 * `middleware`); es el patrón que ya usábamos.
 *
 * Toda la lógica trabaja con `request.nextUrl` y `NextResponse.redirect`,
 * ambos compatibles con la Web Fetch API estándar (no requiere `undici`
 * ni polyfills bajo Node 26).
 */
const DASHBOARD_ROUTE = "/dashboard";
const LOGIN_ROUTE = "/login";

export function proxy(request: NextRequest): NextResponse {
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
  // matcher en formato path-to-regexp v6 (compatible con Next 16).
  matcher: ["/", "/login", "/dashboard/:path*"],
};
