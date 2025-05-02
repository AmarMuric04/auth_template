import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

const PUBLIC_PATHS = ["/signin", "/signup", "/otp"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  let isAuthenticated = false;

  if (token) {
    try {
      await verifyJwt(token);
      isAuthenticated = true;
    } catch (err) {
      console.log(err);
      isAuthenticated = false;
    }
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
