import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { SessionPayload } from "@/lib/session";

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getSession(req);

  if (pathname.startsWith("/course") || pathname.startsWith("/lesson")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Students must have paid; staff and admin always have access
    if (session.role === "student" && !session.hasPaid) {
      return NextResponse.redirect(new URL("/?unpaid=1", req.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!session || (session.role !== "staff" && session.role !== "admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/course/:path*", "/lesson/:path*", "/admin/:path*"],
};
