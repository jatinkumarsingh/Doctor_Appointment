import { NextResponse } from "next/server";
const AUTH_COOKIE_NAME = "auth_token";

const protectedMatchers = [
  "/doctors",
  "/onboarding",
  "/doctor",
  "/admin",
  "/video-call",
  "/appointments",
];

function isProtectedPath(pathname) {
  return protectedMatchers.some(
    (basePath) => pathname === basePath || pathname.startsWith(`${basePath}/`)
  );
}

export default function middleware(req) {
  if (!isProtectedPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/doctors/:path*",
    "/onboarding/:path*",
    "/doctor/:path*",
    "/admin/:path*",
    "/video-call/:path*",
    "/appointments/:path*",
  ],
};
