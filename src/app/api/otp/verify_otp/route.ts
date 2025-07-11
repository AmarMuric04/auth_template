import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { signJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, code, type, username, firstName, lastName } = await req.json();
  if (!email || !code || !["signup", "signin"].includes(type)) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing or invalid parameters",
        errors: {
          code: "Missing or invalid parameters",
        },
      },
      { status: 400 }
    );
  }

  const otp = await prisma.otpVerification.findUnique({
    where: {
      email,
      code,
      expiresAt: { gte: new Date() },
    },
  });

  if (!otp) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired OTP",
        errors: {
          code: "Invalid or expired OTP",
        },
      },
      { status: 400 }
    );
  }

  try {
    await prisma.otpVerification.delete({ where: { id: otp.id } });

    let user;

    if (type === "signin") {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (type === "signup") {
      user = await prisma.user.create({
        data: { email, username, firstName, lastName },
      });
    }

    if (!user)
      return NextResponse.json(
        {
          success: false,
          message: "No user with that email found",
          errors: {
            code: "No user with that email found",
          },
        },
        { status: 404 }
      );

    const token = await signJwt({ userId: user.id, email: user.email });

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified.",
      user,
      token,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
