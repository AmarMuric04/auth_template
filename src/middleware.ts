import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/signin", "/signup", "/otp"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  let isAuthenticated = false;

  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      await verifyJwt(token);
      isAuthenticated = true;
    } catch (err) {
      console.log("JWT failed:", err);
    }
  }

  const nextAuthToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (nextAuthToken) {
    isAuthenticated = true;
  }

  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
