import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { REFRESH_COOKIE } from "@/lib/auth-session";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(REFRESH_COOKIE)?.value);

  if (!hasSession && !isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|.*\\..*).*)"],
};
