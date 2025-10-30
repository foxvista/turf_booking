import { NextRequest, NextResponse } from "next/server";
import { handleError } from "./helpers/errorHelper";

export async function middleware(request) {
  try {
    const path = request.nextUrl.pathname;

    const isPublicaPath = path === "/login" || path === "/signup";

    const token = request.cookies.get("token")?.value || null;

    if (token && isPublicaPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!token && !isPublicaPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    return handleError(error);
  }
}

export const config = {
  matcher: [
    "/api/user/logout",
    "/api/user/profile",
    "/api/user/group/:path*",
    "/api/user/matches/createMatch",
    "/api/admin/turf/:path*",
  ],
};
