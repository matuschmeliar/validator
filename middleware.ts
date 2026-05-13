import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "idea_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes — login page, login/logout endpoints, static
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !(await isValid(token))) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

async function isValid(token: string): Promise<boolean> {
  try {
    const s = process.env.SESSION_SECRET;
    if (!s || s.length < 32) return false;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(s));
    return typeof payload.email === "string";
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
