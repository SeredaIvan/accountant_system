import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const PUBLIC_PATHS = ["/login", "/register", "/","/api/v1.0/users/login"];
const API_PROTECTED = ["/api/v1.0/users/add"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return pathname.startsWith("/api")
      ? NextResponse.json({ error: "Not authorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as any;
    const role = decoded.role;

    if (pathname.startsWith("/api")) {
      if (API_PROTECTED.includes(pathname) && role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.next();
    }

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return pathname.startsWith("/api")
      ? NextResponse.json({ error: "Invalid token" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
