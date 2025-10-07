import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicaPath = path === "/login" || path === "/signup";

  const token = request.cookies.get("token")?.value || null;

  if (token && isPublicaPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !isPublicaPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/api/user/logout", "/api/user/profile"],
};
